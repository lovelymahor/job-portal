import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
          role
        }
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
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
        onSubmit={handleRegister}
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
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
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

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
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
        >

          <option value="candidate">
            Candidate
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

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
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;