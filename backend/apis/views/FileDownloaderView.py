from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os

basic_path = "/home/zhn/workspace/1/AdminTool/"

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
        
        f = open(basic_path + 'files/' + filename, 'rb')
        print(f)
        return FileResponse(f)
  
    def get(self, request):
        filename = request.GET.get('filename', '')
        if filename == '':
            data = {
                'status_code': 404,
                'warningMessage': '文件名为空',
                'severity': 'warning',
            }
        
        f = open(basic_path + 'files/' + filename, 'rb')
        return FileResponse(f)
