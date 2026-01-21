import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function JobApplicants({ job, onClose }) {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matching, setMatching] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [loadingStage, setLoadingStage] = useState("");

    const loadApplicants = useCallback(async () => {
        try {
            // Get all applications for this recruiter
            const appRes = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/applications`,
                { withCredentials: true }
            );

            // Filter applications for this specific job with pending status
            const jobApplications = appRes.data.filter(
                app => app.jobId._id === job._id && app.status === 'pending'
            );

            // Map to include applicationId
            const applicantsWithAppId = jobApplications.map(app => ({
                _id: app.candidateId._id,
                name: app.candidateId.name,
                email: app.candidateId.email,
                uploadedAt: app.appliedAt,
                applicationId: app._id
            }));

            setApplicants(applicantsWithAppId);
            setLoading(false);
        } catch (err) {
            console.error("Load applicants error:", err);
            setLoading(false);
        }
    }, [job._id]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadApplicants();
    }, [loadApplicants]);

    const matchCandidate = async (candidate) => {
        setMatching(candidate._id);
        setMatchResult(null);
        setLoadingStage("Preparing analysis...");

        try {
            setTimeout(() => setLoadingStage("Analyzing resume with AI..."), 500);
            setTimeout(() => setLoadingStage("Calculating match score..."), 1500);
            setTimeout(() => setLoadingStage("Finalizing results..."), 2500);

            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/match/${job._id}/${candidate._id}`,
                {},
                { withCredentials: true }
            );

            setMatchResult({
                ...response.data,
                candidateName: candidate.name,
                applicationId: candidate.applicationId
            });
            setMatching(null);
            setLoadingStage("");
        } catch (err) {
            console.error("Match error:", err);
            alert("Matching failed: " + (err.response?.data?.error || "Unknown error"));
            setMatching(null);
            setLoadingStage("");
        }
    };

    const shortlistCandidate = async () => {
        if (!matchResult.applicationId) {
            alert("Application ID not found. Please try matching again.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/applications/${matchResult.applicationId}/shortlist`,
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
            closeMatchResult();
            loadApplicants();
        } catch (err) {
            console.error("Shortlist error:", err);
            alert("Failed to shortlist candidate: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const rejectCandidate = async () => {
        if (!matchResult.applicationId) {
            alert("Application ID not found. Please try matching again.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/applications/${matchResult.applicationId}/reject`,
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
            closeMatchResult();
            loadApplicants();
        } catch (err) {
            console.error("Reject error:", err);
            alert("Failed to reject candidate: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const closeMatchResult = () => {
        setMatchResult(null);
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ borderRadius: "15px" }}>
                    <div
                        className="modal-header"
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-people-fill me-2"></i>
                            Applicants for: {job.title}
                        </h5>
                        <button
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {loading && (
                            <div className="text-center">
                                <div className="spinner-border text-primary"></div>
                                <p className="mt-2">Loading applicants...</p>
                            </div>
                        )}

                        {!loading && applicants.length === 0 && (
                            <div className="alert alert-info">
                                <i className="bi bi-info-circle me-2"></i>
                                No pending applicants for this job.
                            </div>
                        )}

                        {!loading && applicants.length > 0 && !matchResult && (
                            <>
                                <p className="text-muted mb-3">
                                    <strong>{applicants.length}</strong> pending candidate(s) for this position
                                </p>

                                <div className="list-group">
                                    {applicants.map((applicant) => (
                                        <div
                                            key={applicant._id}
                                            className="list-group-item mb-2"
                                            style={{ borderRadius: "10px", border: "2px solid #e0e0e0" }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-1">
                                                        <i className="bi bi-person-circle me-2" style={{ color: "#667eea" }}></i>
                                                        {applicant.name}
                                                    </h6>
                                                    <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                        <i className="bi bi-envelope me-2"></i>
                                                        {applicant.email}
                                                    </p>
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar me-1"></i>
                                                        Applied: {new Date(applicant.uploadedAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => matchCandidate(applicant)}
                                                    disabled={matching === applicant._id}
                                                    style={{ borderRadius: "8px" }}
                                                >
                                                    {matching === applicant._id ? (
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Match Result Display */}
                        {matchResult && (
                            <div className="match-result-display">
                                <div className="text-center mb-4">
                                    <div
                                        className="mx-auto mb-3"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            borderRadius: "50%",
                                            background:
                                                matchResult.score >= 70
                                                    ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                                    : matchResult.score >= 50
                                                        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                                        : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>
                                                {matchResult.score}%
                                            </div>
                                            <div style={{ fontSize: "12px", color: "white", opacity: 0.9 }}>
                                                Match Score
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="fw-bold">
                                        {matchResult.score >= 70
                                            ? "🎉 Excellent Match!"
                                            : matchResult.score >= 50
                                                ? "👍 Good Match"
                                                : "⚠️ Partial Match"}
                                    </h5>
                                </div>

                                {/* Skills Breakdown */}
                                <div className="mb-3">
                                    <h6 className="fw-bold mb-2">
                                        <i className="bi bi-check-circle me-2" style={{ color: "#11998e" }}></i>
                                        Matched Skills
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {matchResult.matchedSkills?.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="badge bg-success"
                                                style={{ padding: "8px 12px", fontSize: "13px" }}
                                            >
                                                ✓ {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {matchResult.missingSkills?.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="fw-bold mb-2">
                                            <i className="bi bi-x-circle me-2" style={{ color: "#dc3545" }}></i>
                                            Missing Skills
                                        </h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {matchResult.missingSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="badge bg-danger"
                                                    style={{ padding: "8px 12px", fontSize: "13px" }}
                                                >
                                                    ✗ {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* AI Summary */}
                                {matchResult.summary && (
                                    <div className="alert alert-info">
                                        <h6 className="fw-bold mb-2">
                                            <i className="bi bi-robot me-2"></i>
                                            AI Analysis
                                        </h6>
                                        <p className="mb-0" style={{ fontSize: "14px" }}>
                                            {matchResult.summary}
                                        </p>
                                    </div>
                                )}

                                {/* Shortlist and Reject Buttons */}
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={closeMatchResult}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back
                                    </button>
                                    <button
                                        className="btn btn-success flex-grow-1"
                                        onClick={shortlistCandidate}
                                    >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Shortlist
                                    </button>
                                    <button
                                        className="btn btn-danger flex-grow-1"
                                        onClick={rejectCandidate}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading Stage Display */}
                        {matching && (
                            <div className="text-center">
                                <div className="spinner-border text-primary mb-3"></div>
                                <p className="fw-bold">{loadingStage}</p>
                                <div className="progress" style={{ height: "8px" }}>
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        style={{ width: "100%" }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobApplicants;
