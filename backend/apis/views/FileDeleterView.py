from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class FileDeleterView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        filename = request.POST.get('filename', '')
        if filename == '':
            data = {
                'status_code': 400,
                'warningMessage': '文件名为空',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False)
        
        full_filename = BASE_DIR + 'files/' + filename
        if not os.path.exists(full_filename):
            data = {
                'status_code': 404,
                'warningMessage': '文件不存在',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False)
        
        os.remove(full_filename)
        data = {
            'status_code': 200,
            'warningMessage': '删除成功',
            'severity': 'success',
        }

        return JsonResponse(data, safe=False)
  
    def get(self, request):
        for _, _, c in os.walk(BASE_DIR + 'files/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False)
