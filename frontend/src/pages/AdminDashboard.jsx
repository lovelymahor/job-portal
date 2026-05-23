import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    fetchApplications();

  }, []);

  const fetchApplications = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/api/applications/all-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch applications");
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {

    try {

      await axios.put(
        `http://127.0.0.1:5000/api/applications/update-status/${applicationId}`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Application ${status}`);

      fetchApplications();

    } catch (error) {

      console.log(error);

      alert("Failed to update status");
    }
  };

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        p-8
      "
    >

      <h1
        className="
          text-4xl
          font-bold
          text-center
          mb-10
        "
      >
        Admin Dashboard
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {
          applications.map((app) => (

            <div
              key={app.application_id}
              className="
                bg-white
                p-6
                rounded-2xl
                shadow-md
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-3
                "
              >
                {app.job_title}
              </h2>

              <p className="mb-2">
                <strong>Candidate:</strong>
                {" "}
                {app.applicant_email}
              </p>

              <p className="mb-2">
                <strong>Company:</strong>
                {" "}
                {app.company}
              </p>

              <p className="mb-4">
                <strong>Status:</strong>
                {" "}
                <span
                  className="
                    bg-gray-200
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  "
                >
                  {app.status}
                </span>
              </p>

              <a
                href={app.resume_link}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-block
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  mb-4
                  hover:bg-blue-700
                "
              >
                View Resume
              </a>

              <div
                className="
                  flex
                  gap-3
                "
              >

                <button
                  onClick={() =>
                    updateStatus(
                      app.application_id,
                      "Shortlisted"
                    )
                  }
                  className="
                    bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-green-700
                  "
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.application_id,
                      "Rejected"
                    )
                  }
                  className="
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-red-700
                  "
                >
                  Reject
                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default AdminDashboard;