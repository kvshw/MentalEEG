from django.db import models

class Employee(models.Model):
    employee_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    current_project = models.CharField(max_length=100, blank=True, null=True)
    workload_level = models.IntegerField(default=0)
    previous_workload_level = models.IntegerField(default=0)
    email = models.EmailField(unique=True)
    image = models.URLField(blank=True, null=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

class WorkloadData(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    workload_level = models.IntegerField()
