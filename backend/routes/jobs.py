from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from utils.db import mysql

jobs = Blueprint("jobs", __name__)


# =========================
# CREATE JOB (Recruiter Only)
# =========================
@jobs.route("/create-job", methods=["POST"])
@jwt_required()
def create_job():

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Access denied. Recruiter only."}), 403

    data = request.get_json()

    title = data.get("title")
    company = data.get("company")
    location = data.get("location")
    description = data.get("description")
    salary = data.get("salary")

    if not title or not company or not location or not salary:
        return jsonify({
            "message": "Title, company, location and salary are required"
        }), 400

    cursor = mysql.connection.cursor()

    query = """
        INSERT INTO jobs
        (title, company, location, description, salary, recruiter_email)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        title,
        company,
        location,
        description,
        salary,
        current_user
    ))

    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Job created successfully"}), 201


# =========================
# GET ALL JOBS
# =========================
@jobs.route("/all-jobs", methods=["GET"])
def get_all_jobs():

    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT * FROM jobs
        ORDER BY id DESC
    """)

    all_jobs = cursor.fetchall()
    cursor.close()

    jobs_list = []

    for job in all_jobs:
        jobs_list.append({
            "id": job[0],
            "title": job[1],
            "company": job[2],
            "location": job[3],
            "description": job[4],
            "salary": job[5],
            "recruiter_email": job[6]
        })

    return jsonify(jobs_list), 200


# =========================
# GET SINGLE JOB (FIXED + FRONTEND FRIENDLY)
# =========================

# 🔥 IMPORTANT: KEEP BOTH ROUTES FOR SAFETY
@jobs.route("/job/<int:job_id>", methods=["GET"])
@jobs.route("/jobs/<int:job_id>", methods=["GET"])
def get_single_job(job_id):

    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT * FROM jobs
        WHERE id = %s
    """, (job_id,))

    job = cursor.fetchone()
    cursor.close()

    if not job:
        return jsonify({"message": "Job not found"}), 404

    job_data = {
        "id": job[0],
        "title": job[1],
        "company": job[2],
        "location": job[3],
        "description": job[4],
        "salary": job[5],
        "recruiter_email": job[6]
    }

    return jsonify(job_data), 200


# =========================
# UPDATE JOB (Recruiter Only)
# =========================
@jobs.route("/update-job/<int:job_id>", methods=["PUT"])
@jwt_required()
def update_job(job_id):

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Access denied. Recruiter only."}), 403

    data = request.get_json()

    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM jobs WHERE id=%s", (job_id,))
    job = cursor.fetchone()

    if not job:
        cursor.close()
        return jsonify({"message": "Job not found"}), 404

    if job[6] != current_user:
        cursor.close()
        return jsonify({"message": "Unauthorized"}), 403

    cursor.execute("""
        UPDATE jobs
        SET title=%s, company=%s, location=%s, salary=%s, description=%s
        WHERE id=%s
    """, (
        data.get("title"),
        data.get("company"),
        data.get("location"),
        data.get("salary"),
        data.get("description"),
        job_id
    ))

    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Job updated successfully"}), 200


# =========================
# DELETE JOB (Recruiter Only)
# =========================
@jobs.route("/delete-job/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Access denied. Recruiter only."}), 403

    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM jobs WHERE id=%s", (job_id,))
    job = cursor.fetchone()

    if not job:
        cursor.close()
        return jsonify({"message": "Job not found"}), 404

    if job[6] != current_user:
        cursor.close()
        return jsonify({"message": "Unauthorized"}), 403

    cursor.execute("DELETE FROM jobs WHERE id=%s", (job_id,))

    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Job deleted successfully"}), 200


# =========================
# MY JOBS (Recruiter Only)
# =========================
@jobs.route("/my-jobs", methods=["GET"])
@jwt_required()
def my_jobs():

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Access denied. Recruiter only."}), 403

    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT * FROM jobs
        WHERE recruiter_email = %s
        ORDER BY id DESC
    """, (current_user,))

    jobs_data = cursor.fetchall()
    cursor.close()

    jobs_list = []

    for job in jobs_data:
        jobs_list.append({
            "id": job[0],
            "title": job[1],
            "company": job[2],
            "location": job[3],
            "description": job[4],
            "salary": job[5],
            "recruiter_email": job[6]
        })

    return jsonify(jobs_list), 200