import axios from "axios";
import { useEffect, useState, useCallback } from "react";

function MatchResult({ jobId }) {
  const [results, setResults] = useState([]);
  const [showRejected, setShowRejected] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(() => {
    if (!jobId) return;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/match/${jobId}?showRejected=${showRejected}`, {
        withCredentials: true,
      })
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setLoading(false);
      });
  }, [jobId, showRejected]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const sendFeedback = async (id, text) => {
    await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/match/feedback/${id}`, {
      feedback: text,
    }, { withCredentials: true });
  };

  const getScoreBadge = (score, isMatch) => {
    if (!isMatch || score < 30) {
      return { color: "#dc3545", label: "Not a Match", bg: "#f8d7da" };
    } else if (score >= 70) {
      return { color: "#28a745", label: "Excellent Match", bg: "#d4edda" };
    } else if (score >= 50) {
      return { color: "#ffc107", label: "Good Match", bg: "#fff3cd" };
    } else {
      return { color: "#fd7e14", label: "Weak Match", bg: "#ffe5d0" };
    }
  };

  const getConfidenceBadge = (level) => {
    const colors = {
      high: "#28a745",
      medium: "#ffc107",
      low: "#6c757d",
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="card p-3 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Match Scores</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="showRejectedToggle"
            checked={showRejected}
            onChange={(e) => setShowRejected(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showRejectedToggle">
            Show Rejected Candidates
          </label>
        </div>
      </div>

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="alert alert-info">
          No matches found. Click "Match" button to analyze candidates.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover mt-2">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
                <th>AI Summary</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const badge = getScoreBadge(r.score, r.isMatch);
                return (
                  <tr key={r._id} style={{ backgroundColor: badge.bg }}>
                    <td>
                      <strong>{r.candidateId?.name}</strong>
                      <br />
                      <small className="text-muted">{r.candidateId?.email}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div style={{ width: "60px", fontWeight: "bold", fontSize: "1.2em" }}>
                          {r.score}%
                        </div>
                        <div className="progress flex-grow-1" style={{ height: "20px" }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${r.score}%`,
                              backgroundColor: badge.color,
                            }}
                            aria-valuenow={r.score}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: badge.color,
                          color: "white",
                          padding: "6px 12px",
                        }}
                      >
                        {badge.label}
                      </span>
                      {r.rejectionReason && (
                        <div className="mt-2">
                          <small className="text-danger">
                            <strong>Reason:</strong> {r.rejectionReason}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getConfidenceBadge(r.confidenceLevel),
                          color: "white",
                        }}
                      >
                        {r.confidenceLevel?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: "green", fontWeight: "500" }}>
                      {r.matchedSkills?.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {r.matchedSkills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td style={{ color: "#dc3545", fontWeight: "500" }}>
                      {r.missingSkills?.length > 0 ? (
                        <ul className="mb-0 ps-3">
                          {r.missingSkills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td>
                      <small style={{ fontSize: "0.85em" }}>
                        {r.aiSummary || "No AI analysis available"}
                      </small>
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        placeholder="Add feedback..."
                        defaultValue={r.feedback || ""}
                        onBlur={(e) => sendFeedback(r._id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MatchResult;
