# Generated by Django 5.0.2 on 2024-02-13 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User_Management', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='info',
            name='banner_img',
            field=models.ImageField(blank=True, upload_to='static/images'),
        ),
        migrations.AlterField(
            model_name='info',
            name='profile_img',
            field=models.ImageField(blank=True, upload_to='static/images'),
        ),
    ]
