from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
import json

User = get_user_model()

class ResourceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # For frontend icon display
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Resource Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('DOCUMENT', 'Document'),
        ('VIDEO', 'Video'),
        ('LINK', 'External Link'),
        ('ARTICLE', 'Article'),
    ]

    ACCESS_LEVELS = [
        ('ALL', 'All Employees'),
        ('MANAGER', 'Managers Only'),
        ('HR', 'HR Only'),
        ('ADMIN', 'Administrators Only'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(ResourceCategory, on_delete=models.SET_NULL, null=True, related_name='resources')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='DOCUMENT')
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVELS, default='ALL')
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    external_link = models.URLField(blank=True, null=True)
    content = models.TextField(blank=True)  # For articles or text content
    tags = models.CharField(max_length=200, blank=True)  # Comma-separated tags
    views_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        permissions = [
            ("can_feature_resource", "Can feature resource"),
            ("can_publish_resource", "Can publish resource"),
        ]

    def __str__(self):
        return self.title

    def increment_views(self):
        self.views_count += 1
        self.save()

class ResourceRating(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['resource', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.resource.title} - {self.user.username} - {self.rating}★"

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField(null=True, blank=True)
    workload_level = models.IntegerField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.timestamp}"

class AIAssistance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    query = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"

class GuidelineDocument(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='guidelines/')
    workload_levels = models.CharField(max_length=50, default='[]')  # Store as JSON string
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('processing', 'Processing'),
            ('ready', 'Ready'),
            ('error', 'Error'),
        ],
        default='processing'
    )
    vector_store_path = models.CharField(max_length=255, null=True, blank=True)

    def set_workload_levels(self, levels):
        self.workload_levels = json.dumps(list(map(int, levels)))

    def get_workload_levels(self):
        try:
            return json.loads(self.workload_levels)
        except:
            return []

    def __str__(self):
        return f"{self.name} (Levels: {self.get_workload_levels()})"

class SupportActionHistory(models.Model):
    employee_id = models.CharField(max_length=100)
    current_workload_level = models.IntegerField()
    previous_workload_level = models.IntegerField()
    immediate_action = models.TextField()
    long_term_strategy = models.TextField()
    resources = models.TextField()  # Stored as JSON string
    priority_level = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Support Action Histories"

    def set_resources(self, resources_list):
        self.resources = json.dumps(resources_list)

    def get_resources(self):
        try:
            return json.loads(self.resources)
        except:
            return []

    def __str__(self):
        return f"Support Action for Employee {self.employee_id} - {self.created_at}"
