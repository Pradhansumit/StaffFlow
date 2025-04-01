from attendance.models import Attendance
from rest_framework import serializers


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"


class AttendanceReportSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.IntegerField()
    attendance_status = serializers.SerializerMethodField()
    check_in = serializers.SerializerMethodField()
    check_out = serializers.SerializerMethodField()

    def get_attendance_status(self, obj):
        return "Present" if obj.has_attendance else "Absent"

    def get_check_in(self, obj):
        return obj.check_in if obj.has_attendance else None

    def get_check_out(self, obj):
        return obj.check_out if obj.has_attendance else None
