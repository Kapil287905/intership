from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Department,Role,CustomUser,Task,Performance,Leave

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # ✅ This includes id, created_at, updated_at, etc.

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'address',
                  'department', 'department_name', 'role', 'role_name']
        
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