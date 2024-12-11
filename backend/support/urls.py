from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.ChatView.as_view(), name='chat'),
    path('resources/', views.ResourceListView.as_view(), name='resource-list'),
    path('documents/', views.DocumentUploadView.as_view(), name='document-upload'),
    path('ai-assist/', views.AIAssistView.as_view(), name='ai-assist'),
] 