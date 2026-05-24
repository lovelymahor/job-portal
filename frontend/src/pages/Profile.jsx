import { useEffect, useState } from "react";

import API from "../services/api";

function Profile() {

  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  const email = localStorage.getItem("email");

  // =========================
  // FETCH APPLICATIONS
  // =========================
  const fetchApplications = async () => {

    try {

      const response = await API.get(
        "/api/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load profile");
    }
  };

  useEffect(() => {

    fetchApplications();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div
        className="
          max-w-4xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-lg
          p-10
        "
      >

        <div className="flex items-center gap-6">

          <div
            className="
              w-24
              h-24
              rounded-full
              bg-black
              text-white
              flex
              items-center
              justify-center
              text-4xl
              font-bold
            "
          >
            {email?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              Candidate Profile
            </h1>

            <p className="text-gray-600 mt-2">
              {email}
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div
            className="
              bg-gray-100
              p-8
              rounded-2xl
              text-center
            "
          >

            <h2 className="text-5xl font-bold">
              {applications.length}
            </h2>

            <p className="mt-3 text-gray-600">
              Total Applications
            </p>

          </div>

          <div
            className="
              bg-gray-100
              p-8
              rounded-2xl
              text-center
            "
          >

            <h2 className="text-5xl font-bold">
              {
                applications.filter(
                  (app) =>
                    app.status === "Shortlisted"
                ).length
              }
            </h2>

            <p className="mt-3 text-gray-600">
              Shortlisted
            </p>

          </div>

        </div>

        {/* RECENT APPLICATIONS */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Recent Applications
          </h2>

          <div className="space-y-4">

            {
              applications.map((app) => (

                <div
                  key={app.application_id}
                  className="
                    border
                    p-5
                    rounded-2xl
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h3 className="text-xl font-semibold">
                      {app.job_title}
                    </h3>

                    <p className="text-gray-600">
                      {app.company}
                    </p>

                  </div>

                  <div>

                    <span
                      className="
                        bg-black
                        text-white
                        px-4
                        py-2
                        rounded-full
                        text-sm
                      "
                    >
                      {app.status}
                    </span>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;