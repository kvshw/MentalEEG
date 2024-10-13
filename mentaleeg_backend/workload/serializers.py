from rest_framework import serializers
from .models import Employee, WorkloadData

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class WorkloadDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkloadData
        fields = '__all__'
