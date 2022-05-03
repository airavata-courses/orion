from flask import Flask, render_template, request
import json
import requests

from custos.clients.user_management_client import UserManagementClient
from custos.clients.group_management_client import GroupManagementClient
from custos.clients.resource_secret_management_client import ResourceSecretManagementClient
from custos.clients.sharing_management_client import SharingManagementClient
from custos.clients.identity_management_client import IdentityManagementClient


from custos.transport.settings import CustosServerClientSettings
import custos.clients.utils.utilities as utl

from google.protobuf.json_format import MessageToJson
app = Flask(__name__)

# # read settings
# custos_settings = CustosServerClientSettings(custos_host='custos.scigap.org',
#                             custos_port='31499', 
#                             custos_client_id='custos-rswfydl920pg7kuvmayc-10003419',
#                             custos_client_sec='zGDFZJpx40E0OT5EIS6WL1PZK2hHtiOs2aYFyR1y')

# # create custos user management client
# user_management_client = UserManagementClient(custos_settings)
# global orion
class Orion:
    # def __init__(self):
    try :
            # read settings
            custos_settings = CustosServerClientSettings(custos_host='custos.scigap.org',
                            custos_port='31499', 
                            custos_client_id='custos-rswfydl920pg7kuvmayc-10003419',
                            custos_client_sec='zGDFZJpx40E0OT5EIS6WL1PZK2hHtiOs2aYFyR1y')

            # create custos user management client
            user_management_client = UserManagementClient(custos_settings)

            # create custos group management client
            group_management_client = GroupManagementClient(custos_settings)

            # create custos resource secret client
            resource_secret_client = ResourceSecretManagementClient(custos_settings)

            # create sharing management client
            sharing_management_client = SharingManagementClient(custos_settings)

            # create identity management client
            identity_management_client = IdentityManagementClient(custos_settings)


            # obtain base 64 encoded token for tenant
            b64_encoded_custos_token = utl.get_token(custos_settings=custos_settings)

            created_groups = {}

            admin_user_name = "isjarana"
            admin_password = "IJR@circ@1"
            
            resource_ids = []
            print("Successfully configured all custos clients")
            print(b64_encoded_custos_token)
    except Exception as e:
            raise e
            print("Custos Id and Secret may wrong "+ str(e))

        
    def register_users(self, user):
        try:
            # print("Inside Try block")
            # print("Username:", user['username'])
            # print("Firstname:", user['first_name'])
            # print("LastName:", user['last_name'])
            # print("password:", user['password'])
            # print("email:", user['email'])

            self.user_management_client.register_user(token=self.b64_encoded_custos_token,
                                                username=user['username'],
                                                first_name=user['first_name'],
                                                last_name=user['last_name'],
                                                password=user['password'],
                                                email=user['email'],
                                                is_temp_password=False)

            # self.user_management_client.register_user(self, self.b64_encoded_custos_token,
            #                                     user['username'],
            #                                     user['first_name'],
            #                                     user['last_name'],
            #                                     user['password'],
            #                                     user['email'],
            #                                     False)
            print("I executed the first step in user_management_client ")

            self.user_management_client.enable_user(token=self.b64_encoded_custos_token, username=user['username'])
            print("I executed the second step in user_management_client ")

            ## The following two codes isnt there in isuru code 
            # self.users.append(user['username'])
            # return 1
        except Exception:
            print("User may already exist")
            # return 0
    print("register_users method is defined")

    def create_group(self, group):
        try:
            print("Creating group: " + group['name'])
            
            grResponse = self.group_management_client.create_group(token=self.b64_encoded_custos_token,
                                                            name=group['name'],
                                                            description=group['description'],
                                                            owner_id=self.admin_user_name)
            resp = MessageToJson(grResponse)
            print(resp)
            respData = json.loads(resp)
            print("Created group id of "+ group['name'] + ": " +respData['id'] )
            self.created_groups[respData['name']] = respData['id']
            temp = Groups_Json()
            temp.write_groups(respData['name'], group['owner_id'])
            temp.save_json()
            del temp
            return 1
        except Exception as e:
            print(e)
            print("Group may be already created")
            return 0
    def get_all_groups(self):
        try:
            groups = self.group_management_client.get_all_groups(self.b64_encoded_custos_token)
            # for x in groups:
            #     print(x)
            resp = MessageToJson(groups)
            respData = json.loads(resp)
            # for x in respData['groups']:
            #     print(x['id'])
            return respData['groups']
        except:
            return 0

    def allocate_user_to_group(self, user, group):
        try:
            group_id = self.created_groups[group]
            print("Assigning user " + user + " to group " + group)
            val = self.group_management_client.add_user_to_group(token=self.b64_encoded_custos_token,
                                                    username=user,
                                                    group_id=group_id,
                                                    membership_type='Member'
                                                    )
            resp = MessageToJson(val)
            print(resp)
            temp = Groups_Json()
            temp.write_groups(group, user)
            temp.save_json()
            del temp
            return 1
        except Exception as e:
            print(e)
            print("User allocation error")
            return 0
    
    def get_all_users_of_group(self, group):
        temp = Groups_Json()
        print(temp.read_groups()[group])
        del temp
        # print(self.group_management_client.group_stub.getAllChildUsers)
        pass

    def test(self):
        print("I am still alive!!!")

@app.route('/register',methods = ['POST', 'GET'])
def register_user():
    #This doesnt work 
#     sample=[{
#      "username": "hfgh",
#     "first_name": "Ajhgg",
#     "last_name": "Aron",
#     "password": "12345678",
#     "email": "kpy12@gmail.com"
# }]

    # This works
    # sample={
    #  "username": "hfgh",
    # "first_name": "Ajhgg",
    # "last_name": "Aron",
    # "password": "12345678",
    # "email": "kpy12@gmail.com"
    # }

    #This also works 
    # sample={
    #  'username': 'Ramya',
    # 'first_name': 'Ajhgg',
    # 'last_name': 'Aron',
    # 'password': '12345678',
    # 'email': 'raghdfgdgu@gmail.com'
    # }

    try:  
        # print("Sample data",sample)
        orion.register_users(request.json)
    except Exception:
        print("please defined method register_users")






@app.route("/create_group")
def create_groups(group):
    group={
        'name': 'Admin',
        'description': 'Group for gateway read only admins',
    },
    try:  
        orion.create_group(group)
    except Exception as e:
        print(e)
        print("please defined method create_groups")


@app.route("/test")
def hello():
    return "I am alive!!!"

@app.route("/")
def index():
    # main()
    global orion
    orion.test()
    groups = orion.get_all_groups()
    return render_template('index.html')

def test_end_point():
    url = "https://dev.portal.usecustos.org/group-management/v1.0.0/groups"

    payload={}
    headers = {
    'Authorization': 'Basic base64(\'custos-rswfydI920pg7kuvmayc-10003419:zGDFZJpx40E0OT5EIS6WL1PZK2hHtiOs2aYFyR1y\');'
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    print(response.text) 

# def 

def init():
    global orion
    orion = Orion()

if __name__ == "__main__":
    # main()
    init()
    app.run()