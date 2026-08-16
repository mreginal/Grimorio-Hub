from datetime import datetime, timezone


def serialize_datetime(value):
    if value is None:
        return None

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return value


def get_profile(db, uid, auth_user=None):
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if user_doc.exists:
        data = user_doc.to_dict()
    else:
        data = {}

    auth_name = ""

    if auth_user:
        auth_name = (
            auth_user.get("name")
            or auth_user.get("display_name")
            or ""
        )

    auth_email = ""

    if auth_user:
        auth_email = (
            auth_user.get("email")
            or ""
        )

    auth_avatar = ""

    if auth_user:
        auth_avatar = (
            auth_user.get("picture")
            or ""
        )

    name = (
        data.get("name")
        or auth_name
        or "Aventureiro"
    )

    email = (
        data.get("email")
        or auth_email
        or ""
    )

    avatar = (
        data.get("avatar")
        or auth_avatar
        or ""
    )

    if (not user_doc.exists or not data.get("name") or not data.get("email")):
        user_ref.set(
            {
                "name": name,
                "email": email,
                "avatar": avatar,
            },
            merge=True
        )

    characters_ref = user_ref.collection(
        "characters"
    )

    characters = list(
        characters_ref.stream()
    )

    characters_count = len(characters)

    parties_created = data.get(
        "partiesCreated",
        0
    )

    parties_joined = data.get(
        "partiesJoined",
        0
    )

    return {
        "uid": uid,
        "name": name,
        "email": email,
        "bio": data.get(
            "bio",
            "Ainda não adicionou uma biografia."
        ),
        "avatar": avatar,
        "isMaster": data.get(
            "isMaster",
            False
        ),
        "charactersCount": characters_count,
        "partiesCreated": parties_created,
        "partiesJoined": parties_joined,
    }

def create_profile(db, uid, data):
    user_ref = db.collection("users").document(uid)

    now = datetime.now(timezone.utc)

    profile = {
        "name": data.get("name", "Aventureiro"),
        "email": data.get("email", ""),
        "bio": data.get(
            "bio",
            "Ainda não adicionou uma biografia."
        ),
        "avatar": data.get("avatar", ""),
        "isMaster": data.get("isMaster", False),
        "partiesCreated": 0,
        "partiesJoined": 0,
        "createdAt": now,
        "updatedAt": now,
    }

    user_ref.set(profile, merge=True)

    return get_profile(db, uid)


def update_profile(db, uid, data):
    user_ref = db.collection("users").document(uid)

    update_data = {
        "updatedAt": datetime.now(timezone.utc)
    }

    allowed_fields = [
        "name",
        "bio",
        "avatar",
        "isMaster",
    ]

    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]

    user_ref.set(
        update_data,
        merge=True
    )

    return get_profile(db, uid)


def update_master_status(db, uid, is_master):
    user_ref = db.collection("users").document(uid)

    user_ref.set(
        {
            "isMaster": bool(is_master),
            "updatedAt": datetime.now(timezone.utc),
        },
        merge=True
    )

    return get_profile(db, uid)