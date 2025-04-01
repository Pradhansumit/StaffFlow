from attendance.views import (
    Admin_View_TodaysAttendance,
    Employee_ChecksIn_Attendance,
    Employee_ChecksOut_Attendance,
)
from django.urls import path

urlpatterns = [
    path(
        "checkin/",
        Employee_ChecksIn_Attendance.as_view(),
        name="Employee_ChecksIn_Attendance",
    ),
    path(
        "checkout/",
        Employee_ChecksOut_Attendance.as_view(),
        name="Employee_ChecksOut_Attendance",
    ),
    path(
        "admin/view-today-report/",
        Admin_View_TodaysAttendance.as_view(),
        name="Admin_View_TodaysAttendance",
    ),
]
