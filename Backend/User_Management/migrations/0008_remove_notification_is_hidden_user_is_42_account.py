# Generated by Django 4.2.9 on 2024-05-27 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("User_Management", "0007_alter_user_email"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="notification",
            name="is_hidden",
        ),
        migrations.AddField(
            model_name="user",
            name="is_42_account",
            field=models.BooleanField(default=False),
        ),
    ]
