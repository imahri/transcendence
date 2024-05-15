from rest_framework.views import APIView
from rest_framework.response import Response
from .serilaizers import BadgeSerializer, MatchSerializer, PadelSerializer, BoardSerializer, ItemsSerializer, AcheivmentSerializer
from .models import Badge, Board, Match, Padel, Items, Acheivement
from django.core.exceptions import ObjectDoesNotExist
from User_Management.models import User

class MatchView(APIView):

    def post(self, request):
        try:
            user = request.user
            serializer = MatchSerializer(data=request.data, context={'user': user})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except ObjectDoesNotExist as error:
            return Response({'error': "Username doesn't exist"}, status=400)
        except Exception as error:
            return Response({'error': str(error)}, status=400)

    
    def get(self, request):
        try:
            user = request.user
            matches = Match.objects.filter(user=user).order_by('-played_at')

            serializer = MatchSerializer(matches, many=True)

            return Response(serializer.data)
        except Exception as error:
            return Response({'error': str(error)}, status=400)
        

class BadgeView(APIView):

    def get(self, request):
        
        try:
            objects = Badge.objects.all()
            serializer = BadgeSerializer(instance=objects, many=True)
            owned = []
            try:
                obj : Items = Items.objects.get(user=request.user, item_class='badges')
                data = ItemsSerializer(obj).data
                ownedObjs = data['owned_items']
                for ownedObj in ownedObjs:
                    owned.append(ownedObj['id'])
            except Items.DoesNotExist:
                pass

            return Response({'badges':  serializer.data, 'owned' : owned})
        except Exception as error:
            return Response({'error': str(error)}, status=400)
           
class BoardView(APIView):
    
    def get(self, request):
        
        try:
            objects = Board.objects.all()
            serializer = BoardSerializer(instance=objects, many=True)
            owned = []
            try:
                obj : Items = Items.objects.get(user=request.user, item_class='boards')
                data = ItemsSerializer(obj).data
                ownedObjs = data['owned_items']
                for ownedObj in ownedObjs:
                    owned.append(ownedObj['id'])
            except Items.DoesNotExist:
                pass

            return Response({'boards':  serializer.data, 'owned' : owned})

        except Exception as error:
            return Response({'error': str(error)}, status=400)


class PadleView(APIView):

    def get(self, request):
        
        try:
            objects = Padel.objects.all()
            serializer = PadelSerializer(instance=objects, many=True)
            #get owned paddles ids
            owned = []
            try:
                obj : Items = Items.objects.get(user=request.user, item_class='padels')
                data = ItemsSerializer(obj).data
                ownedObjs = data['owned_items']
                for ownedObj in ownedObjs:
                    owned.append(ownedObj['id'])
            except Items.DoesNotExist:
                pass

            return Response({'paddles':  serializer.data, 'owned' : owned})
        
        except Exception as error:
            return Response({'error': str(error)}, status=400)


class ItemsView(APIView):

    def get(self, request):
        # get user items you should pass username in query
        try:
            username = request.query_params.get('username')
            user : User =  User.objects.get(username=username)
            objs = Items.objects.filter(user=user)
            response = {'padels' : '' , 'badges' : '', 'boards' : '' }
            for obj in objs:
                ItemsSerialized = ItemsSerializer(instance=obj).data
                type = ItemsSerialized['item_class']
                response[type] = ItemsSerialized
                
            return Response(response)

        except Exception as error:
            print("catch : ", error)
            return Response(data=str(error), status=400)


    def put(self, request):
        # this view can equip item or add owned item and return the updated items
        try:
            
            action = request.data.get('action')
            new_item = request.data.get('item_id')
            response = ''

            if action == 'equip':
                items_id = request.data.get('items_id')
                obj : Items = Items.objects.get(id=items_id, user=request.user)
                response = obj.equip_item(new_item)

            if action == 'buy':
                item_type = request.data.get('item_type')
                
                response = Items.buy_item(item_type, new_item, request.user)
                

            return Response(data=response)

        except Exception as error:
            print('catch : ', error)
            return Response(data=str(error), status=400)
        
        
class AcheivmentView(APIView):

    def get(self, request):

        user : User = request.user

        all_acheivements = Acheivement.objects.all()
        unlocked_acheivements = user.acheivements.all()
        
        acheivements_data = AcheivmentSerializer(instance=all_acheivements, many=True).data
        
        for achievement in acheivements_data:
            if unlocked_acheivements.filter(id=achievement.get('id')).exists():
                achievement['unlocked'] = True
            else:
                achievement['unlocked'] = False

        return Response(data=acheivements_data)