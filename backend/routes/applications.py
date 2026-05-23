from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from utils.db import mysql
from utils.s3 import upload_file_to_s3

# OPTIONAL: email service (you can add later)
# from utils.email_service import send_email

applications = Blueprint("applications", __name__)


# =========================
# APPLY FOR JOB (CANDIDATE ONLY)
# =========================
@applications.route("/apply-job", methods=["POST"])
@jwt_required()
def apply_job():

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "candidate":
        return jsonify({"message": "Only candidates can apply for jobs"}), 403

    job_id = request.form.get("job_id")

    if not job_id:
        return jsonify({"message": "Job ID is required"}), 400

    if "resume" not in request.files:
        return jsonify({"message": "Resume PDF is required"}), 400

    resume_file = request.files["resume"]

    if resume_file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    if not resume_file.filename.lower().endswith(".pdf"):
        return jsonify({"message": "Only PDF files are allowed"}), 400

    cursor = mysql.connection.cursor()

    try:
        # CHECK JOB EXISTS
        cursor.execute(
            "SELECT id FROM jobs WHERE id = %s",
            (job_id,)
        )

        if not cursor.fetchone():
            return jsonify({"message": "Job not found"}), 404

        # DUPLICATE CHECK
        cursor.execute(
            """
            SELECT id FROM applications
            WHERE job_id = %s AND applicant_email = %s
            """,
            (job_id, current_user)
        )

        if cursor.fetchone():
            return jsonify({"message": "Already applied"}), 400

        # UPLOAD RESUME
        resume_url, error = upload_file_to_s3(resume_file)

        if error:
            return jsonify({"message": error}), 500

        # INSERT
        cursor.execute(
            """
            INSERT INTO applications
            (job_id, applicant_email, resume_link, status)
            VALUES (%s, %s, %s, %s)
            """,
            (job_id, current_user, resume_url, "Applied")
        )

        mysql.connection.commit()

        return jsonify({
            "message": "Job applied successfully",
            "resume_url": resume_url
        }), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"message": "Server error", "error": str(e)}), 500

    finally:
        cursor.close()


# =========================
# MY APPLICATIONS (CANDIDATE)
# =========================
@applications.route("/my-applications", methods=["GET"])
@jwt_required()
def my_applications():

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "candidate":
        return jsonify({"message": "Unauthorized"}), 403

    cursor = mysql.connection.cursor()

    try:
        cursor.execute("""
            SELECT
                a.id,
                j.title,
                j.company,
                j.location,
                a.status,
                a.applied_at
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.applicant_email = %s
            ORDER BY a.applied_at DESC
        """, (current_user,))

        data = cursor.fetchall()

        result = [
            {
                "application_id": row[0],
                "job_title": row[1],
                "company": row[2],
                "location": row[3],
                "status": row[4],
                "applied_at": str(row[5])
            }
            for row in data
        ]

        return jsonify(result), 200

    finally:
        cursor.close()


# =========================
# JOB APPLICANTS (RECRUITER)
# =========================
@applications.route("/job-applicants/<int:job_id>", methods=["GET"])
@jwt_required()
def job_applicants(job_id):

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Unauthorized"}), 403

    cursor = mysql.connection.cursor()

    try:
        cursor.execute(
            "SELECT id, title, recruiter_email FROM jobs WHERE id=%s",
            (job_id,)
        )

        job = cursor.fetchone()

        if not job:
            return jsonify({"message": "Job not found"}), 404

        if job[2] != current_user:
            return jsonify({"message": "Not your job"}), 403

        cursor.execute("""
            SELECT id, applicant_email, resume_link, status, applied_at
            FROM applications
            WHERE job_id=%s
            ORDER BY applied_at DESC
        """, (job_id,))

        applicants = cursor.fetchall()

        return jsonify({
            "job_id": job[0],
            "job_title": job[1],
            "total_applicants": len(applicants),
            "applicants": [
                {
                    "application_id": a[0],
                    "applicant_email": a[1],
                    "resume_link": a[2],
                    "status": a[3],
                    "applied_at": str(a[4])
                }
                for a in applicants
            ]
        }), 200

    finally:
        cursor.close()


# =========================
# ALL APPLICATIONS (ADMIN)
# =========================
@applications.route("/all-applications", methods=["GET"])
@jwt_required()
def all_applications():

    if get_jwt()["role"] != "admin":
        return jsonify({"message": "Admin only"}), 403

    cursor = mysql.connection.cursor()

    try:
        cursor.execute("""
            SELECT
                a.id,
                j.title,
                j.company,
                a.applicant_email,
                a.resume_link,
                a.status,
                a.applied_at
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            ORDER BY a.applied_at DESC
        """)

        data = cursor.fetchall()

        return jsonify([
            {
                "application_id": r[0],
                "job_title": r[1],
                "company": r[2],
                "applicant_email": r[3],
                "resume_link": r[4],
                "status": r[5],
                "applied_at": str(r[6])
            }
            for r in data
        ]), 200

    finally:
        cursor.close()


# =========================
# UPDATE STATUS (RECRUITER)
# =========================
@applications.route("/update-status/<int:application_id>", methods=["PUT"])
@jwt_required()
def update_application_status(application_id):

    current_user = get_jwt_identity()
    claims = get_jwt()

    if claims["role"] != "recruiter":
        return jsonify({"message": "Unauthorized"}), 403

    status = request.json.get("status")

    allowed = ["Applied", "Shortlisted", "Rejected"]

    if status not in allowed:
        return jsonify({"message": "Invalid status"}), 400

    cursor = mysql.connection.cursor()

    try:
        cursor.execute("""
            SELECT a.id, j.recruiter_email, a.applicant_email
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id=%s
        """, (application_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({"message": "Not found"}), 404

        if row[1] != current_user:
            return jsonify({"message": "Not your job"}), 403

        # UPDATE STATUS
        cursor.execute(
            "UPDATE applications SET status=%s WHERE id=%s",
            (status, application_id)
        )

        mysql.connection.commit()

        # OPTIONAL EMAIL HOOK (future upgrade)
        # send_email(row[2], "Status Update", f"Your application is {status}")

        return jsonify({
            "message": "Status updated",
            "status": status
        }), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"message": "Error", "error": str(e)}), 500

    finally:
        cursor.close()