import traceback

from accounts.permission import Admin_Permission
from accounts.serializer import EmployeeSerializer, MyTokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from utils.profile_creation import generate_profile_image

# from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class Login(APIView):
    """
    Returns access and refresh token when user sends correct credentials.
    """

    permission_classes = [AllowAny]

    def post(self, request) -> Response:
        try:
            username: str = request.data["username"]
            password: str = request.data["password"]

            if username == "" or password == "":
                return Response(status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)

            if user is not None:
                refresh_token = MyTokenObtainPairSerializer.get_token(user=user)
                return Response(
                    {
                        "refreshtoken": str(refresh_token),
                        "accesstoken": str(refresh_token.access_token),
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"error": "Invalid username or password"}, status.HTTP_401_UNAUTHORIZED
            )

        except Exception as ex:
            print(traceback.format_exc())
            return Response(str(ex), status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    """
    Adds the refresh token to blacklist for preventing any other calls.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request) -> Response:
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class List_Users(APIView):
    """
    List of all the users.
    """

    permission_classes = [AllowAny]

    def post(self, request) -> Response:
        try:
            _user_type = request.data["user"]
            if _user_type == 0 or _user_type == 1:
                users = User.objects.filter(role=_user_type).values(
                    "id",
                    "username",
                    "first_name",
                    "last_name",
                    "email",
                    "designation",
                    "department",
                    "mobile",
                    "email",
                    "gender",
                    "date_joined",
                    "address",
                    "role",
                    "profile_pic",
                    "education",
                )

            else:
                users = User.objects.all().values(
                    "id",
                    "username",
                    "first_name",
                    "last_name",
                    "email",
                    "date_joined",
                    "role",
                )
            return Response(users, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Admin_Add_Admin(APIView):
    """
    Creates a new admin. Restricted to admin only
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            User.objects.create(
                username=request.data["email"],
                password=make_password(
                    request.data["first_name"][0] + request.data["last_name"][0]
                ),
                email=request.data["email"],
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                role=1,  # Admin
                is_staff=True,
                is_superuser=True,
            )

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Admin_Add_Employee(APIView):
    """
    Creates a new employee. Restricted to admin only
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            mutable_data = request.data.copy()

            mutable_data["username"] = mutable_data["email"]
            password = make_password(
                mutable_data["first_name"][0].upper()
                + mutable_data["last_name"][0].upper()
            )
            mutable_data["is_active"] = True
            mutable_data["password"] = password

            if not mutable_data.get("profile_pic"):
                mutable_data["profile_pic"] = generate_profile_image(
                    mutable_data["first_name"], mutable_data["last_name"]
                )

            serializer = EmployeeSerializer(data=mutable_data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Admin_Delete_User(APIView):
    """
    Delete user for both admin and employee, single endpoint.
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id")
            user = User.objects.filter(id=id)
            if user:
                user.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Admin_Update_User(APIView):
    """
    Update user for both admin and employee.
    """

    permission_classes = [Admin_Permission]

    def post(self, request) -> Response:
        try:
            id = request.data.get("id", None)
            if id is None:
                return Response(
                    {"error": "Id is required."}, status=status.HTTP_400_BAD_REQUEST
                )
            try:
                user = User.objects.get(id=id)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = EmployeeSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
