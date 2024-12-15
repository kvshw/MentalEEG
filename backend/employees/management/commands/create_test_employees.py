from django.core.management.base import BaseCommand
from employees.models import Employee

class Command(BaseCommand):
    help = 'Creates test employees'

    def handle(self, *args, **kwargs):
        test_employees = [
            {
                'name': 'Johanna Saartoala',
                'email': 'johanna.s@company.com',
                'department': 'EISU',
                'current_project': 'SurveyMax',
                'current_workload_level': 4,
                'previous_workload_level': 1,
            },
            {
                'name': 'Ilona Lehtola',
                'email': 'ilona.l@company.com',
                'department': 'HR',
                'current_project': 'HR Analytics',
                'current_workload_level': 1,
                'previous_workload_level': 4,
            },
            {
                'name': 'Mikko Virtanen',
                'email': 'mikko.v@company.com',
                'department': 'EISU',
                'current_project': 'DataViz',
                'current_workload_level': 3,
                'previous_workload_level': 3,
            },
            {
                'name': 'Laura Korhonen',
                'email': 'laura.k@company.com',
                'department': 'HR',
                'current_project': 'Recruitment',
                'current_workload_level': 2,
                'previous_workload_level': 4,
            },
            {
                'name': 'Antti Mäkinen',
                'email': 'antti.m@company.com',
                'department': 'EISU',
                'current_project': 'SurveyMax',
                'current_workload_level': 5,
                'previous_workload_level': 2,
            },
        ]

        for employee_data in test_employees:
            Employee.objects.get_or_create(
                email=employee_data['email'],
                defaults=employee_data
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created employee {employee_data["name"]}')
            ) 