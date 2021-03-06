from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class FileDownloaderView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        filename = request.POST.get('filename', '')
        if filename == '':
            data = {
                'status_code': 404,
                'warningMessage': '文件名为空',
                'severity': 'warning',
            }
            return JsonResponse(data)
        else:
            if not os.path.exists(BASE_DIR + 'files/' + filename):
                data = {
                    'status_code': 404,
                    'warningMessage': '文件不存在',
                    'severity': 'warning',
                }
                return JsonResponse(data)
            else:
                return FileResponse(open(BASE_DIR + 'files/' + filename, 'rb'))


    def get(self, request):
        filename = request.GET.get('filename', '')
        if filename == '':
            f = None
            data = {
                'status_code': 404,
                'warningMessage': '文件名为空',
                'severity': 'warning',
            }
        
        return JsonResponse({'msg': 'msg'})