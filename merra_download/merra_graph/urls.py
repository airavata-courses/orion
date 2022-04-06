from django.urls import path
from .views import PlotAPIView

urlpatterns = [
    path('merra_graph', PlotAPIView.as_view()),
]