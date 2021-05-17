from django.http import JsonResponse, Http404, FileResponse
from django.views import View
import json
import os
import sys
from  ..peewee_model import MarkdownTool

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
        markdown_query_result = MarkdownTool.select().filter(markdown_id=ID)
        if len(markdown_query_result) == 0:
            data = {
                'data': '',
                'status_code': 500,
                'warningMessage': 'ID不存在',
                'severity': 'warning',
            }
        elif len(markdown_query_result) > 1:
            data = {
                'data': '',
                'status_code': 401,
                'warningMessage': 'ID不唯一，请检查数据库',
                'severity': 'warning',
            }
        else:
            markdown = markdown_query_result[0].markdown_text
            data = {
                'data': markdown,
                'status_code': 200,
                'warningMessage': 'Success',
                'severity': 'success',
            }
        return JsonResponse(data, safe=False, )

    def get(self, request):
        return JsonResponse({}, safe=False)
