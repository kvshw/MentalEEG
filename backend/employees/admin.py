from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'department', 'current_project', 'current_workload_level', 'previous_workload_level')
    list_filter = ('department', 'current_workload_level')
    search_fields = ('name', 'email', 'department')
    ordering = ('-created_at',)
