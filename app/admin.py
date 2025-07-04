from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Department, Role, CustomUser, Task,TaskAssignment, Performance, Leave

# Register your models here.
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('dept_id', 'dept_name', 'status', 'created_at', 'updated_at')
    search_fields = ('dept_name',)
    list_filter = ('status',)

# Role
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role_id', 'role_name', 'created_at', 'updated_at')
    search_fields = ('role_name',)


# Custom User (Extend Django Admin)
@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = (
        'employee_id', 'username', 'email', 'first_name', 'last_name',
        'department', 'role', 'reporting_manager', 'date_of_joining', 'is_staff'
    )
    list_filter = ('role', 'department', 'is_staff', 'is_superuser')
    
    fieldsets = (
        ("Login Credentials", {'fields': ('username', 'password')}),
        ("Personal Info", {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'address', 'date_of_joining')
        }),
        ("Company Details", {
            'fields': ('department', 'role', 'reporting_manager')
        }),
        ("Permissions", {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ("Timestamps", {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'date_joined', 'last_login')
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name', 'phone', 'password1', 'password2',
                'department', 'role', 'reporting_manager', 'date_of_joining',
                'is_active', 'is_staff', 'is_superuser'
            ),
        }),
    )

    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('employee_id',)


# Task
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'task_title', 'end_date']  # ✅ Use existing fields
    list_filter = ['task_priority', 'end_date']  # ✅ Use correct fields only
    search_fields = ['task_title', 'task_description']

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = [
        'assignment_id',
        'task',
        'employee',         # This will show CustomUser username
        'assigned_by',      # This will show assigner's username
        'status',
        'assigned_date',
        'completed_at',
    ]
    list_filter = ['status', 'assigned_date', 'completed_at']
    search_fields = ['task__task_title', 'employee__username', 'assigned_by__username']


# Performance
@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'reviewer', 'score', 'reviewed_at')
    search_fields = ('user__username', 'reviewer__username')
    list_filter = ('score',)


# Leave
@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'leave_type', 'start_date', 'end_date', 'status', 'approved_by')
    search_fields = ('user__username',)
    list_filter = ('status', 'leave_type')