import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {

  const [jobs, setJobs] = useState([]);

  // =========================
  // FETCH JOBS
  // =========================
  const fetchJobs = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/api/jobs/all-jobs"
      );

      // Show latest 6 jobs
      setJobs(response.data.slice(0, 6));

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchJobs();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}

      <div
        className="
          flex
          flex-col
          justify-center
          items-center
          text-center
          px-6
          py-28
        "
      >

        <h1
          className="
            text-6xl
            font-bold
            mb-6
          "
        >
          Find Your Dream Job 🚀
        </h1>

        <p
          className="
            text-xl
            text-gray-600
            max-w-2xl
            mb-8
          "
        >
          Connect with top companies,
          apply to jobs,
          and manage applications easily.
        </p>

        <div className="flex gap-5">

          <Link
            to="/jobs"
            className="
              bg-black
              text-white
              px-8
              py-4
              rounded-xl
              text-lg
            "
          >
            Explore Jobs
          </Link>

          <Link
            to="/register"
            className="
              bg-white
              border
              px-8
              py-4
              rounded-xl
              text-lg
            "
          >
            Get Started
          </Link>

        </div>

      </div>

      {/* STATS SECTION */}

      <div
        className="
          grid
          md:grid-cols-4
          gap-6
          px-10
          pb-20
        "
      >

        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-5xl font-bold">
            {jobs.length}+
          </h2>

          <p className="mt-3 text-gray-600">
            Active Jobs
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-5xl font-bold">
            50+
          </h2>

          <p className="mt-3 text-gray-600">
            Companies
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-5xl font-bold">
            1000+
          </h2>

          <p className="mt-3 text-gray-600">
            Candidates
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-5xl font-bold">
            25+
          </h2>

          <p className="mt-3 text-gray-600">
            Recruiters
          </p>
        </div>

      </div>

      {/* FEATURED JOBS */}

      <div className="px-10 pb-20">

        <h2
          className="
            text-4xl
            font-bold
            text-center
            mb-10
          "
        >
          Latest Jobs 🔥
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >

          {
            jobs.map((job) => (

              <div
  key={job.id}
  className="
    bg-white
    p-6
    rounded-2xl
    shadow-md
    hover:shadow-2xl
    transition
    duration-300
    border
  "
>

  {/* COMPANY LOGO */}

            <div
              className="
                w-14
                h-14
                rounded-xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-2xl
                font-bold
                mb-4
              "
            >
              {job.company?.charAt(0)}
            </div>
          
            <h3 className="text-2xl font-bold mb-2">
              {job.title}
            </h3>
          
            <p className="text-gray-600 text-lg">
              {job.company}
            </p>
          
            <p className="mt-3 text-gray-700">
              📍 {job.location}
            </p>
          
            <p className="mt-2 font-semibold text-green-600">
              💰 {job.salary}
            </p>
          
            <p className="mt-4 text-gray-600 line-clamp-3">
              {job.description}
            </p>
          
            <Link
              to={`/apply/${job.id}`}
              className="
                inline-block
                mt-6
                bg-black
                text-white
                px-5
                py-3
                rounded-xl
                hover:opacity-90
                transition
              "
            >
              Apply Now
            </Link>
          
          </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Home;