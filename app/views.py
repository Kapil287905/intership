# department/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics,permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import Role
from .models import Department
from .models import CustomUser
from .serializers import DepartmentSerializer
from django.http import JsonResponse
from .serializers import RoleSerializer
from .models import Task,TaskAssignment
from .serializers import TaskSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, SAFE_METHODS, BasePermission
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
import smtplib
import ssl
from django.core.mail import EmailMessage
from email.message import EmailMessage
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils.timezone import now


# ✅ Custom permission class
class IsAdminOrReadOnly(BasePermission):
    """
    - Allow GET, HEAD, OPTIONS to anyone authenticated.
    - Only allow admin users to POST, PUT, DELETE.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff  # Only admin (is_staff=True)

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        # ✅ Admin sees all users
        if user.is_staff or (user.role and user.role.role_name == 'admin'):
            return CustomUser.objects.all().order_by('-created_at')

        # ✅ Normal user sees only themselves
        return CustomUser.objects.filter(pk=user.pk)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields to token payload (optional)
        token['username'] = user.username
        token['role'] = user.role.role_name if user.role else 'employee'

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra fields to login response
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role.role_name if self.user.role else 'employee'

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def home(request):
    return JsonResponse({'message': 'Welcome to Department Management API!'})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def department_list_create(request):
    user = request.user

    if request.method == 'GET':        
        if user.role and user.role.role_name == 'Admin':
            departments = Department.objects.all().order_by('-created_at')
        else:
            # ✅ FIXED: Use dept_id instead of id
            departments = Department.objects.filter(dept_id=user.department.dept_id) if user.department else Department.objects.none()

        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if user.role and user.role.role_name != 'Admin':
            return Response({"error": "Only admin can create departments."}, status=status.HTTP_403_FORBIDDEN)

        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def department_detail(request, pk):
    try:
        department = Department.objects.get(pk=pk)
    except Department.DoesNotExist:
        return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        department.delete()
        return Response({'message': 'Department deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class RoleListCreateView(generics.ListCreateAPIView):

    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # ✅ Admin sees all roles
        if user.role and user.role.role_name == 'Admin':
            return Role.objects.all()
        # ✅ Normal users only see their own role
        elif user.role:
            return Role.objects.filter(role_id=user.role.role_id)
        else:
            return Role.objects.none()

    def post(self, request, *args, **kwargs):
        user = request.user
        # ✅ Only admin can create new roles
        if user.role and user.role.role_name == 'Admin':
            return super().post(request, *args, **kwargs)
        return Response({"error": "Only admin can create roles."}, status=status.HTTP_403_FORBIDDEN)

# Retrieve, update, or delete a role
class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]

from django.utils import timezone

User = get_user_model()

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny

class OTPRequestView(APIView):
    permission_classes = [AllowAny]  # ✅ Required for public access
    def post(self, request):
        request.session.modified = True
        uemail = request.data.get("email")
        if not uemail:
            return Response({"error": "Email is required."}, status=400)

        try:
            user = User.objects.get(email=uemail)
        except User.DoesNotExist:
            return Response({"error": "❌ No user found with that email."}, status=404)

        # Generate OTP and save in session
        userotp = random.randint(100000, 999999)

        cache_key = f"otp:{user.username}"
        cache.set(f"otp:{userotp}", user.username, timeout=300)

        print(f"[DEBUG] OTP for {user.username}: {userotp}")

        # Email Setup
        sender = settings.EMAIL_HOST_USER
        password = settings.EMAIL_HOST_PASSWORD
        receiver = user.email

        msg = EmailMessage()
        msg.set_content(
           f"""
                <html>
                    <body>
                        <p>Hello <strong>{user.username}</strong>,</p>
                        <p>Your OTP for password reset is: <strong>{userotp}</strong></p>                        
                        <p>Regards,<br>HRM Team</p>
                    </body>
                </html>
            """, subtype='html'            
        )
        msg["Subject"] = "🔐 HRM Password Reset OTP"
        msg["From"] = sender
        msg["To"] = receiver

        # ⚠️ SSL context with certificate verification disabled (development only!)
        context = ssl._create_unverified_context()

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls(context=context)
                server.login(sender, password)
                server.send_message(msg)
            return Response({"message": "✅ OTP sent successfully."}, status=200)
        except Exception as e:
            return Response({"error": f"❌ Failed to send email: {str(e)}"}, status=500)
        
    def is_valid(self):
        return timezone.now() - self.created_at < timezone.timedelta(minutes=10)
        
from django.contrib.auth import get_user_model
User = get_user_model()

class OTPVerifyView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        otp = request.data.get("otp")

        if not otp:
            return Response({"error": "OTP is required."}, status=400)

        cache_key = f"otp:{otp}"
        username = cache.get(cache_key)

        if username is None:
            return Response({"error": "OTP expired or invalid."}, status=404)

        # Optionally delete OTP after success
        cache.delete(cache_key)

        return Response({
            "message": "✅ OTP verified successfully.",
            "username": username
        }, status=200)      

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

class ResetPasswordView(APIView):

    authentication_classes = []  # ✅ No login required
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not all([username, password, confirm_password]):
            return Response({"error": "All fields are required."}, status=400)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        user.set_password(password)
        user.save()

        return Response({"message": "✅ Password reset successful."}, status=200)
    

from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()

        # If employee_id is passed in query params, filter by it
        employee_id = self.request.query_params.get('employee')
        if employee_id:
            return queryset.filter(assignment__employee__id=employee_id).distinct()
        
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(assignment__status=status)

        # Admin sees all tasks
        if hasattr(user, 'role') and user.role.role_name == 'Admin':
            return queryset

        # Others (like employee) see tasks assigned to them
        assigned_task_ids = TaskAssignment.objects.filter(employee=user).values_list('task_id', flat=True)
        return queryset.filter(pk__in=assigned_task_ids).distinct()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("❌ Serializer Errors:", serializer.errors)  # log in console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_task_complete(request, assignment_id):
    try:
        assignment = TaskAssignment.objects.get(pk=assignment_id)
        assignment.status = 'Completed'
        assignment.completed_at = now()
        assignment.save()
        return Response({"message": "Task marked as completed successfully"})
    except TaskAssignment.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=404)