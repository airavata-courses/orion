from django.urls import path
from .views import PlotAPIView

urlpatterns = [
    path('merraingestor', PlotAPIView.as_view()),
]