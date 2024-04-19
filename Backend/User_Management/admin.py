from django.contrib import admin

from .models import Notification, User, Info
# Register your models here.

myModels = [Notification, User, Info]


admin.site.register(myModels)
