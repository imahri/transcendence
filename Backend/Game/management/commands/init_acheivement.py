from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Acheivement


class Command(BaseCommand):
    help = "init default users"

    def handle(self, *args, **options):
        achs = [
            {
                "name": "the_smart",
                "icon_path": "/static/images/TheSmart.png",
            },
            {
                "name": "the_mortal",
                "icon_path": "/static/images/theMortal.png",
            },
            {
                "name": "Volcano",
                "icon_path": "/static/images/Volcano.png",
            },
            {
                "name": "The Death",
                "icon_path": "/static/images/death.png",
            },
            {
                "name": "Fiddler",
                "icon_path": "/static/images/fiddler.png",
            },
            {
                "name": "The Ghost",
                "icon_path": "/static/images/Ghost.png",
            },
            {
                "name": "The Killer",
                "icon_path": "/static/images/Killer.png",
            },
            {
                "name": "SUDO",
                "icon_path": "/static/images/sudo.png",
            },
        ]

        try:
            for ach in achs:
                Acheivement(name=ach["name"], icon_path=ach["icon_path"]).save()
            self.stdout.write(self.style.SUCCESS("Acheivments Created successfully"))
        except Exception as error:
            self.stderr.write(
                self.style.ERROR(f"Acheivments not created because: {error}")
            )
