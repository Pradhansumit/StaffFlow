from leave.models import LeaveRequest, LeaveType
from rest_framework.serializers import ModelSerializer


class LeaveTypeSerializer(ModelSerializer):
    class Meta:
        model = LeaveType
        fields = "__all__"


class LeaveRequestSerializer(ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = "__all__"
