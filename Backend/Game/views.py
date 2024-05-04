from rest_framework.views import APIView
from rest_framework.response import Response

from .serilaizers import BadgeSerializer, MatchSerializer, PadelSerializer, BoardSerializer, ItemsSerializer
from .models import Badge, Board, Match, Padel, Items
from django.core.exceptions import ObjectDoesNotExist
from User_Management.models import User
from core.settings import IMAGES_ROOT_





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

    def post(self, request): 
       if request.user.is_superuser:
            serializer = BadgeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
       else:
         return Response({'error':'you are not admin'}, status=401)

    def get(self, request):
        
        try:
            objects = Badge.objects.all()
            serializer = BadgeSerializer(instance=objects, many=True)

            return Response(serializer.data)
        except Exception as error:
            return Response({'error': str(error)}, status=400)

    def put(self, request, pk):
        if request.user.is_superuser:
            try:
                paddle = Badge.objects.get(pk=pk)
            except Badge.DoesNotExist:
                return Response(
                    {'error': 'Paddle with this ID does not exist'},
                    status=404
                )

            serializer = BadgeSerializer(paddle, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'you are not admin'}, status=401)

           
class BoardView(APIView):

    def post(self, request): 
       if request.user.is_superuser:
            serializer = BoardSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
       else:
         return Response({'error':'you are not admin'}, status=401)
    
    def get(self, request):
        
        try:
            objects = Board.objects.all()
            serializer = BoardSerializer(instance=objects, many=True)

            return Response(serializer.data)
        except Exception as error:
            return Response({'error': str(error)}, status=400)

    def put(self, request, pk):
        if request.user.is_superuser:
            try:
                board = Board.objects.get(pk=pk)
            except Board.DoesNotExist:
                return Response(
                    {'error': 'Paddle with this ID does not exist'},
                    status=404
                )

            serializer = BoardSerializer(board, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'you are not admin'}, status=401)


class PadleView(APIView):

    def post(self, request): 
       if request.user.is_superuser:
            serializer = PadelSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
       else:
         return Response({'error':'you are not admin'}, status=401)
    
    def get(self, request):
        
        try:
            objects = Padel.objects.all()
            serializer = PadelSerializer(instance=objects, many=True)

            return Response(serializer.data)
        except Exception as error:
            return Response({'error': str(error)}, status=400)
        
    def put(self, request, pk):
        if request.user.is_superuser:
            try:
                paddle = Padel.objects.get(pk=pk)
            except Padel.DoesNotExist:
                return Response(
                    {'error': 'Paddle with this ID does not exist'},
                    status=404
                )

            serializer = PadelSerializer(paddle, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'you are not admin'}, status=401)


#how can i get user collection
        

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
            return Response(data=str(error))


