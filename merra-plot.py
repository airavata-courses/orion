# Import the required Python libraries. They are used to read and plot the data. If any of the following import commands fail, check the local Python environment and install any missing packages.
import json
import pika
import base64
import numpy as np
from netCDF4 import Dataset
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import io

###################################################   RABBITMQ  CODE BEGINS    ###############################################################################

#Rabbitmq 
# establish connection with rabbitmq server 
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
print(" Connected to RBmq server")

#create/ declare queue
channel.queue_declare(queue='merra_plot_rx')

#callback function for the queue 
def on_request(ch, method, props, body):
    print(" [.] Received this data %s", body)
    response = process_req(body)
    ch.basic_publish(exchange='', routing_key=props.reply_to, properties=pika.BasicProperties(correlation_id = props.correlation_id), body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)

# We might want to run more than one server process. 
# In order to spread the load equally over multiple servers we need to set the prefetch_count setting.
channel.basic_qos(prefetch_count=1)
                
# We declare a callback "on_request" for basic_consume, the core of the RPC server. It's executed when the request is received.
channel.basic_consume(queue='merra_plot_rx', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()
channel.close()

###################################################   RABBITMQ  CODE ENDS    ###############################################################################

def process_req(body):
    b64 = []
    json_data = json.loads(body)
    print(json_data)
    file_name = json_data['fileName']
    file_ = open('data-files/'+file_name, 'wb')
    file_.write(json_data['dataBody'])
    file_.close()
    print (file_name, " is downloaded")
    

    print('Downloading is done and find the downloaded files in your current working directory')
    #Read in NetCDF4 file (add a directory path if necessary):
    data = Dataset(file_name, mode='r')

    # Run the following line below to print MERRA-2 metadata. This line will print attribute and variable information. From the 'variables(dimensions)' list, choose which variable(s) to read in below.
    print(data)

    # Read in the 'T2M' 2-meter air temperature variable:
    lons = data.variables['lon'][:]
    lats = data.variables['lat'][:]
    T2M = data.variables['T'][:,:,:]

    # If using MERRA-2 data with multiple time indices in the file, the following line will extract only the first time index.
    # Note: Changing T2M[0,:,:] to T2M[10,:,:] will subset to the 11th time index.

    T2M = T2M[0,0,:]
    print(T2M)
    # Plot the data using matplotlib and cartopy

    # Set the figure size, projection, and extent
    fig = plt.figure(figsize=(8,4))
    ax = plt.axes(projection=ccrs.Robinson())
    ax.set_global()
    ax.coastlines(resolution="110m",linewidth=1)
    ax.gridlines(linestyle='--',color='black')

    # Set contour levels, then draw the plot and a colorbar
    clevs = np.arange(230,311,5)
    plt.contourf(lons, lats, T2M, clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
    plt.title('MERRA-2 Air Temperature at 2m, January 2010', size=14)
    cb = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=16, shrink=0.8)
    cb.set_label('K',size=12,rotation=0,labelpad=15)
    cb.ax.tick_params(labelsize=10)

    # Save the plot as a PNG image

    fig.savefig('MERRA2_t2m.png', format='png', dpi=360)

    flike = io.BytesIO()
    plt.savefig(flike)
    b64.append(base64.b64encode(flike.getvalue()).decode())
