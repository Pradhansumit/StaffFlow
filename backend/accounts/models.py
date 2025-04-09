import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class UserRole(models.IntegerChoices):
        EMPLOYEE = 0
        ADMIN = 1

    class Gender(models.IntegerChoices):
        MALE = 0
        FEMALE = 1

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, blank=False, null=False)
    role = models.IntegerField(choices=UserRole.choices, default=0)

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    gender = models.IntegerField(choices=Gender.choices, default=0)
    mobile = models.CharField(max_length=12, null=True, blank=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(
        max_length=100, blank=True, null=True
    )  # need to add department model and foreignkey here
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to="users/profile_pictures/")

    REQUIRED_FIELDS = ["role"]

    def __str__(self) -> str:
        return self.first_name + " " + self.last_name
