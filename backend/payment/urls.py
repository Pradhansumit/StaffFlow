from django.urls import path
from payment.views import (
    Admin_Add_Employee_Basic_Salary,
    Admin_Calculate_Employee_Monthly_Salary,
    Admin_View_AllEmployee_Monthly_Salary,
)

urlpatterns = [
    path(
        "admin/add-basic-salary/",
        Admin_Add_Employee_Basic_Salary.as_view(),
        name="Admin_Add_Employee_Basic_Salary",
    ),
    path(
        "admin/calculate-salary/",
        Admin_Calculate_Employee_Monthly_Salary.as_view(),
        name="Admin_Add_LeaveType",
    ),
    path(
        "admin/view-salary/",
        Admin_View_AllEmployee_Monthly_Salary.as_view(),
        name="Admin_View_AllEmployee_Monthly_Salary",
    ),
]
