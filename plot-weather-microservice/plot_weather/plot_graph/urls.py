from django.urls import path
from .views import PlotAPIView

urlpatterns = [
    path('plotgraph', PlotAPIView.as_view()),
]