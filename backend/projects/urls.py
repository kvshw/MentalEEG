from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('assignments/', views.ProjectAssignmentView.as_view(), name='project-assignments'),
    path('metrics/', views.ProjectMetricsView.as_view(), name='project-metrics'),
] 