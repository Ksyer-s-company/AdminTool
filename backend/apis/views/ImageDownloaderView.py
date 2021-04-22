from django.http import JsonResponse, Http404, HttpResponse
from django.views import View
import json
import os
import base64

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../../'

class ImageDownloaderView(View):
    def __init__(self):
        super().__init__()
    
    def _upload(self, my_file):
        filename = BASE_DIR + 'images/' + my_file.name
        for i in range(1000):
            F = ".".join(filename.split('.')[:-1]) + "_" + str(i) + '.' + filename.split('.')[-1]
            if not os.path.exists(F):
                with open(F, 'wb+') as f:
                    for chunk in my_file.chunks():
                        f.write(chunk)
                return

        filename = BASE_DIR + 'images/' + my_file.name
        with open(filename, 'wb+') as f:
            for chunk in my_file.chunks():
                f.write(chunk)
        

    def post(self, request):
        my_file = request.FILES.get('file', None)

        if not my_file:
            data = {
                'images': '',
                'status_code': '404',
                'warningMessage': '请上传文件',
                'severity': 'warning',
            }
            return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii':False})
        
        try:
            base64_data = base64.b64encode(my_file.read())
            s = base64_data.decode()
            s = "data:image/jpeg;base64," + s
            self._upload(my_file)

            data = {
                'images': s,
                'status_code': '200',
                'warningMessage': '上传成功',
                'severity': 'Success',
            }
        except Exception as e:
            data = {
                'images': '',
                'status_code': '400',
                'warningMessage': str(e),
                'severity': 'warning',
            }
        return JsonResponse(data, safe=False)
    
    def get(self, request):
        for _, _, c in os.walk(BASE_DIR + 'files/'):
            t = c
        t = sorted(t)
        return JsonResponse(t, safe=False, json_dumps_params={'ensure_ascii':False})
