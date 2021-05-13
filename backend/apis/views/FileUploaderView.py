from django.http import JsonResponse, Http404
from django.views import View
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class FileUploaderView(View):
    def __init__(self):
        super().__init__()
    
    def _upload(self, my_file):
        with open(BASE_DIR + 'files/' + my_file.name, 'wb+') as f:
            for chunk in my_file.chunks():
                f.write(chunk)

    def post(self, request):
        my_file = request.FILES.get('file', None)

        if not my_file:
            data = {
                'status_code': '404',
                'warningMessage': '请上传文件',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})
        
        try:
            self._upload(my_file)
            data = {
                'status_code': '200',
                'warningMessage': '上传成功',
                'severity': 'Success',
                'filename': str(my_file),
            }
        except Exception as e:
            data = {
                'status_code': '400',
                'warningMessage': str(e),
                'severity': 'warning',
            }
        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})
    
    def get(self, request):
        for _, _, c in os.walk(BASE_DIR + 'files/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False)
