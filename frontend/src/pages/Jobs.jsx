import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // URL search (?search=react)
  const queryParams = new URLSearchParams(location.search);
  const urlSearch = queryParams.get("search") || "";

  // FETCH JOBS
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/jobs/all-jobs"
      );

      setJobs(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // FINAL SEARCH (navbar + local input)
  const finalSearch = (search || urlSearch).toLowerCase();

  // FILTER JOBS (safe checks added)
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title?.toLowerCase().includes(finalSearch) ||
      job.company?.toLowerCase().includes(finalSearch) ||
      job.location?.toLowerCase().includes(finalSearch)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-3 text-center">
        Find Your Dream Job 🚀
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Explore top opportunities from recruiters
      </p>

      {/* SEARCH */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            max-w-2xl
            p-4
            rounded-2xl
            border
            bg-white
            shadow-sm
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />
      </div>

      {/* LOADING */}
      {loading && (
        <h2 className="text-center text-xl">
          Loading jobs...
        </h2>
      )}

      {/* NO JOBS */}
      {!loading && filteredJobs.length === 0 && (
        <h2 className="text-center text-xl text-gray-600">
          No jobs found 😔
        </h2>
      )}

      {/* JOBS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="
              bg-white
              p-6
              rounded-3xl
              shadow-md
              border
              border-gray-100
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-2">
              {job.title}
            </h2>

            {/* COMPANY */}
            <p className="text-gray-600 text-lg">
              {job.company}
            </p>

            {/* LOCATION */}
            <p className="mt-3">
              📍 {job.location}
            </p>

            {/* SALARY */}
            <p className="mt-2 font-semibold text-green-600">
              💰 {job.salary}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-700 line-clamp-4">
              {job.description}
            </p>

            {/* FOOTER */}
            <div className="mt-6 flex justify-between items-center">

              <Link
                to={`/apply/${job.id}`}
                className="
                  bg-black
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  hover:opacity-90
                  active:scale-95
                  transition
                "
              >
                Apply Now
              </Link>

              <span className="text-sm text-gray-500">
                Job ID: {job.id}
              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Jobs;