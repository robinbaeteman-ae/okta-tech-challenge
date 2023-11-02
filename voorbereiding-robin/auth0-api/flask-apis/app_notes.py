# Notes app
from collections import defaultdict
import json
from six.moves.urllib.request import urlopen
from functools import wraps

from flask import Flask, request, jsonify, _request_ctx_stack
from flask_cors import cross_origin
from jose import jwt

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "{yourDomain}",
    "{yourApiIdentifier}"
)
require_auth.register_token_validator(validator)

app = Flask(__name__)

model = defaultdict(lambda: []) # Every user starts with an empty list of notes

@app.get('/notes/<int:id>')
@require_auth("read:notes")
def get_notes(id):
    return model[id], 200

@app.post('/notes/<int:id>')
@require_auth("create:note")
def create_note(id):
    request_data = request.get_json()
    new_note = {"title": request_data["title"], "text": request_data["text"], "id": len(model.keys())}
    model[id].append(new_note)
    return new_note, 201

@app.delete('/notes/<int:id>/<int:note_id>')
@require_auth("delete:note")
def delete_note(id, note_id):
    del model[id][note_id]
    return {"success": "note successfully deleted from the server"}, 200


# Nu moeten we aan de hand van Auth0 zorgen dat een gebruiker alleen aan zijn
# eigen notities kan!!!!!