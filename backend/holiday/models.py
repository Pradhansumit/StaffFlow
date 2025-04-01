from django.db import models


class Holiday(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=False, blank=False, null=False)
    creation_date = models.DateField(auto_now_add=True, blank=False, null=False)
    description = models.TextField()

    def __str__(self) -> str:
        return self.name + " " + str(self.date)
