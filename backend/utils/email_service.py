import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_USER = "your_email@gmail.com"
EMAIL_PASS = "your_app_password"


def send_email(to_email, subject, body):
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL_USER
        msg["To"] = to_email

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
        server.quit()

        return True, None

    except Exception as e:
        return False, str(e)