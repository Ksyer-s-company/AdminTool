from django.http import JsonResponse, Http404
from django.views import View

class PdfReaderView(View):
    def __init__(self):
        super().__init__()
    
    def post(self, request):
        myFile = request.FILES.get('myfile', None)
        if not myFile:
            return HttpResponse('no files for upload')
        des = open(basic_path + '/' + myFile.name, 'wb+')
        for chunk in myFile.chunks():
            des.write(chunk)
        des.close()
        return JsonResponse(data, safe=False)
    
    def get(self, request):
        id = request.GET.get('id', -1)
        id = int(id)
        if id == -1:
            return redirect('/')
        
        for _, _, c in os.walk(basic_path):
            t = c
        t = sorted(t)
        id = t[id]
        f = open(basic_path + '/' + id, 'rb')
        return FileResponse(f)
