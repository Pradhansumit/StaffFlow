from tabnanny import check
from xml.etree.ElementPath import prepare_self

from accounts.models import CustomUser
from accounts.permission import Admin_Permission, Employee_Permission
from attendance.models import Attendance
from attendance.serializer import AttendanceReportSerializer, AttendanceSerializer
from django.contrib.auth import get_user_model
from django.core import serializers
from django.db.models import CharField, OuterRef, Subquery, Value
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

USER = get_user_model()


class Employee_ChecksIn_Attendance(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            user = USER.objects.get(username=request.user)

            # In case if an employee forgets to checkout and trying to check in.
            attendance = Attendance.objects.filter(user=user.id, check_out__isnull=True)

            if attendance:
                return Response(
                    {"error": "You have not checkout your previous checkin."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # In case if an employee already checkout for the current date (at any time),
            # then it is invalid for employee to mark any other attendance.
            is_checkedout = Attendance.objects.filter(
                user=user.id,
                check_in__date=timezone.now().date(),
                check_out__date=timezone.now().date(),
            )
            print(is_checkedout)
            if not is_checkedout:
                _data = request.data.copy()

                _data["user"] = user.id

                serializer = AttendanceSerializer(data=_data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response(
                {"error": "Attendance is already marked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Employee_ChecksOut_Attendance(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            user = USER.objects.get(username=request.user)
            attendance = Attendance.objects.filter(
                user=user.id, check_out__isnull=True
            ).first()
            if attendance:
                attendance.check_out = timezone.now()
                attendance.save()
                return Response(status=status.HTTP_200_OK)

            return Response(
                {"error": "No check-in to mark check-out."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_View_TodaysAttendance(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            selected_date = request.data.get("date", timezone.now().date())

            # Subqueries to get attendance details for each user
            attendance_subquery = Attendance.objects.filter(
                user=OuterRef("pk"), check_in__date=selected_date
            ).values("id")[
                :1
            ]  # Check if attendance exists

            checkin_subquery = Attendance.objects.filter(
                user=OuterRef("pk"), check_in__date=selected_date
            ).values("check_in")[:1]

            checkout_subquery = Attendance.objects.filter(
                user=OuterRef("pk"), check_in__date=selected_date
            ).values("check_out")[:1]

            # Fetch all users and annotate their attendance data
            users = CustomUser.objects.annotate(
                has_attendance=Subquery(
                    attendance_subquery
                ),  # Check if attendance exists
                check_in=Subquery(checkin_subquery),
                check_out=Subquery(checkout_subquery),
            )
            serializer = AttendanceReportSerializer(users, many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
