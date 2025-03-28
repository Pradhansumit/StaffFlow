from django.urls import path

from attendance.views import Employee_ChecksIn_Attendance, Employee_ChecksOut_Attendance

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
]
