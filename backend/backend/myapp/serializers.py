# backend/backend/myapp/serializers.py
# in simple words this file is used to convert complex data types such as querysets and model instances into native Python datatypes that can then be easily rendered into JSON, XML or other content types. It also provides deserialization, allowing parsed data to be converted back into complex types, after first validating the incoming data.


from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    staff_code = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )


    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'confirm_password',
            'phone_no',
            'department',
            'role',
            'staff_code',
        ]

    def validate(self, data):
        # password check
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")

        # staff validation
        if data['role'] == 'staff':
            if data.get('staff_code') != "STAFF@2026":
                raise serializers.ValidationError(
                    "Invalid staff verification code"
                )

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data.pop('staff_code', None)
        return User.objects.create_user(**validated_data)
    
    
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")

        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        data["user"] = user
        return data
