from django.urls import path
from .views import PlotAPIView

urlpatterns = [
    path('merragraph', PlotAPIView.as_view()),
]