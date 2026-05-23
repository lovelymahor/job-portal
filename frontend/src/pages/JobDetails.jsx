import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/jobs/${id}`
      );

      setJob(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        Job not found 😔
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* CARD */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        {/* COMPANY */}
        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-xl text-xl font-bold">
            {job.company?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {job.title}
            </h2>

            <p className="text-gray-600">
              {job.company}
            </p>
          </div>

        </div>

        {/* INFO */}
        <div className="space-y-3 text-gray-700">

          <p>📍 {job.location}</p>
          <p>💰 {job.salary}</p>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">
            Job Description
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-4">

          <Link
            to={`/apply/${job.id}`}
            className="
              bg-black
              text-white
              px-6 py-3
              rounded-xl
              hover:opacity-90
              transition
            "
          >
            Apply Now
          </Link>

          <Link
            to="/jobs"
            className="
              border
              px-6 py-3
              rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            Back to Jobs
          </Link>

        </div>

      </div>
    </div>
  );
}

export default JobDetails;