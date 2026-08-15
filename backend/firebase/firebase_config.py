import os

import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore


def initialize_firebase():

    if firebase_admin._apps:
        return

    credentials_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT",
        "serviceAccountKey.json"
    )

    print(
        "Firebase Service Account:",
        credentials_path
    )

    if not os.path.exists(credentials_path):

        raise FileNotFoundError(
            f"Service Account não encontrada: "
            f"{credentials_path}"
        )

    credential = credentials.Certificate(
        credentials_path
    )

    firebase_admin.initialize_app(
        credential
    )


def get_firestore():

    initialize_firebase()

    return firestore.client()