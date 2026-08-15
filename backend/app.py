from flask import Flask
from flask_cors import CORS

from firebase.firebase_config import initialize_firebase
from routes.character_routes import character_bp


app = Flask(__name__)


# Inicializa o Firebase Admin
initialize_firebase()


# CORS
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    },
    methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allow_headers=[
        "Content-Type",
        "Authorization"
    ]
)


# Rotas
app.register_blueprint(character_bp)


@app.route("/api/health", methods=["GET"])
def health():

    return {
        "status": "ok"
    }


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )