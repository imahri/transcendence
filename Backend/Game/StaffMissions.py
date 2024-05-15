from rest_framework.views import APIView
from rest_framework.response import Response

from .serilaizers import  AcheivmentSerializer
from .models import  Acheivement, Items
from Chat.models import  Message, Conversation
from django.core.exceptions import ObjectDoesNotExist
from User_Management.models import User


class MissionView(APIView):

    def getAcheivment(self, name):
        try :
            acheivment : Acheivement  =  Acheivement.objects.get(name=name)
            return AcheivmentSerializer(acheivment).data
        except Exception as error:
            print(error)
    
    def checkMission(self, Acheivement_name):
        user :User  = self.request.user
        acheivment =  user.acheivements.all().filter(name=Acheivement_name)
        if acheivment.exists():
            return "completed"
        return "incompleted"
        
    def getUserTask(self):
        
        user : User = self.request.user
        profileImage = "incompleted" if user.info.profile_img.name == "default/default.png" else "completed" 
        TowFriend = "incompleted" if len(user.friends) < 2 else "completed"
        level = "incompleted" if user.info.level < 2 else "completed"

        tasks = [
            {"task" : "Change profile Image", "state" : profileImage},
		    {"task" : "Add Tow Friend", "state" : TowFriend},
		    {"task" : "Reach level 2", "state" : level},
        ]
        return tasks
       
    def getGameTask(self):
        tasks = [
            {"task" : "Play Four games", "state" : "incompleted"},
		    {"task" : "Win Tow games", "state" : "incompleted"},
		    {"task" : "Play in a tournoumant", "state" : "incompleted"},
        ]
       
        return tasks
        

    def getChatTask(self):

        user : User = self.request.user
        message = "incompleted" if len(Message.objects.filter(sender=user)) < 10 else "completed"
        convertation = "incompleted" if len(Conversation.objects.filter(owners=user)) < 4 else "completed"


        tasks = [
            {"task" : "Talk to 4 Friends", "state" : convertation},
		    {"task" : "Send ten message", "state" : message},
        ]
        return tasks


    def checkUserMission(self):
        user : User = self.request.user
        profileImage = "True" if user.info.profile_img.name == "default/default.png" else "completed" 
        TowFriend = "incompleted" if len(user.friends) < 2 else "completed"
        level = "incompleted" if user.info.level < 2 else "completed"

        mission = "incompleted"

        if profileImage == "completed" and TowFriend == "completed" and level == "completed":
            mission = "completed"

        return mission
    
    def checkChatMission(self):
        
        user : User = self.request.user
        
        message = "incompleted" if len(Message.objects.filter(sender=user)) < 10 else "completed"
        convertation = "incompleted" if len(Conversation.objects.filter(owners=user)) < 4 else "completed"
        mission = "incompleted"

        if message == "completed" and convertation == "completed":
            mission = "completed"

        return mission

    def checkGameMission(self):
        return "incompleted"


    def get(self, request):

        userMission = self.checkMission("the_smart")
        gameMission = self.checkMission("Volcano")
        chatMission = self.checkMission("the_mortal")
      
        userTask = ""
        gameTask = ""
        chatTask = ""
        if userMission == "incompleted" :
            userTask = self.getUserTask()
        if gameMission == "incompleted" :
            gameTask = self.getGameTask()
        if chatMission == "incompleted" :
            chatTask = self.getChatTask()
        
        firstMission = {
	        "owner": { "userName": "Sakawi", "fullName": "Oussama Krich" },
	        "exp": 750,
	        "prize": { "wallet": 350, "Acheivment": self.getAcheivment('the_smart')},
	        "title": "User",
            "status" : userMission,
            "task" : userTask,
        }

        secondMission = {
        	"owner": { "userName": "RedMega", "fullName": "Redouane Iben Hamou" },
        	"exp": 800,
        	"prize": { "wallet": 300, "Acheivment": self.getAcheivment('Volcano') },
        	"title": "Chat",
            "status" : chatMission,
            "task" : chatTask,
        };

        thirdMission = {
        	"owner": { "userName": "Fiddler", "fullName": "Imad-eddine Mahri" },
        	"exp": 1110,
        	"prize": { "wallet": 500, "Acheivment": self.getAcheivment('the_mortal') },
        	"title": "Game",
            "status" : gameMission,
            "task" : gameTask,
        };
        Missions = {"UserMission" : firstMission, "ChatMission" : secondMission, "GameMission" : thirdMission}
        return Response(data=Missions)


    def put(self, request):
        
        userMission = self.checkMission("the_smart")
        gameMission = self.checkMission("Volcano")
        chatMission = self.checkMission("the_mortal")

        if userMission == "incompleted" :
            userMission = self.checkUserMission()
        if chatMission == "incompleted" :
            chatMission = self.checkChatMission()
        if gameMission == "incompleted" :
            gameMission = self.checkGameMission()

        if userMission == "completed" :
            acheivment : Acheivement  =  Acheivement.objects.get(name="the_smart")
            acheivment.users.add(self.request.user)
        if chatMission == "completed" :
            acheivment : Acheivement  =  Acheivement.objects.get(name="the_mortal")
            acheivment.users.add(self.request.user)
        if gameMission == "completed" :
            acheivment : Acheivement  =  Acheivement.objects.get(name="Volcano")
            acheivment.users.add(self.request.user)
        


        return Response({"userMission" : userMission, "chatMission" : chatMission, "gameMission" : gameMission})                
        


