from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class ImageDownloaderView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        filename = request.POST.get('filename', '')
        print(filename)
        if filename == '':
            data = {
                'status_code': 404,
                'warningMessage': '文件名为空',
                'severity': 'warning',
            }
            return JsonResponse(data)
        else:
            return FileResponse(open(BASE_DIR + 'images/' + filename, 'rb'))
    
    def get(self, request):
        for _, _, c in os.walk(BASE_DIR + 'images/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False)
