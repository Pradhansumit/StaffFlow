from rest_framework.permissions import BasePermission


class Admin_Permission(BasePermission):
    message = "It is reserved for admin."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 1
