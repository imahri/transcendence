from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Padel


class Command(BaseCommand):
    help = "init default Padels"

    def handle(self, *args, **options):
        padels = [
            { "name": "default", "price" : 500, "definition" : "the best",  "image_path": "/static/images/1.png" },
            { "name": "Tower", "price" : 700, "definition" : "the last",  "image_path": "/static/images/2.png" },
            { "name": "Bird", "price" : 1000, "definition" : "SuperNova",  "image_path": "/static/images/14.png" },
	    ]

        try:
            for padel in padels:
                Padel(name=padel["name"], price=padel["price"], definition=padel['definition'], image_path=padel["image_path"]).save()
            self.stdout.write(self.style.SUCCESS("Padels Created successfully"))
        except Exception as error:
            self.stderr.write(
                self.style.ERROR(f"Padels not created because: {error}")
            )