from datetime import date

from leave.models import LeaveRequest, LeaveType
from rest_framework import serializers


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = "__all__"


class LeaveRequestViewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    employee = serializers.SerializerMethodField()
    leave_type = serializers.SerializerMethodField(method_name="leave_type_name")
    department = serializers.SerializerMethodField(method_name="get_department")
    duration = serializers.IntegerField()
    unit = serializers.IntegerField()
    status = serializers.IntegerField()
    from_date = serializers.DateTimeField()
    to_date = serializers.DateTimeField()
    request_time = serializers.DateTimeField()
    approved_time = serializers.DateTimeField()

    def get_employee(self, obj):
        return obj.user.first_name + " " + obj.user.last_name

    def leave_type_name(self, obj):
        return LeaveType.objects.get(id=obj.leave_type_id).name

    def get_department(self, obj):
        return obj.user.department
