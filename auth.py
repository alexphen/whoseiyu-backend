import secrets
import os
# from decouple import config
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv('MAL_CLIENT_ID')
CLIENT_SECRET = os.getenv('MAL_CLIENT_SECRET')

print(CLIENT_SECRET)

# 1. Generate a new Code Verifier / Code Challenge.
def get_new_code_verifier() -> str:
    token = secrets.token_urlsafe(100)
    return token[:128]


# 2. Print the URL needed to authorise your application.
def print_new_authorisation_url(code_challenge: str):
    global CLIENT_ID

    url = f'https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id={CLIENT_ID}&code_challenge={code_challenge}'
    print(f'{url}', code_challenge)


if __name__ == '__main__':
    code_verifier = code_challenge = get_new_code_verifier()
    print_new_authorisation_url(code_challenge)


