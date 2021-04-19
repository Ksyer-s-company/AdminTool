from django.http import JsonResponse, Http404
from django.views import View

def handle(str):
    ret = ''
    str = str.replace('儿', '').replace('你', '您')
    for i in str:
        ret = ret + i
        if i >= '0' and i <= '9':
            continue
        if i >= 'a' and i <= 'z':
            continue
        if i >= 'A' and i <= 'Z':
            continue
        if i in "'/!@#$%^&*()_+":
            continue
        if i != '\n':
            ret = ret + '儿'
    if ret[-1] != '儿':
        ret = ret + '儿'
    return ret

class BeijinghuaView(View):
    def __init__(self):
        super().__init__()
        self.s = ""

    def post(self, request):
        input_str = request.POST.get('input_str')
        try:
            if input_str == "":
                ret = {
                    'data': 'str is None',
                    'output_str': '',
                    'message': '请输入要转换的文本',
                    'severity': 'warning',
                }
            else:
                ret = {
                    'data': 'Success',
                    'output_str': handle(input_str),
                    'message': '转换成功',
                    'severity': 'success',
                }
        except Exception as e:
            print("e: ", e)
            ret = {
                'data': 'Error',
                'output_str': '',
                'message': '接口 catch 到未知错误',
                'severity': 'warning',
            }
        return JsonResponse(ret, safe=False, json_dumps_params={'ensure_ascii':False})
    
    def get(self, request):
        return JsonResponse({'msg': 'get'}, safe=False)