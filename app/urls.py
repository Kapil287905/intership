# department/urls.py

from django.urls import path,include
from . import views
from .views import MyTokenObtainPairView,CustomUserViewSet,OTPRequestView,OTPVerifyView,ResetPasswordView,get_csrf_token,TaskListCreateView,TaskDetailView,mark_task_complete
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='customuser')

urlpatterns = [
    path('', views.home, name='home'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/departments/', views.department_list_create, name='department-list-create'),
    path('api/departments/<int:pk>/', views.department_detail, name='department-detail'),
    path('api/role/', views.RoleListCreateView.as_view(), name='role-list-create'),
    path('api/role/<int:pk>/', views.RoleDetailView.as_view(), name='role-detail'),
    path('api/otp-request/', OTPRequestView.as_view(), name='otp-request'),
    path('api/otp-verify/', OTPVerifyView.as_view(), name='otp-verify'),
    path('api/get-csrf-token/', get_csrf_token),
    path('api/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('api/tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('api/tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('api/task-assignments/<int:assignment_id>/complete/', mark_task_complete),

    # ✅ Add DRF router URLs
    path('api/', include(router.urls)),
]
