from datetime import datetime, timezone

from firebase_admin import firestore


def characters_collection(db, uid):

    return (
        db
        .collection("users")
        .document(uid)
        .collection("characters")
    )


def serialize_character(document):

    data = document.to_dict()

    data["id"] = document.id

    for field in [
        "createdAt",
        "updatedAt",
    ]:

        if hasattr(
            data.get(field),
            "isoformat"
        ):

            data[field] = (
                data[field]
                .isoformat()
            )

    return data


def get_characters(db, uid):

    documents = (
        characters_collection(
            db,
            uid
        )
        .stream()
    )

    characters = [
        serialize_character(document)
        for document in documents
    ]

    characters.sort(
        key=lambda character:
        character.get(
            "updatedAt",
            ""
        ),
        reverse=True
    )

    return characters


def get_character(
    db,
    uid,
    character_id
):

    document = (
        characters_collection(
            db,
            uid
        )
        .document(character_id)
        .get()
    )

    if not document.exists:
        return None

    return serialize_character(
        document
    )


def create_character(
    db,
    uid,
    data
):

    now = datetime.now(
        timezone.utc
    )

    data["createdAt"] = now
    data["updatedAt"] = now

    reference = (
        characters_collection(
            db,
            uid
        )
        .document()
    )

    reference.set(data)

    return serialize_character(
        reference.get()
    )


def update_character(
    db,
    uid,
    character_id,
    data
):

    reference = (
        characters_collection(
            db,
            uid
        )
        .document(character_id)
    )

    document = reference.get()

    if not document.exists:
        return None

    data["updatedAt"] = (
        datetime.now(
            timezone.utc
        )
    )

    reference.update(data)

    return serialize_character(
        reference.get()
    )


def delete_character(
    db,
    uid,
    character_id
):

    reference = (
        characters_collection(
            db,
            uid
        )
        .document(character_id)
    )

    document = reference.get()

    if not document.exists:
        return False

    reference.delete()

    return True