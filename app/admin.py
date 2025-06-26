from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Department, Role, CustomUser, Task, Performance, Leave

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
    search_fields = ('dept_name',)


# Custom User (Extend Django Admin)
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'role', 'department', 'is_staff')
    search_fields = ('username', 'email')
    list_filter = ('role', 'department')


# Task
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'assigned_to', 'assigned_by', 'status', 'deadline')
    search_fields = ('title', 'assigned_to__username')
    list_filter = ('status', 'deadline')


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