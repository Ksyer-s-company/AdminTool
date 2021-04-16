from django.http import JsonResponse, Http404
from django.views import View
import json
import os

basic_path = "/home/zhn/workspace/1/AdminTool/"

class FileUploaderView(View):
    def __init__(self):
        super().__init__()
    
    def _upload(self, my_file):
        with open(basic_path + 'files/' + my_file.name, 'wb+') as f:
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
            return JsonResponse(data, safe=False)
        
        try:
            self._upload(my_file)
            data = {
                'status_code': '200',
                'warningMessage': '上传成功',
                'severity': 'Success',
            }
        except Exception as e:
            data = {
                'status_code': '400',
                'warningMessage': str(e),
                'severity': 'warning',
            }
        return JsonResponse(data, safe=False)
    
    def get(self, request):
        for _, _, c in os.walk(basic_path + 'files/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False)
