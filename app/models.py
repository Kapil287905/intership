from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone

# Create your models here.

class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    dept_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.dept_name
    
class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.role_name
    
class CustomUser(AbstractUser):
    employee_id = models.AutoField(primary_key=True)  # Replace default ID
    first_name = models.CharField(max_length=100)  # Already included via AbstractUser
    last_name = models.CharField(max_length=100)   # Already included via AbstractUser
    username = models.CharField(max_length=100, unique=True)  # Already inherited
    email = models.EmailField(max_length=100, unique=True)  # Already inherited
    phone = models.CharField(max_length=100, blank=True)  # equivalent to 'mobile'
    address = models.TextField(blank=True)
    
    department = models.ForeignKey(
        'Department', on_delete=models.SET_NULL, null=True, blank=True, db_column='dept_id'
    )
    role = models.ForeignKey(
        'Role', on_delete=models.SET_NULL, null=True, blank=True, db_column='role_id'
    )

    reporting_manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subordinates',
        db_column='reporting_manager_id'
    )

    date_of_joining = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    USERNAME_FIELD = 'username'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"
    
    @property
    def id(self):
        return self.employee_id

class Performance(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='performances',
        help_text="Employee who is being reviewed."
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews_given',
        help_text="Employee who conducted the review."
    )
    feedback = models.TextField(help_text="Feedback comments by reviewer.")
    goal = models.TextField(blank=True, help_text="Optional goals set or evaluated.")
    score = models.IntegerField(help_text="Numeric score from 1–10.")
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review of {self.user.username} by {self.reviewer.username if self.reviewer else 'N/A'} - Score: {self.score}"
    

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    TASK_TYPE_CHOICES = [
        ('Individual', 'Individual'),
        ('Team', 'Team'),
    ]

    task_title = models.CharField(max_length=100,default='')
    task_description = models.CharField(max_length=300, default='')
    task_priority = models.CharField(max_length=200, choices=PRIORITY_CHOICES,default='')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    task_type = models.CharField(max_length=50, choices=TASK_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.task_title

from django.contrib.auth import get_user_model
User = get_user_model()

class TaskAssignment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    assignment_id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_assignments')
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks')
    assigned_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=200, choices=STATUS_CHOICES, default='Pending')
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.task.task_title} → {self.employee.username}"
    
class Leave(models.Model):
    LEAVE_TYPES = [
        ('Sick', 'Sick Leave'),
        ('Casual', 'Casual Leave'),
        ('Earned', 'Earned Leave'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leaves',
        help_text="Employee requesting the leave"
    )

    leave_type = models.CharField(
        max_length=20,
        choices=LEAVE_TYPES,
        help_text="Type of leave requested"
    )

    start_date = models.DateField()
    end_date = models.DateField()

    reason = models.TextField(help_text="Reason for the leave")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending',
        help_text="Approval status of the leave"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approvals_given',
        help_text="Manager or supervisor who approved/rejected the leave"
    )

    def __str__(self):
        return f"{self.user.username} | {self.leave_type} | {self.status}"

    @property
    def total_days(self):
        return (self.end_date - self.start_date).days + 1

    class Meta:
        ordering = ['-applied_at']