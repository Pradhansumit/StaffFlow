import traceback

from accounts.permission import Admin_Permission, Employee_Permission
from attendance.views import USER
from django.utils import timezone
from leave.models import LeaveRequest, LeaveType
from leave.serializer import (
    LeaveRequestSerializer,
    LeaveRequestViewSerializer,
    LeaveTypeSerializer,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# LEAVETYPES REQUESTS


class Admin_Add_LeaveType(APIView):
    """
    Admin adds leave types.
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            # Prevent from adding same leave type with different case.
            if LeaveType.objects.filter(name__iexact=request.data.get("name")):
                return Response(
                    {"error": "Value already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = LeaveTypeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Delete_LeaveType(APIView):
    """
    Admin delete leave types.
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            leave = LeaveType.objects.filter(id=id).first()
            if leave:
                leave.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Update_LeaveType(APIView):
    """
    Admin update leave types.
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")

            leave = LeaveType.objects.filter(id=id).first()
            if leave:
                serializer = LeaveTypeSerializer(
                    instance=leave, data=request.data, partial=True
                )
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_List_LeaveType(APIView):
    """
    Admin list all leave types.
    """

    permission_classes = [Admin_Permission]

    def get(self, request) -> Response:
        try:
            return Response(LeaveType.objects.all().values(), status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            leave = LeaveType.objects.filter(id=id).first()
            if leave:
                serializer = LeaveTypeSerializer(leave)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


# LEAVEREQUEST REQUESTS


class Employee_Add_LeaveRequest(APIView):
    permission_classes = [Employee_Permission]

    def post(self, request) -> Response:
        try:
            _data = request.data.copy()

            # user = USER.objects.filter(username=request.user).first()
            # employee = Employee.objects.filter(user=user.id).first()
            # _data["employee"] = employee.id

            # leave_type = LeaveType.objects.filter(id=_data["leave_type"]).first()
            # _data["leave_type"] = leave_type.id

            _data["user"] = request.user.id

            serializer = LeaveRequestSerializer(data=_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Employee_ViewAll_LeaveRequest(APIView):
    permission_classes = [Employee_Permission]

    def get(self, request) -> Response:
        try:
            # user = USER.objects.filter(username=request.user).first()
            # employee = Employee.objects.filter(user=user.id).first()

            leave_requests = LeaveRequest.objects.filter(user=request.user)
            serializer = LeaveRequestSerializer(leave_requests, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_View_LeaveRequests(APIView):
    permission_classes = [Admin_Permission]

    # for all leaves
    def get(self, request) -> Response:
        try:
            leaves = LeaveRequest.objects.all()
            response = LeaveRequestViewSerializer(leaves, many=True)

            return Response(response.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(traceback.print_exc())
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    # to look for particular employee leaves
    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            leave = LeaveRequest.objects.filter(id=id).first()
            if leave:
                serializer = LeaveRequestSerializer(leave)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Approve_LeaveRequest(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            leave = LeaveRequest.objects.filter(id=id).first()

            if leave:
                _status = request.data.get("status")
                if _status == 0:
                    leave.status = 0
                    leave.approved_time = timezone.now()
                    leave.save()
                    return Response(status=status.HTTP_200_OK)
                elif _status == 1:
                    leave.status = 1
                    leave.approved_time = timezone.now()
                    leave.save()
                    return Response(status=status.HTTP_200_OK)
                elif _status == 2:
                    leave.status = 2
                    leave.approved_time = timezone.now()
                    leave.save()
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"error": "Invalid status choice."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
