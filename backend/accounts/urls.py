from django.urls import path

from accounts.views import (
    Admin_Add_Admin,
    Admin_Add_Employee,
    Admin_Delete_User,
    List_Users,
    Login,
    Logout,
)

urlpatterns = [
    path("login/", Login.as_view(), name="Login"),
    path("logout/", Logout.as_view(), name="Logout"),
    path("user/all", List_Users.as_view(), name="list_users"),
    path("admin/add", Admin_Add_Admin.as_view(), name="add_admin"),
    path("employee/add", Admin_Add_Employee.as_view(), name="add_employee"),
    path("user/delete", Admin_Delete_User.as_view(), name="delete_user"),
]
