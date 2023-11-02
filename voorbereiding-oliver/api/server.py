"""Python Flask API Auth0 integration example
"""

# from os import environ as env

# from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
from authlib.integrations.flask_oauth2 import ResourceProtector
from validator import Auth0JWTBearerTokenValidator
from flask_cors import CORS
import jwt
from functools import wraps
import base64
import sys



require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "labs-part1-oliverae.eu.auth0.com",
    "https://notes"
)
require_auth.register_token_validator(validator)

APP = Flask(__name__)
CORS(APP)

@APP.route("/api/public")
def public():
    """No access token required."""
    response = (
        "Hello from a public endpoint! You don't need to be"
        " authenticated to see this."
    )
    return jsonify(message=response)


@APP.route("/api/private")
@require_auth(None)
def private():
    """A valid access token is required."""
    response = (
        "WORKING! Hello from a private endpoint! You need to be"
        " authenticated to see this."
    )
    return jsonify(message=response)


@APP.route("/api/private-scoped")
# @require_auth("read:current_user")
def private_scoped():
    """A valid access token and scope are required."""
    response = (
        "WORKING! Hello from a private endpoint! You need to be"
        " authenticated and have a scope of read:messages to see"
        " this."
    )
    return jsonify(message=response)


# Middleware to check JWT and user authorization
def authorize_user(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        # print(token)

        if not token:
            return "Unauthorized", 401

        try:
            val = validator.authenticate_token(token)
            print(val, file=sys.stderr)
            # if sub_claim != kwargs['user_id']:
                # return "Access denied", 403
        except Exception as e:
            print(e)
            return "Access denied", 500


        return func(*args, **kwargs)

    return wrapper


@APP.route('/api/sensitive-data/<user_id>')
@require_auth(None)
@authorize_user
def get_sensitive_data(user_id):
    # print(request.__dict__,  file=sys.stderr)

    notes = [
        {'id': 1, 'text': 'Note 1'},
        {'id': 2, 'text': 'Note 2'},
    ]
    # Retrieve and return sensitive data for the authorized user
    # Your logic to fetch data based on user_id goes here
    return jsonify(notes)


if __name__ == "__main__":
    APP.run()