from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Department,Role,CustomUser,Task,Performance,Leave

from django.urls import reverse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import smtplib
import ssl
from email.message import EmailMessage
from django.conf import settings

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # ✅ This includes id, created_at, updated_at, etc.

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.dept_name', read_only=True)
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    reporting_manager_name = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = [
            'employee_id', 'username','password', 'email', 'first_name', 'last_name',
            'phone', 'address', 'department','department_name', 'role','role_name', 'reporting_manager','reporting_manager_name',
            'date_of_joining', 'created_at', 'updated_at'
        ]
        read_only_fields = ['employee_id', 'created_at', 'updated_at']

    def get_reporting_manager_name(self, obj):
        if obj.reporting_manager:
            return f"{obj.reporting_manager.first_name} {obj.reporting_manager.last_name}"
        return None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        self.send_welcome_email(user)
        return user
    
    def send_welcome_email(self, user):
        sender = settings.EMAIL_HOST_USER
        password = settings.EMAIL_HOST_PASSWORD
        receiver = user.email
        reset_url = f"https://friendly-stroopwafel-cd03eb.netlify.app/Resetpass"

        msg = EmailMessage()
        msg.set_content(
           f"""
                <html>
                    <body>
                        <p>Hello <strong>{user.first_name}</strong>,</p>
                        <p>"🎉 Welcome to HRM Portal!</p>
                        <p>"Your username is: {user.username}"</p>
                        <p>"Please use the reset link to set your password."</p>
                        <p><a href="{reset_url}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
                            Click to Reset Password</a></p>
                        <p>Regards,<br>HRM Team</p>
                    </body>
                </html>
            """, subtype='html'            
        )
        msg["Subject"] = "🎉 Welcome to HRM Portal"
        msg["From"] = sender
        msg["To"] = receiver

        context = ssl._create_unverified_context()

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls(context=context)
                server.login(sender, password)
                server.send_message(msg)
        except Exception as e:
            # Log the error instead of using `messages` or `redirect`
            print(f"❌ Failed to send welcome email: {e}")

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
        
class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    assigned_by_username = serializers.CharField(source='assigned_by.username', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

class PerformanceSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)

    class Meta:
        model = Performance
        fields = '__all__'

class LeaveSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)

    class Meta:
        model = Leave
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (optional)
        token['username'] = user.username
        token['role'] = user.role.role if user.role else None
        return token