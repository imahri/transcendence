from django.contrib import admin

from .models import Acheivement, Match, Grade, Items, Padel, Board, Badge

# Register your models here.

myModels = [Acheivement, Match, Grade, Items, Padel, Badge, Board]

admin.site.register(myModels)
