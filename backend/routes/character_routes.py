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


# =====================================================
# AUTENTICAÇÃO
# =====================================================

def authenticate():

    authorization = request.headers.get("Authorization")

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


# =====================================================
# GET /api/characters
# =====================================================

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

        return jsonify(characters), 200

    except Exception as error:

        print("ERRO AO BUSCAR PERSONAGENS:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


# =====================================================
# GET /api/characters/<id>
# =====================================================

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
                "error": "Personagem não encontrado."
            }), 404

        return jsonify(character), 200

    except Exception as error:

        print("ERRO AO BUSCAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


# =====================================================
# POST /api/characters
# =====================================================

@character_bp.route(
    "",
    methods=["POST", "OPTIONS"]
)
def add_character():

    if request.method == "OPTIONS":
        return "", 204

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

        print("\n==============================")
        print("PERSONAGEM RECEBIDO")
        print("==============================")
        print(data)
        print("==============================\n")

        # IMPORTANTE:
        # O frontend usa "nome"
        if not data.get("nome"):

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

        print("\nPERSONAGEM CRIADO:")
        print(character)

        return jsonify(character), 201

    except Exception as error:

        print("ERRO AO CRIAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


# =====================================================
# PUT /api/characters/<id>
# =====================================================

@character_bp.route(
    "/<character_id>",
    methods=["PUT", "OPTIONS"]
)
def edit_character(character_id):

    if request.method == "OPTIONS":
        return "", 204

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

        print("\n==============================")
        print("ATUALIZAÇÃO DE PERSONAGEM")
        print("==============================")
        print("ID:", character_id)
        print("DATA:", data)
        print("==============================\n")

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

        return jsonify(character), 200

    except Exception as error:

        print("ERRO AO EDITAR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500


# =====================================================
# DELETE /api/characters/<id>
# =====================================================

@character_bp.route(
    "/<character_id>",
    methods=["DELETE", "OPTIONS"]
)
def remove_character(character_id):

    if request.method == "OPTIONS":
        return "", 204

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
        }), 200

    except Exception as error:

        print("ERRO AO EXCLUIR PERSONAGEM:")
        print(error)

        return jsonify({
            "error": str(error)
        }), 500