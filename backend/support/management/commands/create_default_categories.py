from django.core.management.base import BaseCommand
from support.models import ResourceCategory

class Command(BaseCommand):
    help = 'Creates default resource categories'

    def handle(self, *args, **kwargs):
        categories = [
            {
                'name': 'Mental Health',
                'description': 'Resources related to mental health and well-being',
                'icon': 'brain',
            },
            {
                'name': 'Work-Life Balance',
                'description': 'Resources for maintaining a healthy work-life balance',
                'icon': 'balance',
            },
            {
                'name': 'Stress Management',
                'description': 'Techniques and resources for managing stress',
                'icon': 'heart',
            },
            {
                'name': 'Professional Development',
                'description': 'Resources for career growth and skill development',
                'icon': 'graduation',
            },
            {
                'name': 'Team Building',
                'description': 'Resources for improving team collaboration and dynamics',
                'icon': 'users',
            },
        ]

        for category_data in categories:
            category, created = ResourceCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'description': category_data['description'],
                    'icon': category_data['icon'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category "{category.name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Category "{category.name}" already exists')) 