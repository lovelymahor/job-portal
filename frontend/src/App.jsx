import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import ApplyJob from "./pages/ApplyJob";
import Profile from "./pages/Profile";
import JobApplicants from "./pages/JobApplicants";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/AdminDashboard";
import CreateJob from "./pages/CreateJob";
import UpdateJob from "./pages/UpdateJob";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import RecruiterRoute from "./routes/RecruiterRoute";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";

import Home from "./pages/Home";




function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute>
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <AdminRoute>
              <CreateJob />
            </AdminRoute>
          }
        />

        <Route
          path="/recruiter-dashboard"
          element={
            <RecruiterRoute>
              <RecruiterDashboard />
            </RecruiterRoute>
          }
        />

        <Route
          path="/update-job/:jobId"
          element={
            <RecruiterRoute>
              <UpdateJob />
            </RecruiterRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:jobId"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-applicants/:jobId"
          element={
            <ProtectedRoute>
              <JobApplicants />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route 
        path="/job/:id" 
        element={<JobDetails />} 
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;