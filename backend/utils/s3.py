import boto3
import os
import uuid

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION")
)

BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")


def upload_file_to_s3(file):
    try:
        file_extension = file.filename.split(".")[-1]
        
        # only allow pdf
        if file_extension.lower() != "pdf":
            return None, "Only PDF files allowed"

        filename = f"resumes/{uuid.uuid4()}.pdf"

        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={
                "ContentType": "application/pdf"
            }
        )

        file_url = f"https://{BUCKET_NAME}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{filename}"

        return file_url, None

    except Exception as e:
        return None, str(e)