import axios from "axios";
import { useState } from "react";

function MatchTable({ jobId, candidates }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);

  const closeModal = () => {
    setShowModal(false);
    setLoading(false);
    setResult(null);
    setCurrentCandidate(null);
    setLoadingStage(0);
  };

  const matchCandidate = async (candidate) => {
    if (loading) return; // prevent multiple clicks

    // INSTANT modal open for better UX
    setCurrentCandidate(candidate);
    setShowModal(true);
    setLoading(true);
    setResult(null);
    setLoadingStage(1);

    try {
      // Simulate progress stages
      setTimeout(() => setLoadingStage(2), 500);

      // Step 1: Trigger matching
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/match/${jobId}/${candidate._id}`,
        {},
        { withCredentials: true }
      );

      setLoadingStage(3);

      // Step 2: Fetch updated results
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/match/${jobId}`,
        { withCredentials: true }
      );

      const latestResult = res.data.find(
        (r) => r.candidateId?._id === candidate._id
      );

      setResult(latestResult || { error: "Result not found" });
      setLoadingStage(4);
    } catch (err) {
      console.error("Match error:", err);
      setResult({ error: "Matching failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 1: return "Preparing analysis...";
      case 2: return "Analyzing resume with AI...";
      case 3: return "Calculating match score...";
      case 4: return "Finalizing results...";
      default: return "Processing...";
    }
  };

  const getProgressWidth = () => {
    switch (loadingStage) {
      case 1: return "25%";
      case 2: return "50%";
      case 3: return "75%";
      case 4: return "95%";
      default: return "10%";
    }
  };

  return (
    <>
      {/* Candidate Table */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th><i className="bi bi-person me-2"></i>Name</th>
            <th><i className="bi bi-envelope me-2"></i>Email</th>
            <th style={{ width: "140px" }}><i className="bi bi-lightning me-2"></i>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <button
                  className="btn btn-warning w-100"
                  disabled={loading}
                  onClick={() => matchCandidate(c)}
                  style={{ fontWeight: "600" }}
                >
                  {loading && currentCandidate?._id === c._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Matching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lightning-fill me-2"></i>
                      Match
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* OPTIMIZED MODAL - Opens Instantly */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ animation: "slideDown 0.3s ease-out", maxWidth: "700px" }}
          >
            <div className="modal-content" style={{ borderRadius: "15px", overflow: "hidden" }}>

              {/* Header */}
              <div className="modal-header" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}>
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-robot me-2"></i>
                  AI Match Analysis — {currentCandidate?.name}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                  disabled={loading}
                />
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                {loading && (
                  <div className="text-center">
                    {/* Animated Icon */}
                    <div style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto 20px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "pulse 1.5s infinite"
                    }}>
                      <i className="bi bi-cpu text-white" style={{ fontSize: "40px" }}></i>
                    </div>

                    <h5 className="mb-3">{getLoadingMessage()}</h5>

                    {/* Progress Bar */}
                    <div className="progress" style={{ height: "30px", borderRadius: "15px" }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{
                          width: getProgressWidth(),
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          transition: "width 0.5s ease"
                        }}
                      >
                        {getProgressWidth()}
                      </div>
                    </div>

                    <p className="text-muted mt-3 mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      This may take a few seconds...
                    </p>
                  </div>
                )}

                {!loading && result && !result.error && (
                  <div className="fade-in">
                    {/* Score Badge */}
                    <div className="text-center mb-4">
                      <div style={{
                        width: "120px",
                        height: "120px",
                        margin: "0 auto",
                        background: result.score >= 70 ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" :
                          result.score >= 50 ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" :
                            "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                      }}>
                        <div className="text-white">
                          <div style={{ fontSize: "36px", fontWeight: "bold" }}>{result.score}%</div>
                          <div style={{ fontSize: "12px" }}>Match Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Match Status */}
                    <div className="alert" style={{
                      background: result.score >= 70 ? "#d4edda" :
                        result.score >= 50 ? "#fff3cd" : "#f8d7da",
                      border: "none",
                      borderRadius: "10px"
                    }}>
                      <h6 className="mb-0">
                        <i className={`bi ${result.score >= 70 ? "bi-check-circle-fill text-success" :
                          result.score >= 50 ? "bi-exclamation-triangle-fill text-warning" :
                            "bi-x-circle-fill text-danger"} me-2`}></i>
                        {result.score >= 70 ? "Excellent Match!" :
                          result.score >= 50 ? "Good Match" : "Poor Match"}
                      </h6>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="card" style={{ borderRadius: "10px", border: "2px solid #11998e" }}>
                          <div className="card-body">
                            <h6 className="fw-bold text-success">
                              <i className="bi bi-check-circle-fill me-2"></i>
                              Matched Skills
                            </h6>
                            {result.matchedSkills?.length ? (
                              <div className="d-flex flex-wrap gap-1">
                                {result.matchedSkills.map((skill, idx) => (
                                  <span key={idx} className="badge bg-success">{skill}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted mb-0">None</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="card" style={{ borderRadius: "10px", border: "2px solid #eb3349" }}>
                          <div className="card-body">
                            <h6 className="fw-bold text-danger">
                              <i className="bi bi-x-circle-fill me-2"></i>
                              Missing Skills
                            </h6>
                            {result.missingSkills?.length ? (
                              <div className="d-flex flex-wrap gap-1">
                                {result.missingSkills.map((skill, idx) => (
                                  <span key={idx} className="badge bg-danger">{skill}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted mb-0">None</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!loading && result?.error && (
                  <div className="alert alert-danger text-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {result.error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={loading}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            transform: translateY(-50px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}

export default MatchTable;
