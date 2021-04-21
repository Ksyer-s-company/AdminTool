from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class CodeSaverView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        code = request.POST.get('code', '')
        if code == '':
            data = {
                'status_code': 404,
                'warningMessage': '文件名为空',
                'severity': 'warning',
                'ID': '',
            }
        
        id = 0
        base_filename = BASE_DIR + 'codes/'
        M = -1
        for _, _, c in os.walk(base_filename):
            files = c

        for f in files:
            try:
                print(f)
                if M < int(f):
                    M = int(f)
            except Exception as e:
                print("Error: ", e)
        print(M)
        
        try:
            filename = base_filename + str(M + 1)
            print(filename)
            with open(filename, "w") as f:
                f.write(code)
            data = {
                'status_code': 200,
                'warningMessage': '上传成功, ID = ' + str(M + 1),
                'severity': 'success',
                'ID': str(M + 1)
            }
        except Exception as e:
            data = {
                'status_code': 500,
                'warningMessage': '接口 catch 到未知错误: ' + str(e),
                'severity': 'warning',
                'ID': '',
            }

        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})

    def get(self, request):
        return JsonResponse({'msg': 'msg'}, safe=False)
