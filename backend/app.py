import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_URL", "http://localhost:5173")}})

service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
if os.path.exists(service_account) and not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(service_account))

def require_firebase_user():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None, ("Token ausente.", 401)

    token = header.removeprefix("Bearer ").strip()
    try:
        decoded = auth.verify_id_token(token)
        return decoded, None
    except Exception:
        return None, ("Token inválido ou expirado.", 401)

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "rpg-hub-api"})

@app.post("/api/users/me")
def sync_user():
    decoded, error = require_firebase_user()
    if error:
        return jsonify({"error": error[0]}), error[1]

    body = request.get_json(silent=True) or {}
    return jsonify({
        "uid": decoded["uid"],
        "email": decoded.get("email"),
        "displayName": body.get("displayName") or decoded.get("name") or "",
        "canBeMaster": True,
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=True,
    )