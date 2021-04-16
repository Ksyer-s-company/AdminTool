from django.http import JsonResponse, Http404
from django.views import View

def handle(input_str, emoji_selected):
    ret = ''
    if input_str == '':
        ret = ''
    else:
        ret = ''
        if emoji_selected == 'selectWechat':
            emoji = '[色]'
        elif emoji_selected == 'selectEmoji':
            emoji = '😍'
        elif emoji_selected == 'selectWeiboSe':
            emoji = '[色]'
        elif emoji_selected == 'selectWeiboTianping':
            emoji = '[舔屏]'
        ret = input_str + emoji + '我的' + input_str + emoji + emoji
    return ret


class RepeaterView(View):
    def __init__(self):
        super().__init__()
        self.s = ""

    def post(self, request):
        input_str = request.POST.get('input_str')
        emoji_selected = request.POST['emoji']
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
                    'output_str': handle(input_str, emoji_selected),
                    'message': '转换成功',
                    'severity': 'success',
                }
        except Exception as e:
            ret = {
                'data': 'Error',
                'output_str': '',
                'message': '接口 catch 到未知错误: ' + str(e),
                'severity': 'warning',
            }
        return JsonResponse(ret, safe=False)
