from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Employee
from .serializers import EmployeeSerializer
from datetime import datetime
import logging
from django.utils import timezone

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

    @action(detail=True, methods=['post'], url_path='workload')
    def update_workload(self, request, pk=None):
        try:
            employee = self.get_object()
            logger.debug(f"Updating workload for employee {pk}")
            logger.debug(f"Request data: {request.data}")
            
            workload_level = request.data.get('workloadLevel')
            timestamp = request.data.get('timestamp')

            logger.debug(f"Received workload_level: {workload_level}, timestamp: {timestamp}")

            if workload_level is None:
                return Response(
                    {'error': 'workloadLevel is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                workload_level = int(workload_level)
            except (TypeError, ValueError):
                return Response(
                    {'error': 'workloadLevel must be a number'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not (1 <= workload_level <= 5):
                return Response(
                    {'error': 'workloadLevel must be between 1 and 5'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Store previous workload level
                previous_workload = employee.current_workload_level
                
                # Update workload levels
                employee.previous_workload_level = previous_workload
                employee.current_workload_level = workload_level
                
                # Handle timestamp
                if timestamp:
                    try:
                        employee.last_workload_update = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    except ValueError:
                        logger.warning(f"Invalid timestamp format: {timestamp}, using current time")
                        employee.last_workload_update = timezone.now()
                else:
                    employee.last_workload_update = timezone.now()
                
                employee.save()

                logger.debug(f"Successfully updated workload for employee {pk}")

                return Response({
                    'id': employee.id,
                    'current_workload_level': employee.current_workload_level,
                    'previous_workload_level': employee.previous_workload_level,
                    'last_workload_update': employee.last_workload_update.isoformat()
                })
            except Exception as e:
                logger.error(f"Error saving employee data: {str(e)}")
                return Response(
                    {'error': f"Failed to save employee data: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            logger.error(f"Error updating workload for employee {pk}: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
