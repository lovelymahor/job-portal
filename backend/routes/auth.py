from flask import Blueprint, request, jsonify

import bcrypt

from utils.db import mysql

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)

auth = Blueprint("auth", __name__)


# =========================
# REGISTER
# =========================
@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Default role
    role = data.get("role", "candidate")

    # =========================
    # VALIDATION
    # =========================
    if not name or not email or not password:

        return jsonify({
            "message": "All fields are required"
        }), 400

    # =========================
    # ALLOW ONLY:
    # candidate
    # recruiter
    # =========================
    if role not in ["candidate", "recruiter"]:

        return jsonify({
            "message": "Invalid role selected"
        }), 400

    cursor = mysql.connection.cursor()

    # =========================
    # CHECK EXISTING USER
    # =========================
    cursor.execute(
        """
        SELECT * FROM users
        WHERE email = %s
        """,
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:

        cursor.close()

        return jsonify({
            "message": "Email already registered"
        }), 400

    # =========================
    # HASH PASSWORD
    # =========================
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    # =========================
    # INSERT USER
    # =========================
    query = """
        INSERT INTO users
        (
            name,
            email,
            password,
            role
        )
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(
        query,
        (
            name,
            email,
            hashed_password.decode("utf-8"),
            role
        )
    )

    mysql.connection.commit()

    cursor.close()

    return jsonify({
        "message": "User registered successfully"
    }), 201


# =========================
# LOGIN
# =========================
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # =========================
    # VALIDATION
    # =========================
    if not email or not password:

        return jsonify({
            "message": "Email and password are required"
        }), 400

    cursor = mysql.connection.cursor()

    query = """
        SELECT * FROM users
        WHERE email = %s
    """

    cursor.execute(query, (email,))

    user = cursor.fetchone()

    cursor.close()

    # =========================
    # USER NOT FOUND
    # =========================
    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    stored_password = user[3]

    # =========================
    # CHECK PASSWORD
    # =========================
    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        stored_password.encode("utf-8")
    )

    if not password_match:

        return jsonify({
            "message": "Invalid password"
        }), 401

    # =========================
    # USER ROLE
    # =========================
    user_role = user[4]

    # =========================
    # GENERATE JWT TOKEN
    # =========================
    access_token = create_access_token(
        identity=email,
        additional_claims={
            "role": user_role
        }
    )

    # =========================
    # SUCCESS RESPONSE
    # =========================
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "role": user_role,
        "email": email
    }), 200


# =========================
# PROFILE
# =========================
@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    current_user = get_jwt_identity()

    claims = get_jwt()

    return jsonify({
        "message": "Protected route accessed successfully",
        "logged_in_as": {
            "email": current_user,
            "role": claims["role"]
        }
    }), 200