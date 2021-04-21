from django.urls import include, path
from rest_framework import routers

from .views.BeijinghuaView import BeijinghuaView
from .views.EASView import EASView
from .views.RepeaterView import RepeaterView
from .views.FileUploaderView import FileUploaderView
from .views.FileDownloaderView import FileDownloaderView
from .views.ImageDisplayerView import ImageDisplayerView

router = routers.DefaultRouter()

urlpatterns = [
    path('beijinghua', BeijinghuaView.as_view()),
    path('EAS', EASView.as_view()),
    path('repeater', RepeaterView.as_view()),
    path('upload_file', FileUploaderView.as_view()),
    path('download_file', FileDownloaderView.as_view()),
    path('upload_image', ImageDisplayerView.as_view()),
    path('', include(router.urls)),
]