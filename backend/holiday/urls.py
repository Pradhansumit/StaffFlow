from django.urls import path
from holiday.views import (
    Admin_Add_Holiday,
    Admin_Delete_Holiday,
    Admin_List_Holiday,
    Admin_Update_Holiday,
)

urlpatterns = [
    path(
        "add/",
        Admin_Add_Holiday.as_view(),
        name="Admin_Add_Holiday",
    ),
    path(
        "delete/",
        Admin_Delete_Holiday.as_view(),
        name="Admin_Delete_Holiday",
    ),
    path(
        "view/",
        Admin_List_Holiday.as_view(),
        name="Admin_List_Holiday",
    ),
    path(
        "update/",
        Admin_Update_Holiday.as_view(),
        name="Admin_Update_Holiday",
    ),
]
