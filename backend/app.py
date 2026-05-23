from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import pymysql

# MySQL compatibility patch (IMPORTANT)
pymysql.install_as_MySQLdb()

from config import Config
from utils.db import mysql

from routes.auth import auth
from routes.jobs import jobs
from routes.applications import applications

# =========================
# Load environment variables
# =========================
load_dotenv()

# =========================
# Initialize Flask App
# =========================
app = Flask(__name__)

# Load config
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize DB
mysql.init_app(app)

# Initialize JWT
jwt = JWTManager(app)

# =========================
# Register Blueprints
# =========================
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(jobs, url_prefix="/api/jobs")
app.register_blueprint(applications, url_prefix="/api/applications")

# =========================
# Home Route
# =========================
@app.route("/")
def home():
    return "Job Portal Backend Running Successfully 🚀"

# =========================
# Run Server (Render compatible)
# =========================
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))  # Render uses PORT env var

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )