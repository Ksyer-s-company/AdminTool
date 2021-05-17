from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys
from  ..peewee_model import CodeTool
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class CodeUploaderView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        code = request.POST.get('code', '')
        if code == '':
            data = {
                'status_code': 404,
                'warningMessage': '请输入代码',
                'severity': 'warning',
                'ID': '',
            }
        
        try:
            instance = CodeTool(code=code, generate_time=datetime.now())
            instance.save()
            data = {
                'status_code': 200,
                'warningMessage': '上传成功, ID = ' + str(instance.code_id),
                'severity': 'success',
                'ID': str(instance.code_id),
            }
        except Exception as e:
            data = {
                'status_code': 500,
                'warningMessage': '后端接口 catch 到未知错误: ' + str(e),
                'severity': 'warning',
                'ID': '',
            }

        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})

    def get(self, request):
        return JsonResponse({}, safe=False)
