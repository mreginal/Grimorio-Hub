from datetime import datetime, timezone


def serialize_character(
    doc_id,
    data
):

    return {
        "id": doc_id,

        "userId": data.get("userId", ""),

        "nome": data.get("nome", ""),
        "jogador": data.get("jogador", ""),

        "origem": data.get("origem", ""),
        "classe": data.get("classe", ""),

        "nex": data.get("nex", 5),
        "patente": data.get("patente", "Recruta"),

        "atributos": data.get(
            "atributos",
            {}
        ),

        "pericias": data.get(
            "pericias",
            {}
        ),

        "saude": data.get(
            "saude",
            {}
        ),

        "defesas": data.get(
            "defesas",
            {}
        ),

        "resistencias": data.get(
            "resistencias",
            {}
        ),

        "armas": data.get(
            "armas",
            []
        ),

        "habilidades": data.get(
            "habilidades",
            []
        ),

        "inventario": data.get(
            "inventario",
            []
        ),

        "descricao": data.get(
            "descricao",
            ""
        ),

        "historia": data.get(
            "historia",
            ""
        ),

        "imagemUrl": data.get(
            "imagemUrl",
            ""
        ),

        "createdAt": data.get(
            "createdAt"
        ),

        "updatedAt": data.get(
            "updatedAt"
        ),
    }


# =====================================================
# LISTAR
# =====================================================

def get_characters(
    db,
    user_id
):

    docs = (
        db
        .collection("characters")
        .where(
            "userId",
            "==",
            user_id
        )
        .stream()
    )

    characters = []

    for doc in docs:

        data = doc.to_dict()

        characters.append(
            serialize_character(
                doc.id,
                data
            )
        )

    return characters


# =====================================================
# BUSCAR UM
# =====================================================

def get_character(
    db,
    user_id,
    character_id
):

    doc = (
        db
        .collection("characters")
        .document(character_id)
        .get()
    )

    if not doc.exists:
        return None

    data = doc.to_dict()

    if data.get("userId") != user_id:
        return None

    return serialize_character(
        doc.id,
        data
    )


# =====================================================
# CRIAR
# =====================================================

def create_character(
    db,
    user_id,
    data
):

    now = datetime.now(
        timezone.utc
    ).isoformat()

    character_data = {
        **data,

        "userId": user_id,

        "createdAt": now,
        "updatedAt": now,
    }

    doc_ref = (
        db
        .collection("characters")
        .document()
    )

    doc_ref.set(
        character_data
    )

    return serialize_character(
        doc_ref.id,
        character_data
    )


# =====================================================
# ATUALIZAR
# =====================================================

def update_character(
    db,
    user_id,
    character_id,
    data
):

    doc_ref = (
        db
        .collection("characters")
        .document(character_id)
    )

    doc = doc_ref.get()

    if not doc.exists:
        return None

    current = doc.to_dict()

    if current.get("userId") != user_id:
        return None

    now = datetime.now(
        timezone.utc
    ).isoformat()

    updated_data = {
        **data,

        "userId": user_id,

        "createdAt":
            current.get("createdAt"),

        "updatedAt": now,
    }

    doc_ref.set(
        updated_data
    )

    return serialize_character(
        character_id,
        updated_data
    )


# =====================================================
# DELETE
# =====================================================

def delete_character(
    db,
    user_id,
    character_id
):

    doc_ref = (
        db
        .collection("characters")
        .document(character_id)
    )

    doc = doc_ref.get()

    if not doc.exists:
        return False

    data = doc.to_dict()

    if data.get("userId") != user_id:
        return False

    doc_ref.delete()

    return True