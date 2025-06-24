# department/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import Role
from .models import Department
from .serializers import DepartmentSerializer
from django.http import JsonResponse
from .serializers import RoleSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username  # Add username to response
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def home(request):
    return JsonResponse({'message': 'Welcome to Department Management API!'})

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def department_list_create(request):
    if request.method == 'GET':
        departments = Department.objects.all().order_by('-created_at')
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
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
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]

# Retrieve, update, or delete a role
class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]