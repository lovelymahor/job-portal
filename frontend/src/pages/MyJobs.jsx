import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyJobs() {

  const [jobs, setJobs] = useState([]);

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

      alert("Failed to fetch jobs");
    }
  };

  useEffect(() => {

    fetchJobs();

  }, []);

  // =========================
  // DELETE JOB
  // =========================
  const deleteJob = async (jobId) => {

    try {

      await axios.delete(
        `http://127.0.0.1:5000/api/jobs/delete-job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Job deleted");

      fetchJobs();

    } catch (error) {

      console.log(error);

      alert("Delete failed");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-8">
        My Posted Jobs 💼
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {
          jobs.map((job) => (

            <div
              key={job.id}
              className="
                bg-white
                p-6
                rounded-2xl
                shadow-md
              "
            >

              <h2 className="text-2xl font-bold mb-2">
                {job.title}
              </h2>

              <p className="text-gray-600">
                {job.company}
              </p>

              <p className="mt-2">
                📍 {job.location}
              </p>

              <p className="mt-2 font-semibold">
                💰 {job.salary}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

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

                <button
                  onClick={() => deleteJob(job.id)}
                  className="
                    bg-red-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Delete
                </button>

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

export default MyJobs;