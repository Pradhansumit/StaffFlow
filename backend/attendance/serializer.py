from rest_framework.serializers import ModelSerializer

from attendance.models import Attendance


class AttendanceSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"
