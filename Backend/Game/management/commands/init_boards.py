from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Board


class Command(BaseCommand):
    help = "init default boards"

    def handle(self, *args, **options):
        boards = [
            { "name": "defaut", "price" : 700,  "image_path": "/static/images/Board1.png" },
            { "name": "fire", "price" : 800,  "image_path": "/static/images/Board2.png" },
	    ]

        try:
            for board in boards:
                Board(name=board["name"], price=board["price"], image_path=board["image_path"]).save()
            self.stdout.write(self.style.SUCCESS("Boards Created successfully"))
        except Exception as error:
            self.stderr.write(
                self.style.ERROR(f"Boards not created because: {error}")
            )