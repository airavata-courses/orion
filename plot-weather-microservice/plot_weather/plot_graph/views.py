from .server import *

# import gzip
# from locale import CODESET
# import urllib
# from datetime import datetime
# import pika, sys, os

# import nexradaws
# import pyart
# import base64
# import io

# import pytz
# from matplotlib import pyplot as plt
# from rest_framework.utils import json
# from rest_framework.views import APIView
# from rest_framework.response import Response

#  # Create your views here.
# class PlotAPIView(APIView):

#     def fetchData(self, files):
#         templocation = 'aws_files'
#         conn = nexradaws.NexradAwsInterface()
#         central_timezone = pytz.timezone('US/Central')
#         print(files)
#         file_list = files.split("/")
#         print("Files list=",file_list)
#         file = urllib.request.urlretrieve('https://noaa-nexrad-level2.s3.amazonaws.com/' + files, "aws_files/"+file_list[4])
#         if 'gz' in file_list[4]:
#             filename = gzip.open('aws_files/' + file_list[4])
#         else:
#             filename = 'aws_files/' + file_list[4]
#         return filename

#     def createGraph(self, filename):
#         filename = self.fetchData(filename)
#         radar = pyart.io.read_nexrad_archive(filename)
#         display = pyart.graph.RadarDisplay(radar)
#         fig = plt.figure(figsize=(6, 5))

#         # plot super resolution reflectivity
#         ax = fig.add_subplot(111)
#         display.plot('reflectivity', 0, title='NEXRAD Reflectivity', vmin=-32, vmax=64, colorbar_label='', ax=ax)
#         display.plot_range_ring(radar.range['data'][-1] / 1000., ax=ax)
#         display.set_limits(xlim=(-500, 500), ylim=(-500, 500), ax=ax)
#         return plt

#     #The input received from the MQ will be passed to this function
#     def post(self, request):
#         b64 = []
#         json_str = json.dumps(request.data)
#         json_data = json.loads(json_str)
#         #uri = json_data['uri']
#         for i in range(len(json_data)):
#             fname = json_data[i]
#             print(fname)
#             plt = self.createGraph(fname)
#             flike = io.BytesIO()
#             plt.savefig(flike)
#             b64.append(base64.b64encode(flike.getvalue()).decode())

#         """resp = {
#             'id':json_data['entryId'],
#             'uri':b64
#         }"""

#         # Add the mq response code

#         #return Response(resp)
#         #Remove this line if not required
#         return Response(b64,content_type='image/jpg')



# """"
# RABBITMQ CODE

# """""
# # establish connection with rabbitmq server 
# connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
# channel = connection.channel()

# #create/ declare queue
# channel.queue_declare(queue='plot_queue')


# # subscribe a callback function to the queue. This callback function is called by the pika library
# # It does the work and sends the response back.
# def on_request(ch, method, props, body):
#         # our message content will be in body 
#         n = int(body) 

#         print(" [.] fib(%s)" % n)

#         # instead of fib here our plot graph function should be called and response should be saved here 
#         response = fib(n) 

#         ch.basic_publish(exchange='',
#                         routing_key=props.reply_to,
#                         properties=pika.BasicProperties(correlation_id = \
#                                                             props.correlation_id),
#                         body=str(response))
#         ch.basic_ack(delivery_tag=method.delivery_tag)

# # We might want to run more than one server process. 
# # In order to spread the load equally over multiple servers we need to set the prefetch_count setting.
# channel.basic_qos(prefetch_count=1)
        
# # We declare a callback "on_request" for basic_consume, the core of the RPC server. It's executed when the request is received.
# channel.basic_consume(queue='plot_queue', on_message_callback=on_request)

# print(" [x] Awaiting RPC requests")
# channel.start_consuming()

# print(' [*] Waiting for messages. To exit press CTRL+C')
# channel.start_consuming()



# def fib(n):
#     if n == 0:
#         return 0
#     elif n == 1:
#         return 1
#     else:
#         return fib(n - 1) + fib(n - 2)