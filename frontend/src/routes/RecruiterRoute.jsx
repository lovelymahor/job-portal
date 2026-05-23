import { Navigate } from "react-router-dom";

function RecruiterRoute({ children }) {

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {

    return <Navigate to="/login" />;
  }

  if (role !== "recruiter") {

    return <Navigate to="/jobs" />;
  }

  return children;
}

export default RecruiterRoute;