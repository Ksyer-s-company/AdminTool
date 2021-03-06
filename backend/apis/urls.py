from django.urls import include, path
from rest_framework import routers

from .views.BeijinghuaView import BeijinghuaView
from .views.RepeaterView import RepeaterView

from .views.FileUploaderView import FileUploaderView
from .views.FileDownloaderView import FileDownloaderView
from .views.FileDeleterView import FileDeleterView
from .views.ImageUploaderView import ImageUploaderView
from .views.ImageDisplayerView import ImageDisplayerView
from .views.CodeUploaderView import CodeUploaderView
from .views.CodeDownloaderView import CodeDownloaderView
from .views.MarkdownDownloaderView import MarkdownDownloaderView
from .views.MarkdownUploaderView import MarkdownUploaderView
from .views.MaddogView import MaddogView

router = routers.DefaultRouter()

urlpatterns = [
    path('beijinghua', BeijinghuaView.as_view()),
    path('repeater', RepeaterView.as_view()),
    path('maddog', MaddogView.as_view()),
    
    path('upload_file', FileUploaderView.as_view()),
    path('download_file', FileDownloaderView.as_view()),
    path('delete_file', FileDeleterView.as_view()),
    path('upload_image', ImageUploaderView.as_view()),
    path('display_image', ImageDisplayerView.as_view()),
    path('upload_code', CodeUploaderView.as_view()),
    path('download_code', CodeDownloaderView.as_view()),
    path('upload_markdown', MarkdownUploaderView.as_view()),
    path('download_markdown', MarkdownDownloaderView.as_view()),

    path('', include(router.urls)),
]
