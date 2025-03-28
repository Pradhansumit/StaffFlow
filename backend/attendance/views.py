from accounts.permission import Employee_Permission
from attendance.models import Attendance
from attendance.serializer import AttendanceSerializer
from django.contrib.auth import get_user_model
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
            attendance = Attendance.objects.filter(
                user=user.id, check_out__isnull=True
            ).first()
            if attendance:
                attendance.check_out = timezone.now()
                attendance.save()

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
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Employee_ChecksOut_Attendance(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            user = request.user.id
            attendance = Attendance.objects.filter(
                user=user.id, check_out__is_null=True
            ).first()
            attendance.check_out = timezone.now()
            attendance.save()
            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
