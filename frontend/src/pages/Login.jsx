import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          email,
          password
        }
      );

      // =========================
      // SAVE TOKEN
      // =========================
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      // =========================
      // SAVE ROLE
      // =========================
      localStorage.setItem(
        "role",
        response.data.role
      );

      // =========================
      // SAVE EMAIL
      // =========================
      localStorage.setItem(
        "email",
        response.data.email
      );

      alert("Login Successful 🚀");

      // =========================
      // ROLE BASED NAVIGATION
      // =========================
      if (response.data.role === "candidate") {

        navigate("/jobs");

      } else if (
        response.data.role === "recruiter"
      ) {

        navigate("/recruiter-dashboard");

      } else if (
        response.data.role === "admin"
      ) {

        navigate("/admin");

      }

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >

      <form
        onSubmit={handleLogin}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-center
            mb-6
          "
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        <button
          type="submit"
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded-lg
            hover:opacity-90
            transition
          "
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;