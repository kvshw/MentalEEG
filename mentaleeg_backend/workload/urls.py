from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, WorkloadDataViewSet

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'workload', WorkloadDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
