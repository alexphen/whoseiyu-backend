import secrets
import sys
import requests
import os
# from decouple import config
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv('MAL_CLIENT_ID')
CLIENT_SECRET = os.getenv('MAL_CLIENT_SECRET')

# 3. Once you've authorised your application, you will be redirected to the webpage you've
#    specified in the API panel. The URL will contain a parameter named "code" (the Authorisation
#    Code). You need to feed that code to the application.
def generate_new_token(authorisation_code: str, code_verifier: str) -> dict:
    global CLIENT_ID, CLIENT_SECRET

    url = 'https://myanimelist.net/v1/oauth2/token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': authorisation_code,
        'code_verifier': code_verifier,
        'grant_type': 'authorization_code'
    }
 
    # print(data)
    response = requests.post(url, data)
    # print(response)
    response.raise_for_status()  # Check whether the request contains errors
    token = response.json()
    
    response.close()

    # with open('token.json', 'w') as file:
    #     json.dump(token, file, indent = 4)
    #     print('Token saved in "token.json"')

    return token


# 4. Test the API by requesting your profile information
def print_user_info(access_token: str):
    url = 'https://api.myanimelist.net/v2/users/@me'
    response = requests.get(url, headers = {
        'Authorization': f'Bearer {access_token}'
        })
    # print(response)
    response.raise_for_status()
    user = response.json()
    response.close()

    print(f"\n>>> Greetings {user['name']}! <<<")


if __name__ == '__main__':
    authorisation_code = sys.argv[1]
    # authorisation_code = 'def502000ecd3c49dfe157e09eb6619cb31bd8b05634a0430847d252379e3b13c6a1b7becab2d274d6a6ee6c03aa3482eb3c051ff9d90512cda64edd3af35dc9221e348ef54667b1b4dc815ce98881d3355706c9459e418fd83b1054a9f8540b261ccb7b9308b82fd576208f0462c4b7015d2a0f94d248cc6c3921a6debcc03f135dfcaab8f09ea96a80f9ccbdce3b5fe018604ee6b92f63ba18e6359aafbf1f833d05e857ffe5b31cd9213ad8462186420e74018b621acaa0a8a1d5800c38407c60c95244f8884cf59a7ce406cd6d6c7464542141b3f8dbe2d3f6b02ca72fe15b66ede5632efa9f91dcc8788ed23ad2d11d64979252418dad6ab773edbbbe9b062021065390e072f7dbe77b97b26aeb92a9cd75c663184e6a2235bb680b1e9f6a52afb8453ec1e0619dd8a0e6ae8b469f99e8431ae49339c8fdded9ec627280ba631a3b3227af19fbf6fb95820b98b458166159083d58868a470066f6aae9fe77fd04c44ecc071f8896f6083646aa941a5ef63f79ba7856ce7d83072c9a6173deba72f882d19d28fcb5c1dc7b6a6eafce8affb6505cb2599ef1f27defac14d31d31fd562fde1dc0a5f3e95fe01392e2136d259b87845ef0d4ca1c0fd26385deb98cd0bfda58aeedec33bfa78216d2af42a899c98135758b70fd3072429b8e70d4a4b0a1f3f09e8f60c8'
    code_verifier = sys.argv[2]
    # code_verifier = 'bdiZHFwkW0qGHWIkuJStX_yH4_hyEx0v8O-c47oMpL9xjF3buj_0UY4T6svzaoYXgrYKHlVkqxeQ9K2j8-otzlXN_s7qYunswDyzBbL0Usyn4JJzvIupzhxqmyMVUEwY'
    token = generate_new_token(authorisation_code, code_verifier)
    print(token)

    # print_user_info(token['access_token'])

