from holiday.models import Holiday
from rest_framework import serializers


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = "__all__"
