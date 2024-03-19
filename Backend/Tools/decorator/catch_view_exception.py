from rest_framework.response import Response


def catch_view_exception(func):

    def Wrapper(self, request):
        try:
            return func(self, request)
        except Exception as error:
            return Response(data={"error": str(error)})

    return Wrapper
