import { useEffect, useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

function RecruiterDashboard() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH RECRUITER JOBS
  // =========================
  const fetchJobs = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/api/jobs/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setJobs(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch dashboard");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchJobs();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        Recruiter Dashboard 🚀
      </h1>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div
          className="
            bg-white
            p-8
            rounded-3xl
            shadow-md
            text-center
          "
        >

          <h2 className="text-5xl font-bold">
            {jobs.length}
          </h2>

          <p className="mt-3 text-gray-600">
            Total Jobs Posted
          </p>

        </div>

        <div
          className="
            bg-white
            p-8
            rounded-3xl
            shadow-md
            text-center
          "
        >

          <h2 className="text-5xl font-bold">
            {jobs.length}
          </h2>

          <p className="mt-3 text-gray-600">
            Active Listings
          </p>

        </div>

        <div
          className="
            bg-white
            p-8
            rounded-3xl
            shadow-md
            text-center
          "
        >

          <Link
            to="/create-job"
            className="
              inline-block
              mt-4
              bg-black
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Create New Job
          </Link>

        </div>

      </div>

      {/* JOB LIST */}

      <h2 className="text-3xl font-bold mb-6">
        My Recent Jobs
      </h2>

      {
        loading && (
          <h2>Loading...</h2>
        )
      }

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {
          jobs.map((job) => (

            <div
              key={job.id}
              className="
                bg-white
                p-6
                rounded-3xl
                shadow-md
              "
            >

              <h2 className="text-2xl font-bold">
                {job.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {job.company}
              </p>

              <p className="mt-2">
                📍 {job.location}
              </p>

              <p className="mt-2 font-semibold text-green-600">
                💰 {job.salary}
              </p>

              <div className="flex gap-3 mt-5">

                <Link
                  to={`/edit-job/${job.id}`}
                  className="
                    bg-blue-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Edit
                </Link>

                <Link
                  to={`/job-applicants/${job.id}`}
                  className="
                    bg-black
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Applicants
                </Link>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default RecruiterDashboard;