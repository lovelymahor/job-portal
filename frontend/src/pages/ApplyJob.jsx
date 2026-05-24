import { useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

function ApplyJob() {

  const { jobId } = useParams();

  const [resume, setResume] = useState(null);

  const token = localStorage.getItem("token");

  const handleApply = async (e) => {

    e.preventDefault();

    if (!resume) {

      return alert("Please upload resume");
    }

    const formData = new FormData();

    formData.append("job_id", jobId);

    formData.append("resume", resume);

    try {

      const response = await API.post(
        "/api/applications/apply-job",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Application failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleApply}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
        "
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Apply Job
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setResume(e.target.files[0])
          }
          className="mb-5"
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
          Upload Resume & Apply
        </button>

      </form>

    </div>
  );
}

export default ApplyJob;