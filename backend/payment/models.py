from decimal import Decimal

from django.db import models
from django.utils import timezone


class BasicSalary(models.Model):
    user = models.OneToOneField(
        "accounts.CustomUser",
        on_delete=models.CASCADE,
        related_name="basic_salary_record",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f"{self.user.first_name} - {self.amount}"


class MonthlySalary(models.Model):
    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)
    deduction = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, default=Decimal("0.00")
    )
    bonus = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, default=Decimal("0.00")
    )
    for_month = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    created_date = models.DateField(auto_now_add=True)
    payslip = models.FileField(
        upload_to=f"salary_slip/{timezone.now().date()}", blank=True, null=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return self.user.first_name
