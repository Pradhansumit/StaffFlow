import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class UserRole(models.IntegerChoices):
        EMPLOYEE = 0
        ADMIN = 1

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, blank=False, null=False)
    role = models.IntegerField(choices=UserRole.choices)

    REQUIRED_FIELDS = ["role"]


class Employee(models.Model):
    class Gender(models.IntegerChoices):
        MALE = 0
        FEMALE = 1

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    gender = models.IntegerField(choices=Gender.choices)
    mobile = models.CharField(max_length=12)
    designation = models.CharField(max_length=100)
    department = models.CharField(
        max_length=100
    )  # need to add department model and foreignkey here
    address = models.TextField()
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    education = models.TextField()
    profile_pic = models.ImageField(upload_to="employee/profile_pictures/")

    def __str__(self) -> str:
        return self.first_name + " " + self.last_name
