from flask import Blueprint, jsonify, request

from firebase_admin import auth

from firebase.firebase_config import get_firestore

from services.profile_service import (
    get_profile,
    create_profile,
    update_profile,
    update_master_status,
)


profile_bp = Blueprint(
    "profile",
    __name__,
    url_prefix="/api/profile"
)


def authenticate():
    authorization = request.headers.get(
        "Authorization"
    )

    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.replace(
        "Bearer ",
        "",
        1
    )

    try:
        return auth.verify_id_token(token)

    except Exception as error:
        print("Erro ao validar Firebase Token:")
        print(error)

        return None


@profile_bp.route("", methods=["GET"])
def get_my_profile():

    user = authenticate()

    if not user:
        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:
        db = get_firestore()

        profile = get_profile(
            db,
            user["uid"],
            user
        )

        return jsonify({
            "profile": profile
        }), 200

    except Exception as error:

        print("ERRO AO BUSCAR PERFIL:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@profile_bp.route("", methods=["PUT"])
def edit_my_profile():

    user = authenticate()

    if not user:
        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:
        data = (
            request.get_json(silent=True)
            or {}
        )

        db = get_firestore()

        profile = update_profile(
            db,
            user["uid"],
            data
        )

        return jsonify({
            "profile": profile
        }), 200

    except Exception as error:

        print("ERRO AO ATUALIZAR PERFIL:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@profile_bp.route("/master", methods=["PUT"])
def edit_master_status():

    user = authenticate()

    if not user:
        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:
        data = (
            request.get_json(silent=True)
            or {}
        )

        is_master = data.get(
            "isMaster",
            False
        )

        db = get_firestore()

        profile = update_master_status(
            db,
            user["uid"],
            is_master
        )

        return jsonify({
            "profile": profile
        }), 200

    except Exception as error:

        print("ERRO AO ALTERAR MODO MESTRE:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500