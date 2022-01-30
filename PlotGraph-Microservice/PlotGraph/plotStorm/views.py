import base64
import io
from datetime import datetime
from io import StringIO

import numpy as np
import pytz
from django.http import HttpResponse
from django.shortcuts import render
import pyart
from django.template import context
from matplotlib import pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import boto3
import nexradaws
import gzip

# Create your views here.
class PlotAPIView(APIView):

    def fetchData(self,zone,radar_id,year,month,date,hour,end_hour):
        templocation = 'aws_files'
        conn = nexradaws.NexradAwsInterface()
        """central_timezone = pytz.timezone('US/Central')
        radar_id = 'KTLX'
        start = central_timezone.localize(datetime(2013, 5, 31, 17, 0))
        end = central_timezone.localize(datetime(2013, 5, 31, 19, 0))"""

        time_zone = pytz.timezone(zone)
        start = time_zone.localize(datetime(year,month,date,hour,0))
        end = time_zone.localize(datetime(year,month,date,end_hour,0))

        scans = conn.get_avail_scans_in_range(start, end, radar_id)
        #print("There are {} scans available between {} and {}\n".format(len(scans), start, end))
        #print(scans[0:4])
        conn.download(scans[0], templocation)
        filename = gzip.open('aws_files/'+scans[0].filename)
        return filename

    def createGraph(self,time_zone,radar_id,year,month,date,hour,end_hour):
        filename = self.fetchData(time_zone,radar_id,year,month,date,hour,end_hour)
        #filename = 'KAPX20130608_000226_V06'
        #filename = scan
        radar = pyart.io.read_nexrad_archive(filename)
        display = pyart.graph.RadarDisplay(radar)
        fig = plt.figure(figsize=(6, 5))

        # plot super resolution reflectivity
        ax = fig.add_subplot(111)
        display.plot('reflectivity', 0, title='NEXRAD Reflectivity',vmin=-32, vmax=64, colorbar_label='', ax=ax)
        display.plot_range_ring(radar.range['data'][-1] / 1000., ax=ax)
        display.set_limits(xlim=(-500, 500), ylim=(-500, 500), ax=ax)
        #plt.show()

        """response = HttpResponse(content_type='image/png')
        canvas = FigureCanvasAgg(fig)
        canvas.print_png(response)"""
        #return render(canvas,'index.html')
        return plt

    def post(self, request):
        """context['graph'] = self.return_graph()
        return render(request, 'index.html', context)"""
        json_str = json.dumps(request.data)
        json_data = json.loads(json_str)
        #print("Id=",json_data['id'])

        time_zone = json_data['time_zone']
        radar_id = json_data['radar_id']
        year = json_data['year']
        month = json_data['month']
        date = json_data['date']
        hour = json_data['hour']
        end_hour = hour+1
        plt = self.createGraph(time_zone,radar_id,year,month,date,hour,end_hour)

        #plt = self.createGraph()
        #plt.savefig("fig.jpg")
        flike = io.BytesIO()
        plt.savefig(flike)
        #response = HttpResponse(content_type='image/png')
        """canvas = FigureCanvasAgg(plt)
        canvas.print_png(response)"""
        #return render(response)
        b64 = base64.b64encode(flike.getvalue()).decode()
        #context['graph'] = b64
        return HttpResponse(plt, content_type="image/jpg")
        #return Response(b64,content_type='image/jpg')
        #return render(request,'index.html',{'data':json_data})

        #return render(request, 'index.html', {'graph':b64})
