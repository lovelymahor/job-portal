import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    // send search query to jobs page
    navigate(`/jobs?search=${query}`);
  };

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center gap-4">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-black">
        Job Portal
      </h1>

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="flex flex-1 max-w-xl"
      >
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full
            border
            rounded-l-lg
            px-4
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        <button
          type="submit"
          className="
            bg-black
            text-white
            px-5
            rounded-r-lg
            hover:opacity-90
            transition
          "
        >
          Search
        </button>
      </form>

      {/* LINKS */}
      <div className="flex items-center gap-5 text-sm font-medium text-gray-700">

        <Link className="hover:text-black" to="/jobs">
          Jobs
        </Link>

        {role === "candidate" && (
          <>
            <Link className="hover:text-black" to="/my-applications">
              Applications
            </Link>

            <Link className="hover:text-black" to="/profile">
              Profile
            </Link>
          </>
        )}

        {role === "recruiter" && (
          <>
            <Link className="hover:text-black" to="/create-job">
              Post Job
            </Link>

            <Link className="hover:text-black" to="/my-jobs">
              My Jobs
            </Link>
          </>
        )}

        {role === "admin" && (
          <Link className="hover:text-black" to="/admin">
            Admin
          </Link>
        )}
      </div>

      {/* AUTH */}
      <div className="flex items-center gap-3">

        {email && (
          <span className="text-xs text-gray-500 hidden md:block">
            {email}
          </span>
        )}

        {token ? (
          <button
            onClick={logout}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Logout
          </button>
        ) : (
          <>
            <Link className="px-4 py-2 border rounded-lg text-sm" to="/login">
              Login
            </Link>

            <Link className="px-4 py-2 bg-black text-white rounded-lg text-sm" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;