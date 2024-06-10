from typing import Any
from django.core.management.base import BaseCommand
from Game.models import Grade


class Command(BaseCommand):
    help = "init default grades"

    def handle(self, *args, **options):
        grades = [
        { "name": "Bronze", "image": "/static/images/Bronze.png" },
	    { "name": "Silver", "image": "/static/images/Silver.png" },
	    { "name": "Gold", "image": "/static/images/Gold.png"},
	    { "name": "Platinum", "image": "/static/images/Platinum.png" },
	    { "name": "Master", "image": "/static/images/Master.png" },
	    { "name": "Grand Master", "image": "/static/images/GrandMaster.png" },
        ]

        try:
            for grade in grades:
                Grade(name=grade["name"], image=grade["image"]).save()
            self.stdout.write(self.style.SUCCESS("Grades Created successfully"))
        except Exception as error:
            self.stderr.write(
                self.style.ERROR(f"Grades not created because: {error}")
            )
