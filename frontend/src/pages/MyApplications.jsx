import { useEffect, useState } from "react";
import API from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH APPLICATIONS
  // =========================
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/api/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================
  // FILTER DATA
  // =========================
  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-8">
        My Applications 📄
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", "Applied", "Shortlisted", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-xl font-medium transition
              ${filter === f ? "bg-black text-white" : "bg-white"}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <h2 className="text-center text-xl">
          Loading applications...
        </h2>
      )}

      {/* EMPTY */}
      {!loading && filteredApplications.length === 0 && (
        <h2 className="text-center text-xl text-gray-600">
          No applications found 😔
        </h2>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredApplications.map((app) => (
          <div
            key={app.application_id}
            className="
              bg-white
              p-6
              rounded-3xl
              shadow-md
              border
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            {/* JOB TITLE */}
            <h2 className="text-2xl font-bold mb-1">
              {app.job_title}
            </h2>

            <p className="text-gray-600">
              {app.company}
            </p>

            <p className="mt-2 text-gray-500">
              📍 {app.location}
            </p>

            {/* STATUS BADGE */}
            <div className="mt-4">
              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${getStatusStyle(app.status)}
                `}
              >
                {app.status}
              </span>
            </div>

            {/* DATE */}
            <p className="mt-4 text-sm text-gray-500">
              Applied On
            </p>
            <p className="text-gray-700">
              {app.applied_at}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MyApplications;