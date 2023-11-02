import http.client
import json

def get_access_token():
    conn = http.client.HTTPSConnection("auth0challenge-ae.eu.auth0.com")
    payload = "{\"client_id\":\"VWxcPnQcqxeZ4oKk48xtGd7AxGO9hjNL\",\"client_secret\":\"JJr-_xcWOiyI1o22WKTMcMUqgEVpsfobW3NMY7SSmuXcarhU245h8x7VsUl8CC2_\",\"audience\":\"http://127.0.0.1:5000/\",\"grant_type\":\"client_credentials\",\"scope\":\"read:messages\"}"
    headers = { 'content-type': "application/json" }
    conn.request("POST", "/oauth/token", payload, headers)
    res = conn.getresponse()
    data = res.read()

    return json.loads(data.decode("utf-8"))

def send_token_to_api():
    conn = http.client.HTTPConnection("127.0.0.1", 5000)
    headers = { 'authorization': "Bearer " + get_access_token()["access_token"] }
    conn.request("GET", "/api/private-scoped", headers=headers)
    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))

print(get_access_token())