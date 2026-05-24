import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API from "../services/api";

function JobApplicants() {
  const { jobId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH APPLICANTS
  // =========================
  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/api/applications/job-applicants/${jobId}`
      );


      setData(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      await API.put(
        `/api/applications/update-status/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh data
      await fetchApplicants();
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <h1 className="text-center mt-10 text-xl">
        Loading applicants...
      </h1>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!data || data.applicants.length === 0) {
    return (
      <h1 className="text-center mt-10 text-xl text-gray-600">
        No applicants found 😔
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-10">
        Applicants for {data.job_title}
      </h1>

      {/* CARDS */}
      <div className="grid gap-6 max-w-4xl mx-auto">

        {data.applicants.map((applicant) => (
          <div
            key={applicant.application_id}
            className="
              bg-white
              p-6
              rounded-2xl
              shadow-md
              hover:shadow-lg
              transition
            "
          >

            {/* EMAIL */}
            <p className="text-lg font-medium">
              📧 {applicant.applicant_email}
            </p>

            {/* STATUS */}
            <p className="mt-2 text-gray-700">
              Status:
              <span className="font-bold ml-2">
                {applicant.status}
              </span>
            </p>

            {/* RESUME */}
            <a
              href={applicant.resume_link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-blue-600 underline"
            >
              View Resume
            </a>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-5">

              <button
                disabled={updatingId === applicant.application_id}
                onClick={() =>
                  updateStatus(applicant.application_id, "Shortlisted")
                }
                className="
                  bg-green-500
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:opacity-90
                  disabled:opacity-50
                "
              >
                {updatingId === applicant.application_id
                  ? "Updating..."
                  : "Shortlist"}
              </button>

              <button
                disabled={updatingId === applicant.application_id}
                onClick={() =>
                  updateStatus(applicant.application_id, "Rejected")
                }
                className="
                  bg-red-500
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:opacity-90
                  disabled:opacity-50
                "
              >
                {updatingId === applicant.application_id
                  ? "Updating..."
                  : "Reject"}
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default JobApplicants;