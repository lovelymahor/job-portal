import { useState } from "react";
import API from "../services/api";

function CreateJob() {

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateJob = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/api/jobs/create-job",
        {
          title,
          company,
          location,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to create job"
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
        onSubmit={handleCreateJob}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-lg
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-6
          "
        >
          Create Job
        </h1>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
          "
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
          "
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
          "
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-lg
            mb-4
            h-32
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
          "
        >
          Create Job
        </button>

      </form>

    </div>
  );
}

export default CreateJob;