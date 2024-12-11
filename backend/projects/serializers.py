from rest_framework import serializers
from .models import Project, ProjectAssignment

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectAssignmentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)

    class Meta:
        model = ProjectAssignment
        fields = ('id', 'project', 'project_name', 'employee', 'employee_name', 
                 'role', 'start_date', 'end_date', 'workload_percentage') 