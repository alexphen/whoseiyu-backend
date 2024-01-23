import sys
# import requests

print("passed")

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
    print (sys.argv)
    CLIENT_ID = sys.argv[1]
    CLIENT_SECRET = sys.argv[2]
    authorisation_code = sys.argv[3]
    code_verifier = sys.argv[4]
    token = generate_new_token(authorisation_code, code_verifier)
    print(token)

    # print_user_info(token['access_token'])

