from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'department',
            'current_project',
            'current_workload_level',
            'previous_workload_level',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        # Ensure workload levels are between 1 and 5
        for field in ['current_workload_level', 'previous_workload_level']:
            if field in data and (data[field] < 1 or data[field] > 5):
                raise serializers.ValidationError(
                    f"{field} must be between 1 and 5"
                )
        return data