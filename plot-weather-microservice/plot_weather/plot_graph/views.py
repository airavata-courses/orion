import gzip
import urllib
from datetime import datetime

import nexradaws
import pyart
import base64
import io

import pytz
from matplotlib import pyplot as plt
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response

 # Create your views here.
class PlotAPIView(APIView):

    def fetchData(self, files):
        templocation = 'aws_files'
        conn = nexradaws.NexradAwsInterface()
        central_timezone = pytz.timezone('US/Central')
        print(files)
        file_list = files.split("/")
        print("Files list=",file_list)
        file = urllib.request.urlretrieve('https://noaa-nexrad-level2.s3.amazonaws.com/' + files, "aws_files/"+file_list[4])
        if 'gz' in file_list[4]:
            filename = gzip.open('aws_files/' + file_list[4])
        else:
            filename = 'aws_files/' + file_list[4]
        return filename

    def createGraph(self, filename):
        filename = self.fetchData(filename)
        radar = pyart.io.read_nexrad_archive(filename)
        display = pyart.graph.RadarDisplay(radar)
        fig = plt.figure(figsize=(6, 5))

        # plot super resolution reflectivity
        ax = fig.add_subplot(111)
        display.plot('reflectivity', 0, title='NEXRAD Reflectivity', vmin=-32, vmax=64, colorbar_label='', ax=ax)
        display.plot_range_ring(radar.range['data'][-1] / 1000., ax=ax)
        display.set_limits(xlim=(-500, 500), ylim=(-500, 500), ax=ax)
        return plt

    def post(self, request):
        b64 = []
        json_str = json.dumps(request.data)
        json_data = json.loads(json_str)
        #uri = json_data['uri']
        for i in range(len(json_data)):
            fname = json_data[i]
            print(fname)
            plt = self.createGraph(fname)
            flike = io.BytesIO()
            plt.savefig(flike)
            b64.append(base64.b64encode(flike.getvalue()).decode())

        """resp = {
            'id':json_data['entryId'],
            'uri':b64
        }"""

        #return Response(resp)
        return Response(b64,content_type='image/jpg')