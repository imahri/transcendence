from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Badge


class Command(BaseCommand):
    help = "init default Badges"

    def handle(self, *args, **options):
        badges = [
            { "color": "#B23D18", "price" : 800, "image_path": "/images/badge3.png" },
            { "color": "#A4212C", "price" : 400,  "image_path": "/images/badge2.png" },
	    ]

        try:
            for badge in badges:
                Badge(color=badge["color"], price=badge["price"], image_path=badge["image_path"]).save()
            self.stdout.write(self.style.SUCCESS("badges Created successfully"))
        except Exception as error:
            self.stderr.write(self.style.ERROR(f"badges not created because: {error}"))