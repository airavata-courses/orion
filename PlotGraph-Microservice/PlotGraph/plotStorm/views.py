from django.shortcuts import render
import pyart

# Create your views here.
def index(request):
    return render(request, 'index.html')
