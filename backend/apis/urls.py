from django.urls import include, path
from rest_framework import routers

from .views.BeijinghuaView import BeijinghuaView
from .views.EASView import EASView
from .views.RepeaterView import RepeaterView
from .views.PdfReaderView import PdfReaderView

router = routers.DefaultRouter()

urlpatterns = [
    path('beijinghua', BeijinghuaView.as_view()),
    path('EAS', EASView.as_view()),
    path('repeater', RepeaterView.as_view()),
    path('pdf_reader', PdfReaderView.as_view()),
    path('', include(router.urls)),
]