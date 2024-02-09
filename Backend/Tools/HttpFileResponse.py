import os
from django.http import HttpResponse, HttpResponseNotFound
from core.settings import MEDIA_ROOT

def HttpFileResponse(file_name, Content_type=None):
    ''' serve static file as Response'''
    try:
        path = os.path.join(MEDIA_ROOT, file_name)
        file = open(path, "rb")
        if Content_type:
            return HttpResponse(file.read(), content_type=Content_type)
        return HttpResponse(file.read())
    except Exception as error:
        return HttpResponseNotFound(str(error)) # !