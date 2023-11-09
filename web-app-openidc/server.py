import json
from os import environ as env
from urllib.parse import quote_plus, urlencode

from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request
import base64
import xmltodict

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

oauth = OAuth(app)

@app.route("/login")
def login():
    return redirect("https://challenge-ae.eu.auth0.com/samlp/q6IZ6LE78TPhkMW9xwjwYTtWhSGKSpoc")


@app.route("/callback", methods=["GET", "POST"])
def callback():
    # decode, parse and reformat SAML token
    SAMLtoken = request.form.get('SAMLResponse')
    decoded = base64.b64decode(SAMLtoken)
    userinfodict = xmltodict.parse(decoded)["samlp:Response"]["saml:Assertion"]["saml:AttributeStatement"]["saml:Attribute"]
    userinfodict_new = {item['@Name'].split("/")[-1]:item["saml:AttributeValue"]["#text"] for item in userinfodict}
    session["user"] = userinfodict_new
    return redirect("/")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

@app.route("/")
def home():
    return render_template("home.html", session=session.get('user'), pretty=json.dumps(session.get('user'), indent=4))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=env.get("PORT", 3001))