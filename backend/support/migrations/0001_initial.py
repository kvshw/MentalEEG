# Generated by Django 5.1.4 on 2024-12-11 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AIAssistance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("query", models.TextField()),
                ("response", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at"],},
        ),
        migrations.CreateModel(
            name="ChatMessage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("message", models.TextField()),
                ("is_ai_response", models.BooleanField(default=False)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["timestamp"],},
        ),
        migrations.CreateModel(
            name="Resource",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("file", models.FileField(upload_to="resources/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]