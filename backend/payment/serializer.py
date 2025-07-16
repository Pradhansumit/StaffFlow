from rest_framework import serializers


class BaseSalaryViewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    department = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.user.first_name + " " + obj.user.last_name

    def get_profile_pic(self, obj):
        return obj.user.profile_pic.url

    def get_department(self, obj):
        return obj.user.department

    def get_email(self, obj):
        return obj.user.email
