from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, EmployeeMetrics

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'employee_id', 'department', 'role')
        read_only_fields = ('username',)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class EmployeeMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeMetrics
        fields = ('id', 'mental_workload', 'stress_level', 'focus_score', 'timestamp')
        read_only_fields = ('user',) 