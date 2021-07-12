from django.http import JsonResponse, Http404
from django.views import View
from ..peewee_model import Maddog
from datetime import datetime
import time

def short_generator(s):
    ret = '我真的想{}想得要发疯了。我躺在床上会想{}，我吃饭会想{}，我上厕所会想{}，我洗澡会想{}，我出门会想{}，我走路会想{}，我坐车会想{}，我上课会想{}，我玩手机会想{}。我盯着路边的{}看我盯着马路对面的{}看我盯着地铁里的{}看，我盯着朋友圈别人合照里的{}看，我每时每刻眼睛都直直地盯着{}看'.format(s, s, s, s, s, s, s, s, s, s, s, s, s, s, s)
    return ret

def long_generator(s):
    f, n = s
    localtime = time.localtime(time.time())
    mon = localtime.tm_mon if localtime.tm_mon >= 10 else '0' + str(localtime.tm_mon)
    mday = localtime.tm_mday if localtime.tm_mday >= 10 else '0' + str(localtime.tm_mday)
    hour = localtime.tm_hour if localtime.tm_hour >= 10 else '0' + str(localtime.tm_hour)
    mins = localtime.tm_min if localtime.tm_min >= 10 else '0' + str(localtime.tm_min)
    ret = "现在是{}月{}日{}:{}，{}情绪发作最严重的一次，躺在床上，拼命念大悲咒，难受的一直抓自己眼睛，以为刷微博没事，看到微博到处都有{}，眼睛越来越大都要炸开了一样，拼命扇自己，越扇越用力，扇到自己眼泪流出来，真的不知道该怎么办，我真的{}{}得要发疯了！我躺在床上会有{}情绪，我洗澡会有{}情绪，我出门会有{}情绪，我走路会有{}情绪，我坐车会有{}情绪，我工作会有{}情绪，我玩手机会有{}情绪——我拼命盯着路上的人看，每当用我智慧的双眼判断这个有{}倾向时，我就控制不住地要去询问别人到底是不是{}，但当回到家就像现在一样躺在床上发狂，思来想去全是你们这群{}的错！".format(mon, mday, hour, mins, f, n, f, f[0], f, f, f, f, f, f, f, n, n, n)
    return ret

class MaddogView(View):
    def __init__(self):
        super().__init__()
        self.s = ""

    def post(self, request):
        input_str = request.POST.get('input_str')
        size = request.POST.get('size')
        try:
            if input_str == "":
                ret = {
                    'data': 'str is None',
                    'output_str': '',
                    'message': '请输入要转换的文本',
                    'severity': 'warning',
                }
            else:
                instance = Maddog(input_str=input_str, generate_time=datetime.now())
                instance.save()
                ret = {
                    'data': 'Success',
                    'output_str': short_generator(input_str) if size == 'short' else long_generator(input_str.split('|||||')),
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