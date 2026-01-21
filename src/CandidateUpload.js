import axios from "axios";
import { useAuth } from "./AuthContext";

function CandidateUpload({ refresh }) {
  const { user } = useAuth();

  const upload = async (e) => {
    const form = new FormData();
    form.append("resume", e.target.resume.files[0]);

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/candidates/upload`, form, {
        withCredentials: true,
      });
      alert("Resume uploaded successfully!");
      refresh();
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <form
      className="card p-4 mb-4 fade-in"
      style={{ borderRadius: "15px" }}
      onSubmit={(e) => {
        e.preventDefault();
        upload(e);
      }}
    >
      <div className="d-flex align-items-center mb-3">
        <div style={{
          width: "50px",
          height: "50px",
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "15px"
        }}>
          <i className="bi bi-file-earmark-person-fill text-white" style={{ fontSize: "24px" }}></i>
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Upload Resume</h5>
          <small className="text-muted">Get matched with relevant jobs</small>
        </div>
      </div>

      {/* Show logged-in user info */}
      <div className="alert alert-info mb-3" style={{ borderRadius: "10px" }}>
        <div className="d-flex align-items-center">
          <i className="bi bi-person-circle me-2" style={{ fontSize: "24px" }}></i>
          <div>
            <strong>{user?.name}</strong>
            <br />
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">
          <i className="bi bi-file-pdf me-2" style={{ color: "#11998e" }}></i>
          Resume (PDF only)
        </label>
        <input
          name="resume"
          type="file"
          accept=".pdf"
          className="form-control"
          required
          style={{ borderRadius: "10px" }}
        />
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Upload your resume in PDF format
        </small>
      </div>

      <button
        type="submit"
        className="btn btn-success w-100"
        style={{ fontWeight: "600", borderRadius: "10px" }}
      >
        <i className="bi bi-cloud-upload-fill me-2"></i>
        Upload Resume
      </button>
    </form>
  );
}

export default CandidateUpload;
