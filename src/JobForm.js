import axios from "axios";
import { useState } from "react";

function JobForm({ refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const submit = async () => {
    if (!title.trim() || !description.trim() || !skills.trim()) {
      alert("Fill all fields properly");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/jobs`, {
        title: title.trim(),
        description: description.trim(),
        skills: skills.split(",").map((s) => s.trim()),
      }, { withCredentials: true });

      alert("Job Posted Successfully!");
      refresh();
      setTitle("");
      setDescription("");
      setSkills("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Server Error while posting job");
    }
  };

  return (
    <div className="card p-4 mb-4 fade-in" style={{ borderRadius: "15px" }}>
      <div className="d-flex align-items-center mb-3">
        <div style={{
          width: "50px",
          height: "50px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "15px"
        }}>
          <i className="bi bi-briefcase-fill text-white" style={{ fontSize: "24px" }}></i>
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Post New Job</h5>
          <small className="text-muted">Create a job opening and find candidates</small>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          <i className="bi bi-card-heading me-2"></i>Job Title
        </label>
        <input
          className="form-control"
          placeholder="e.g., Senior React Developer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          <i className="bi bi-file-text me-2"></i>Job Description
        </label>
        <textarea
          className="form-control"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          <i className="bi bi-star me-2"></i>Required Skills
        </label>
        <input
          className="form-control"
          placeholder="React, JavaScript, Node.js, MongoDB (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Separate skills with commas
        </small>
      </div>

      <button
        type="button"
        className="btn btn-primary w-100"
        onClick={submit}
        style={{ padding: "12px", fontWeight: "600" }}
      >
        <i className="bi bi-plus-circle me-2"></i>
        Post Job
      </button>
    </div>
  );
}

export default JobForm;
