from django.contrib import admin

from .models import Notification, User, Info, Friend
# Register your models here.

myModels = [Notification, User, Info, Friend]


admin.site.register(myModels)
