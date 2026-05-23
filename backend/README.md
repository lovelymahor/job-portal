# Job Portal (Full Stack Web Application)

## Overview
This project is a cloud-based full-stack Job Portal application that enables users to post, search, and apply for jobs. It is designed to demonstrate practical implementation of full-stack development, RESTful APIs, and cloud integration for scalable and real-world applications.

## Features
- User authentication (registration and login)
- Job posting and management
- Job search and filtering
- Resume upload and application tracking
- Role-based access (admin and user)
- REST API integration between frontend and backend

## Tech Stack

### Frontend
- React.js
- HTML, CSS
- Axios (API integration)

### Backend
- Python (Flask)
- REST API Development

### Database
- MongoDB (MongoDB Atlas)

### Cloud and Deployment
- AWS EC2 (application hosting) / Render (alternative)
- AWS S3 / Cloudinary (file storage)

### Tools and Technologies
- Git and GitHub
- Postman (API testing)

## Project Structure
job-portal-fullstack/
│
├── frontend/ # React application
├── backend/ # Flask APIs and server
├── README.md

## Installation and Setup

### Prerequisites
- Node.js and npm
- Python 3.x
- MongoDB Atlas account

### Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate # On Windows
pip install flask flask-cors pymongo
python app.py

### Frontend Setup

cd frontend
npm install
npm start


## Usage
- Register or log in as a user
- Post and manage job listings
- Search and apply for jobs
- Upload resumes and track applications

## Deployment
The application can be deployed using:
- AWS EC2 for backend hosting
- AWS S3 or Cloudinary for file storage
- Vercel or Netlify for frontend deployment

## Future Enhancements
- Real-time notifications
- Advanced search and filtering
- Analytics dashboard
- Integration with third-party job APIs

## Author
Lovely Mahour

## License
This project is developed for educational and demonstration purposes.


