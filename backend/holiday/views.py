from accounts.permission import Admin_Permission
from holiday.models import Holiday
from holiday.serializer import HolidaySerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class Admin_Add_Holiday(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            serializer = HolidaySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Delete_Holiday(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            if not id:
                return Response(
                    {"error": "id not provided."}, status=status.HTTP_400_BAD_REQUEST
                )

            holiday = Holiday.objects.filter(id=id)

            if holiday.count():
                holiday.first().delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Value does not exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_Update_Holiday(APIView):
    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            if not id:
                return Response(
                    {"error": "id not provided."}, status=status.HTTP_400_BAD_REQUEST
                )

            holiday = Holiday.objects.filter(id=id).first()

            if holiday:
                serializer = HolidaySerializer(
                    instance=holiday, data=request.data, partial=True
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
                    {"error": "Value does not exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class Admin_List_Holiday(APIView):

    permission_classes = [Admin_Permission]

    def get(self, request) -> Response:
        try:
            return Response(Holiday.objects.all().values(), status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")

            if not id:
                return Response(
                    {"error": "id not provided."}, status=status.HTTP_400_BAD_REQUEST
                )

            holiday = Holiday.objects.filter(id=id).first()
            if holiday:
                serializer = HolidaySerializer(holiday)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Value does not exists."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
