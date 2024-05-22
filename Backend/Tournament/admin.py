from django.contrib import admin

# Register your models here.

from .models import Tournament, Participant

admin.site.register([Tournament, Participant])
