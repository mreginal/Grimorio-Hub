from flask import Blueprint, jsonify, request

from firebase_admin import auth

from firebase.firebase_config import get_firestore

from services.character_service import (
    get_characters,
    get_character,
    create_character,
    update_character,
    delete_character,
)


character_bp = Blueprint(
    "characters",
    __name__,
    url_prefix="/api/characters"
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


@character_bp.route(
    "",
    methods=["GET", "OPTIONS"]
)
def list_characters():

    if request.method == "OPTIONS":
        return "", 204

    user = authenticate()

    if not user:

        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:

        db = get_firestore()

        characters = get_characters(
            db,
            user["uid"]
        )

        return jsonify({
            "characters": characters
        })

    except Exception as error:

        print("ERRO AO BUSCAR PERSONAGENS:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@character_bp.route(
    "/<character_id>",
    methods=["GET"]
)
def find_character(character_id):

    user = authenticate()

    if not user:

        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:

        db = get_firestore()

        character = get_character(
            db,
            user["uid"],
            character_id
        )

        if not character:

            return jsonify({
                "error":
                    "Personagem não encontrado."
            }), 404

        return jsonify({
            "character": character
        })

    except Exception as error:

        print("ERRO AO BUSCAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@character_bp.route(
    "",
    methods=["POST"]
)
def add_character():

    user = authenticate()

    if not user:

        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:

        data = (
            request
            .get_json(silent=True)
            or {}
        )

        if not data.get("name"):

            return jsonify({
                "error":
                    "Nome do personagem é obrigatório."
            }), 400

        db = get_firestore()

        character = create_character(
            db,
            user["uid"],
            data
        )

        return jsonify({
            "character": character
        }), 201

    except Exception as error:

        print("ERRO AO CRIAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@character_bp.route(
    "/<character_id>",
    methods=["PUT"]
)
def edit_character(character_id):

    user = authenticate()

    if not user:

        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:

        data = (
            request
            .get_json(silent=True)
            or {}
        )

        db = get_firestore()

        character = update_character(
            db,
            user["uid"],
            character_id,
            data
        )

        if not character:

            return jsonify({
                "error":
                    "Personagem não encontrado."
            }), 404

        return jsonify({
            "character": character
        })

    except Exception as error:

        print("ERRO AO EDITAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


@character_bp.route(
    "/<character_id>",
    methods=["DELETE"]
)
def remove_character(character_id):

    user = authenticate()

    if not user:

        return jsonify({
            "error": "Não autenticado."
        }), 401

    try:

        db = get_firestore()

        deleted = delete_character(
            db,
            user["uid"],
            character_id
        )

        if not deleted:

            return jsonify({
                "error":
                    "Personagem não encontrado."
            }), 404

        return jsonify({
            "message":
                "Personagem excluído."
        })

    except Exception as error:

        print("ERRO AO EXCLUIR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500