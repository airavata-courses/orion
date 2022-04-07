#*************************************************************************************************************************
#import the required Python libraries. If any of the following import commands fail check the local Python environment
#and install any missing packages.
#*************************************************************************************************************************
import pika
import sys
import json
import urllib3
import certifi
import requests
from time import sleep
from http.cookiejar import CookieJar
import urllib.request
from urllib.parse import urlencode
import getpass
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

#Initialize the urllib PoolManager and set the base URL for the API requests that will be sent to the GES DISC subsetting service.

# Create a urllib PoolManager instance to make requests.
http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED',ca_certs=certifi.where())
# Set the URL for the GES DISC subset service endpoint
url = 'https://disc.gsfc.nasa.gov/service/subset/jsonwsp'

###################################################   RABBITMQ  CODE BEGINS    ###############################################################################
 
# establish connection with rabbitmq server 
connection = pika.BlockingConnection(pika.ConnectionParameters('orionRabbit'))
channel = connection.channel()
print(" Connected to RBmq server")

#create/ declare queue
channel.queue_declare(queue='merra_download_rx')

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
channel.basic_consume(queue='merra_download_rx', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()
channel.close()


###################################################   RABBITMQ  CODE ENDS    ###############################################################################


#unpack the data in message and process the message and return the output
def process_req(request):
    
    json_data = json.loads(request)
    print(json_data)
    username = json_data['username']
    password = json_data['password']
    minLatitude = json_data['minLatitude']
    maxLatitude = json_data['maxLatitude']
    minLongitude = json_data['minLongitude']
    maxLongitude = json_data['maxLangitude']
    date = json_data['date']
    urls=downloadMerraData(username,password,minLatitude,maxLatitude, minLongitude, maxLongitude, date)
    return urls



# Login and Download merra data
def downloadMerraData(username,password,minLatitude,maxLatitude, minLongitude, maxLongitude, date):
    
    # Earthdata Login
    username = 'teamOrion2022'
    password = 'AdsSpring2022'

    # Create a password manager to deal with the 401 response that is returned from
    password_manager = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    password_manager.add_password(None, "https://urs.earthdata.nasa.gov", username, password)

    # Create a cookie jar for storing cookies. This is used to store and return the session cookie #given to use by the data server
    cookie_jar = CookieJar()
        
    # Install all the handlers.
    opener = urllib.request.build_opener (urllib.request.HTTPBasicAuthHandler (password_manager),urllib.request.HTTPCookieProcessor (cookie_jar))
    urllib.request.install_opener(opener)
        
    # Open a request for the data, and download files
    print('\n HTTP_services output:')
    urls=constructSubsetData(minLatitude,maxLatitude, minLongitude, maxLongitude, date)
    
    URL = urls['link'] 
    print('URL : {}'.format(URL))
    DataRequest = urllib.request.Request(URL)
    DataResponse = urllib.request.urlopen(DataRequest)
    DataBody = DataResponse.read()

    response = {}
    response['fileName'] = urls['label']
    response['dataBody'] = DataBody
    # # Save file to working directory
    # try:
    #     file_name = item['label']
    #     file_ = open('data-files/'+file_name, 'wb')
    #     file_.write(DataBody)
    #     file_.close()
    #     print (file_name, " is downloaded")
    # except requests.exceptions.HTTPError as e:
    #     print(e)

    # print('Downloading is done and find the downloaded files in your current working directory')

    return response



# The following method constructs the and returns the Subsetted records

def constructSubsetData(minLatitude,maxLatitude, minLongitude, maxLangitude, date):

    # Define the parameters for the data subset
    # product = 'M2I3NPASM_V5.12.4' 
    # # varNames =['T', 'RH', 'O3']
    # varNames =['T']
    # minlon = -180
    # maxlon = 180
    # minlat = -90
    # maxlat = -45
    # begTime = '1980-01-01'
    # endTime = '1980-01-01'
    # begHour = '00:00'
    # endHour = '00:00'


    # Define the parameters for the data subset

    product = 'M2I3NPASM_V5.12.4' 
    varNames =['T']
    minlon = minLatitude
    maxlon = minLongitude
    minlat = maxLangitude
    maxlat = maxLatitude
    begTime = date
    endTime = date
    begHour = '00:00'
    endHour = '00:00'


    # Subset only the mandatory pressure levels (units are hPa)
    # 1000 925 850 700 500 400 300 250 200 150 100 70 50 30 20 10 7 5 3 2 1 
    dimName = 'lev'
    dimVals = [1,4,7,13,17,19,21,22,23,24,25,26,27,29,30,31,32,33,35,36,37]
    # Construct the list of dimension name:value pairs to specify the desired subset
    dimSlice = []
    for i in range(len(dimVals)):
        dimSlice.append({'dimensionId': dimName, 'dimensionValue': dimVals[i]})



    # Construct JSON WSP request for API method: subset
    subset_request = {
        'methodname': 'subset',
        'type': 'jsonwsp/request',
        'version': '1.0',
        'args': {
            'role'  : 'subset',
            'start' : begTime,
            'end'   : begTime,
            'box'   : [minlon, minlat, maxlon, maxlat],
            'crop'  : True, 
            'data': [{'datasetId': product,
                    'variable' : varNames[0],
                    'slice': dimSlice
                    }]
        }
    }




    # Submit the subset request to the GES DISC Server
    response = get_http_data(subset_request)
    # Report the JobID and initial status
    myJobId = response['result']['jobId']
    print('Job ID: '+myJobId)
    print('Job status: '+response['result']['Status'])




    # Construct JSON WSP request for API method: GetStatus
    status_request = {
        'methodname': 'GetStatus',
        'version': '1.0',
        'type': 'jsonwsp/request',
        'args': {'jobId': myJobId}
    }

    # Check on the job status after a brief nap
    while response['result']['Status'] in ['Accepted', 'Running']:
        sleep(5)
        response = get_http_data(status_request)
        status  = response['result']['Status']
        percent = response['result']['PercentCompleted']
        print ('Job status: %s (%d%c complete)' % (status,percent,'%'))
    if response['result']['Status'] == 'Succeeded' :
        print ('Job Finished:  %s' % response['result']['message'])
    else : 
        print('Job Failed: %s' % response['fault']['code'])
        sys.exit(1)



    # Construct JSON WSP request for API method: GetResult
    batchsize = 20
    results_request = {
        'methodname': 'GetResult',
        'version': '1.0',
        'type': 'jsonwsp/request',
        'args': {
            'jobId': myJobId,
            'count': batchsize,
            'startIndex': 0
        }
    }

    # Retrieve the results in JSON in multiple batches 
    # Initialize variables, then submit the first GetResults request
    # Add the results from this batch to the list and increment the count
    results = []
    count = 0 
    response = get_http_data(results_request) 
    count = count + response['result']['itemsPerPage']
    results.extend(response['result']['items']) 

    # Increment the startIndex and keep asking for more results until we have them all
    total = response['result']['totalResults']
    while count < total :
        results_request['args']['startIndex'] += batchsize 
        response = get_http_data(results_request) 
        count = count + response['result']['itemsPerPage']
        results.extend(response['result']['items'])
        
    # Check on the bookkeeping
    print('Retrieved %d out of %d expected items' % (len(results), total))



    # Sort the results into documents and URLs

    docs = []
    urls = []
    for item in results :
        try:
            # print('{} Item:'.format(item))
            if item['start'] and item['end'] : urls.append(item) 
            
        except:
            docs.append(item)

    # Print out the documentation links, but do not download them
    # print('\nDocumentation:')
    # for item in docs : print(item['label']+': '+item['link'])


    return urls




# definea a local general-purpose method that submits a JSON-formatted Web Services Protocol (WSP) request to the GES DISC server, checks for any errors, and then returns the response. 
# This method is created for convenience as this task will be repeated more than once.
# This method POSTs formatted JSON WSP requests to the GES DISC endpoint URL
# It is created for convenience since this task will be repeated more than once

def get_http_data(request):
    hdrs = {'Content-Type': 'application/json',
            'Accept'      : 'application/json'}
    data = json.dumps(request)       
    r = http.request('POST', url, body=data, headers=hdrs)
    response = json.loads(r.data)   
    # Check for errors
    if response['type'] == 'jsonwsp/fault' :
        print('API Error: faulty %s request' % response['methodname'])
        sys.exit(1)
    return response