from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .models import Department, EmployeeMetrics
from .serializers import UserSerializer, DepartmentSerializer, EmployeeMetricsSerializer

User = get_user_model()

class EmployeeListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

class EmployeeDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

class EmployeeMetricsView(generics.ListCreateAPIView):
    serializer_class = EmployeeMetricsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return EmployeeMetrics.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = (permissions.IsAuthenticated,)
