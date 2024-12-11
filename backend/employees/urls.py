from django.urls import path
from . import views

urlpatterns = [
    path('', views.EmployeeListView.as_view(), name='employee-list'),
    path('<int:pk>/', views.EmployeeDetailView.as_view(), name='employee-detail'),
    path('metrics/', views.EmployeeMetricsView.as_view(), name='employee-metrics'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
] 