import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateJob() {

  const { jobId } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: ""
  });

  // =========================
  // FETCH JOB DETAILS
  // =========================
  const fetchJob = async () => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:5000/api/jobs/job/${jobId}`
      );

      setFormData(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch job");
    }
  };

  useEffect(() => {

    fetchJob();

  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // UPDATE JOB
  // =========================
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `http://127.0.0.1:5000/api/jobs/update-job/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Job updated successfully");

      navigate("/recruiter");

    } catch (error) {

      console.log(error);

      alert("Update failed");
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleUpdate}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-lg
        "
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Update Job
        </h1>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          type="submit"
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded-lg
          "
        >
          Update Job
        </button>

      </form>

    </div>
  );
}

export default UpdateJob;