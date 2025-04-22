from django.db import models


class LeaveType(models.Model):
    class PaidType(models.IntegerChoices):
        unpaid = 0
        paid = 1

    class StatusType(models.IntegerChoices):
        active = 0
        deactive = 1

    name = models.CharField(
        max_length=100,
        unique=True,
        null=False,
        blank=False,
    )
    type = models.IntegerField(
        choices=PaidType.choices,
        default=PaidType.unpaid,
        null=False,
        blank=False,
    )
    max_leaves = models.IntegerField(null=False, blank=False)
    status = models.IntegerField(
        choices=StatusType.choices,
        default=StatusType.active,
        null=False,
        blank=False,
    )

    def __str__(self) -> str:
        return self.name


class LeaveRequest(models.Model):

    class LeaveUnit(models.IntegerChoices):
        hour = 0
        day = 1

    class LeaveStatus(models.IntegerChoices):
        approved = 0
        pending = 1
        rejected = 2

    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)
    leave_type = models.ForeignKey("leave.LeaveType", on_delete=models.PROTECT)
    duration = models.IntegerField(null=False, blank=False)
    unit = models.IntegerField(
        choices=LeaveUnit.choices,
        default=LeaveUnit.day,
        null=False,
        blank=False,
    )
    status = models.IntegerField(
        choices=LeaveStatus.choices,
        default=LeaveStatus.pending,
    )
    from_date = models.DateTimeField(auto_now_add=False, null=False, blank=False)
    to_date = models.DateTimeField(auto_now_add=False, blank=False, null=False)
    request_time = models.DateTimeField(auto_now_add=True)
    approved_time = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return self.user.first_name + " " + str(self.status) + " " + str(self.duration)
