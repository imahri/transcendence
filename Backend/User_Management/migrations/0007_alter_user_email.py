# Generated by Django 4.2.9 on 2024-05-25 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("User_Management", "0006_alter_user_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(
                blank=True, max_length=254, verbose_name="email address"
            ),
        ),
    ]
