from accounts.models import CustomUser
from django.contrib import admin


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    class Meta:
        list_display = "__all__"
