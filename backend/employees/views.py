from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
import logging

logger = logging.getLogger(__name__)

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employees to be viewed or edited.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        try:
            logger.debug(f"User {request.user} requesting employees list")
            logger.debug(f"Request headers: {request.headers}")
            
            queryset = self.get_queryset()
            logger.debug(f"Found {queryset.count()} employees")
            
            serializer = self.get_serializer(queryset, many=True)
            logger.debug(f"Serialized data: {serializer.data}")
            
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in employee list view: {str(e)}")
            logger.error(f"Request user: {request.user}")
            logger.error(f"Request auth: {request.auth}")
            raise

    def get_queryset(self):
        """
        Optionally restricts the returned employees by filtering against
        query parameters in the URL.
        """
        queryset = Employee.objects.all()
        logger.debug(f"Base queryset count: {queryset.count()}")
        
        department = self.request.query_params.get('department', None)
        if department is not None:
            queryset = queryset.filter(department=department)
            logger.debug(f"Filtered queryset by department '{department}', count: {queryset.count()}")
        
        return queryset
