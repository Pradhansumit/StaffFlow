from django.db import models


class Attendance(models.Model):
    check_in = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    check_out = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.first_name
