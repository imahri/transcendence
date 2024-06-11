from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Board


class Command(BaseCommand):
    help = "init default boards"

    def handle(self, *args, **options):
        boards = [
            { "name": "default", "price" : 700,  "image_path": "/images/Board1.png" },
            { "name": "fire", "price" : 800,  "image_path": "/images/Board2.png" },
            { "name": "Dark_luffy", "price" : 900,  "image_path": "/images/Frame4.png" },
            { "name": "groot", "price" : 1000,  "image_path": "/images/Frame5.png" },
            { "name": "Mountain", "price" : 300,  "image_path": "/images/Frame6.png" },
            { "name": "Goku", "price" : 900,  "image_path": "/images/Frame7.png" },
	    ]

        try:
            for board in boards:
                Board(name=board["name"], price=board["price"], image_path=board["image_path"]).save()
            self.stdout.write(self.style.SUCCESS("Boards Created successfully"))
        except Exception as error:
            self.stderr.write(
                self.style.ERROR(f"Boards not created because: {error}")
            )