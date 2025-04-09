from accounts.models import CustomUser
from django.contrib import admin


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "first_name", "last_name"]

    class Meta:
        list_display = "__all__"
