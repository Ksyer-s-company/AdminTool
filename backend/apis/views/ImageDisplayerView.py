from django.http import JsonResponse, Http404, HttpResponse
from django.views import View
import json
import os
import base64
from ..peewee_model import ImageTool

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
            img_query_result = ImageTool.select().filter(img_filename=filename)
            if len(img_query_result) == 0:
                data = {
                    'data': '',
                    'status_code': 500,
                    'warningMessage': 'ID不存在',
                    'severity': 'warning',
                }
            elif len(img_query_result) > 1:
                data = {
                    'data': '',
                    'status_code': 401,
                    'warningMessage': 'ID不唯一，请检查数据库',
                    'severity': 'warning',
                }
            else:
                filename = BASE_DIR + 'images/' + img_query_result[0].img_filename
                print(filename)
                with open(filename, 'rb') as f:
                    s = base64.b64encode(f.read())
                    s = "data:image/png;base64," + str(s)[2: -1]
                data = {
                    'image': s,
                    'status_code': '200',
                    'warningMessage': '查询成功',
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
        path = BASE_DIR + 'images/'
        for _, _, c in os.walk(path):
            pass
        return JsonResponse(c, safe=False, json_dumps_params={'ensure_ascii':False})
