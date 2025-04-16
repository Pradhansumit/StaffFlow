import calendar
import traceback
from datetime import datetime

from accounts.models import CustomUser
from accounts.permission import Admin_Permission, Employee_Permission
from attendance.models import Attendance
from attendance.serializer import AttendanceReportSerializer, AttendanceSerializer
from django.contrib.auth import get_user_model
from django.db.models import OuterRef, Subquery
from django.utils import timezone
from holiday.models import Holiday
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

USER = get_user_model()


class Employee_ChecksIn_Attendance(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            user = USER.objects.get(username=request.user.username)

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
            print(traceback.print_exc())
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Employee_ChecksOut_Attendance(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            user = USER.objects.get(username=request.user.username)
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


class Admin_View_MonthsAttendance(APIView):
    from rest_framework.permissions import AllowAny

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            selected_month = request.data.get("month", timezone.now().month)
            selected_year = request.data.get("year", timezone.now().year)

            _, num_days = calendar.monthrange(selected_year, selected_month)

            all_dates = [
                datetime(selected_year, selected_month, day).date()
                for day in range(1, num_days + 1)
            ]

            holidays = Holiday.objects.filter(
                date__month=selected_month, date__year=selected_year
            )
            holiday_dates = {holiday.date: holiday.name for holiday in holidays}

            data = []

            users = CustomUser.objects.all()
            for user in users:
                user_data = {
                    "id": user.id,
                    "name": f"{user.first_name} {user.last_name}",
                    "daily_attendance": [],
                }

                for date in all_dates:
                    attendance = Attendance.objects.filter(
                        user=user, check_in__date=date
                    ).first()

                    if attendance:
                        user_data["daily_attendance"].append(
                            {
                                "date": date,
                                "check_in": attendance.check_in,
                                "check_out": attendance.check_out,
                                "status": "Present",
                            }
                        )
                    else:
                        if date in holiday_dates:
                            status_level = "Holiday"
                        elif date.weekday() in [5, 6]:
                            status_level = "Weekend"
                        else:
                            status_level = "Absent"

                        user_data["daily_attendance"].append(
                            {
                                "date": date,
                                "check_in": None,
                                "check_out": None,
                                "status": status_level,
                            }
                        )

                data.append(user_data)

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            print(traceback.format_exc())
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
