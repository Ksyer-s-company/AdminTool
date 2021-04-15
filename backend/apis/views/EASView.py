from django.http import JsonResponse, Http404
from django.views import View

class EASView(View):
    def __init__(self):
        super().__init__()