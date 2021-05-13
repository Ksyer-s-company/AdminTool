from django.http import JsonResponse, Http404, HttpResponse
from django.views import View
import json
import os
import base64

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class ImageDisplayerView(View):
    def __init__(self):
        super().__init__()

    def post(self, request):
        filename = request.POST.get('filename', None)

        if not filename:
            data = {
                'image': '',
                'status_code': '404',
                'warningMessage': '图片不存在',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})
        
        try:
            full_filename = BASE_DIR + 'images/' + filename
            with open(full_filename, 'rb') as f:
                base64_data = base64.b64encode(f.read())
                s = base64_data.decode()
                s = "data:image/jpeg;base64," + s

            data = {
                'image': s,
                'status_code': '200',
                'warningMessage': '上传成功',
                'severity': 'Success',
            }
        except Exception as e:
            data = {
                'image': '',
                'status_code': '400',
                'warningMessage': str(e),
                'severity': 'warning',
            }
        return JsonResponse(data, safe=False)
    
    def get(self, request):
        for _, _, c in os.walk(BASE_DIR + 'images/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False, json_dumps_params={'ensure_ascii':False})
