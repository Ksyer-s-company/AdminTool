from django.http import JsonResponse, Http404, HttpResponse
from django.views import View
import json
import os
from ..peewee_model import ImageTool
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class ImageUploaderView(View):
    def __init__(self):
        super().__init__()

    def post(self, request):
        my_file = request.FILES.get('file', None)

        if not my_file:
            data = {
                'images': '',
                'status_code': '404',
                'warningMessage': '请上传文件',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})
        
        try:
            instance = ImageTool(generate_time=datetime.now(), img_filename=my_file.name)
            instance.save()

            data = {
                'images': my_file.name,
                'status_code': '200',
                'warningMessage': '上传成功',
                'severity': 'Success',
            }
        except Exception as e:
            data = {
                'images': '',
                'status_code': '400',
                'warningMessage': str(e),
                'severity': 'warning',
            }
        return JsonResponse(data, safe=False)
    
    def get(self, request):
        path = BASE_DIR + 'images/'
        for _, _, c in os.walk(path):
            pass
        return JsonResponse(c, safe=False, json_dumps_params={'ensure_ascii':False})
