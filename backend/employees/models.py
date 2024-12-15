from django.db import models
from django.utils import timezone

class Employee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=255)
    current_project = models.CharField(max_length=255, null=True, blank=True)
    current_workload_level = models.IntegerField(default=3)
    previous_workload_level = models.IntegerField(default=3)
    last_workload_update = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.department}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.current_workload_level = 3
            self.previous_workload_level = 3
            self.last_workload_update = timezone.now()
        super().save(*args, **kwargs)
