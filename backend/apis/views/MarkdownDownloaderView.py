from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class MarkdownDownloaderView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        ID = request.POST.get('ID', '')
        
        if ID == '':
            data = {
                'data': '',
                'status_code': 404,
                'warningMessage': 'ID为空',
                'severity': 'warning',
            }
        filename = BASE_DIR + 'markdowns/' + ID
        if not os.path.exists(filename):
            data = {
                'data': '',
                'status_code': 500,
                'warningMessage': 'ID不存在',
                'severity': 'warning',
            }
        else:
            with open(filename, 'r') as f:
                code = f.readlines()
            data = {
                'data': ''.join(code),
                'status_code': 200,
                'warningMessage': 'Success',
                'severity': 'success',
            }
        return JsonResponse(data, safe=False, )

    def get(self, request):
        return JsonResponse({'msg': 'msg'}, safe=False)
