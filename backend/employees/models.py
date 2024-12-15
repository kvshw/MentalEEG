from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Employee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    current_project = models.CharField(max_length=255, blank=True, null=True)
    current_workload_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    previous_workload_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.department}"
