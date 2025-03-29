from django.urls import path
from leave.views import (
    Admin_Add_LeaveType,
    Admin_Delete_LeaveType,
    Admin_List_LeaveType,
    Admin_Update_LeaveType,
)

urlpatterns = [
    path(
        "add/",
        Admin_Add_LeaveType.as_view(),
        name="Admin_Add_LeaveType",
    ),
    path(
        "delete/",
        Admin_Delete_LeaveType.as_view(),
        name="Admin_Delete_LeaveType",
    ),
    path(
        "list/",
        Admin_List_LeaveType.as_view(),
        name="Admin_List_LeaveType",
    ),
    path(
        "update/",
        Admin_Update_LeaveType.as_view(),
        name="Admin_Update_LeaveType",
    ),
]
