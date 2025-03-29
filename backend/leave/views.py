from accounts.permission import Admin_Permission
from leave.models import LeaveType
from leave.serializer import LeaveTypeSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


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
