import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

import JobForm from "./JobForm";
import CandidateUpload from "./CandidateUpload";
import MatchTable from "./MatchTable";
import MatchResult from "./MatchResult";
import JobApplicants from "./JobApplicants";

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [shortlistedApps, setShortlistedApps] = useState([]);
    const [rejectedApps, setRejectedApps] = useState([]);
    const [showRejected, setShowRejected] = useState(false); // Toggle state
    const { user, logout } = useAuth();

    const loadData = useCallback(async () => {
        try {
            const jobRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/jobs`, {
                withCredentials: true,
            });
            const candRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/candidates`, {
                withCredentials: true,
            });
            setJobs(jobRes.data);
            setCandidates(candRes.data);
        } catch (err) {
            console.error("Load error:", err);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                logout();
            }
        }
    }, [logout]);

    const loadApplications = useCallback(async () => {
        if (user?.role !== "recruiter") return;

        try {
            const shortlistedRes = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/applications/shortlisted`,
                { withCredentials: true }
            );
            const rejectedRes = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/applications/rejected`,
                { withCredentials: true }
            );
            setShortlistedApps(shortlistedRes.data);
            setRejectedApps(rejectedRes.data);
        } catch (err) {
            console.error("Load applications error:", err);
        }
    }, [user?.role]);

    useEffect(() => {
        loadData();
        loadApplications();
    }, [loadData, loadApplications]);

    const deleteJob = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/jobs/${id}`, {
                withCredentials: true,
            });
            loadData();
        } catch (err) {
            console.error("Delete failed:", err);
            alert(err.response?.data?.error || "Delete failed");
        }
    };

    const applyToJob = async (jobId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/candidates/apply/${jobId}`,
                {},
                { withCredentials: true }
            );
            alert(response.data.message || "Successfully applied to job!");
            loadData();
        } catch (err) {
            console.error("Apply failed:", err);
            alert(err.response?.data?.error || "Failed to apply to job");
        }
    };

    const viewApplicants = (job) => {
        setSelectedJob(job);
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="container py-4">
                {/* Header */}
                <nav className="glass-card mb-4 p-3 fade-in d-flex justify-content-between align-items-center" style={{
                    background: "rgba(44, 62, 80, 0.85)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}>
                    <span className="navbar-brand d-flex align-items-center text-white">
                        <span style={{ fontSize: "30px", marginRight: "10px" }}>🎯</span>
                        <span className="fw-bold gradient-text" style={{
                            background: "linear-gradient(135deg, #667eea 0%, #38ef7d 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>AI Recruitment Platform</span>
                    </span>
                    <div className="d-flex align-items-center">
                        <div className="me-3 text-white">
                            <i className="bi bi-person-circle me-2"></i>
                            <strong>{user?.name}</strong>
                            <span className="badge-modern ms-2" style={{
                                background: user?.role === 'recruiter' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                    user?.role === 'candidate' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' :
                                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                padding: "6px 14px",
                                borderRadius: "20px",
                                color: "white"
                            }}>
                                {user?.role === 'recruiter' ? '👨‍💼 Recruiter' :
                                    user?.role === 'candidate' ? '👤 Candidate' : '🔐 Admin'}
                            </span>
                        </div>
                        <button className="modern-btn btn-gradient-accent" onClick={logout} style={{
                            padding: "8px 20px",
                            fontSize: "13px"
                        }}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Role-based UI */}
                {user?.role === "recruiter" && (
                    <>
                        {/* Recruiter View */}
                        <div className="row">
                            <div className="col-md-12">
                                <JobForm refresh={loadData} />
                            </div>
                        </div>

                        <h5 className="mt-4 mb-3 d-flex align-items-center gradient-text" style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "700"
                        }}>
                            <i className="bi bi-briefcase-fill me-2" style={{ color: "#667eea" }}></i>
                            My Job Postings
                        </h5>
                        <div className="row">
                            {jobs.length === 0 && (
                                <div className="col-12">
                                    <div className="modern-card fade-in text-center py-4" style={{
                                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(17, 153, 142, 0.1) 100%)",
                                        border: "2px dashed rgba(102, 126, 234, 0.3)"
                                    }}>
                                        <i className="bi bi-info-circle me-2" style={{ fontSize: "24px", color: "#667eea" }}></i>
                                        <p className="mb-0 mt-2">No jobs posted yet. Create your first job above!</p>
                                    </div>
                                </div>
                            )}
                            {jobs.map((j) => (
                                <div key={j._id} className="col-md-6 mb-3 fade-in">
                                    <div className="modern-card h-100" style={{
                                        background: "white",
                                        borderLeft: "4px solid transparent",
                                        borderImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1",
                                        transition: "all 0.3s ease"
                                    }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
                                                    <i className="bi bi-bookmark-fill me-2" style={{ color: "#667eea" }}></i>
                                                    {j.title}
                                                </h6>
                                            </div>
                                            <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                {j.description}
                                            </p>
                                            <div className="d-flex flex-wrap gap-1 mb-3">
                                                {j.skills?.map((skill, idx) => (
                                                    <span key={idx} className="badge-modern" style={{
                                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        color: "white"
                                                    }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="modern-btn btn-gradient-primary flex-grow-1"
                                                    onClick={() => viewApplicants(j)}
                                                    style={{ padding: "10px 20px", fontSize: "13px" }}
                                                >
                                                    <i className="bi bi-people-fill me-2"></i>
                                                    View Applicants
                                                </button>
                                                <button
                                                    className="modern-btn btn-gradient-accent"
                                                    onClick={() => deleteJob(j._id)}
                                                    style={{ padding: "10px 20px", fontSize: "13px" }}
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reviewed Candidates Section with Toggle */}
                        {(shortlistedApps.length > 0 || rejectedApps.length > 0) && (
                            <>
                                <div className="mt-5 mb-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 d-flex align-items-center" style={{
                                        color: showRejected ? "#f5576c" : "#11998e",
                                        fontWeight: "700"
                                    }}>
                                        <i className={`bi ${showRejected ? 'bi-x-circle-fill' : 'bi-star-fill'} me-2`}
                                            style={{ color: showRejected ? "#f5576c" : "#11998e" }}></i>
                                        {showRejected ? `Rejected Candidates (${rejectedApps.length})` : `Shortlisted Candidates (${shortlistedApps.length})`}
                                    </h5>
                                    <label className="modern-toggle">
                                        <input
                                            type="checkbox"
                                            checked={showRejected}
                                            onChange={(e) => setShowRejected(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="modern-card p-0 fade-in">
                                    <div className="table-responsive">
                                        <table className="modern-table">
                                            <thead style={{
                                                background: showRejected ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                                color: "white"
                                            }}>
                                                <tr>
                                                    <th style={{ padding: "15px", borderBottom: "none" }}>
                                                        <i className="bi bi-person-fill me-2"></i>Candidate
                                                    </th>
                                                    <th style={{ padding: "15px", borderBottom: "none" }}>
                                                        <i className="bi bi-envelope me-2"></i>Email
                                                    </th>
                                                    <th style={{ padding: "15px", borderBottom: "none" }}>
                                                        <i className="bi bi-briefcase me-2"></i>Job Applied
                                                    </th>
                                                    <th style={{ padding: "15px", borderBottom: "none" }}>
                                                        <i className="bi bi-graph-up me-2"></i>Match Score
                                                    </th>
                                                    <th style={{ padding: "15px", borderBottom: "none" }}>
                                                        <i className="bi bi-calendar me-2"></i>Reviewed Date
                                                    </th>
                                                    <th style={{ padding: "15px", borderBottom: "none", textAlign: "center" }}>
                                                        <i className="bi bi-flag-fill me-2"></i>Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(showRejected ? rejectedApps : shortlistedApps).length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-5 text-muted">
                                                            <i className={`bi ${showRejected ? 'bi-inbox' : 'bi-inbox'} me-2`} style={{ fontSize: "24px" }}></i>
                                                            <div className="mt-2">
                                                                No {showRejected ? 'rejected' : 'shortlisted'} candidates yet
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    (showRejected ? rejectedApps : shortlistedApps).map((app, index) => (
                                                        <tr key={app._id} style={{
                                                            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                                                            transition: "all 0.2s"
                                                        }}>
                                                            <td style={{ padding: "15px", fontWeight: "600" }}>
                                                                <i className={`bi ${showRejected ? 'bi-person-x-fill' : 'bi-person-check-fill'} me-2`}
                                                                    style={{ color: showRejected ? "#dc3545" : "#11998e" }}></i>
                                                                {app.candidateId?.name}
                                                            </td>
                                                            <td style={{ padding: "15px", color: "#6c757d" }}>
                                                                {app.candidateId?.email}
                                                            </td>
                                                            <td style={{ padding: "15px", fontWeight: "500" }}>
                                                                {app.jobId?.title}
                                                            </td>
                                                            <td style={{ padding: "15px" }}>
                                                                {app.matchScore ? (
                                                                    <span className={`badge ${showRejected ? 'bg-danger' : 'bg-success'}`}
                                                                        style={{ fontSize: "13px", padding: "6px 12px" }}>
                                                                        {app.matchScore}%
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted">N/A</span>
                                                                )}
                                                            </td>
                                                            <td style={{ padding: "15px", color: "#6c757d" }}>
                                                                {new Date(app.reviewedAt).toLocaleDateString()}
                                                            </td>
                                                            <td style={{ padding: "15px", textAlign: "center" }}>
                                                                <span className={`badge ${showRejected ? 'bg-danger' : 'bg-success'}`}
                                                                    style={{ fontSize: "12px", padding: "6px 12px" }}>
                                                                    <i className={`bi ${showRejected ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                                                                    {showRejected ? 'Rejected' : 'Shortlisted'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </>
                        )}
                    </>
                )}

                {user?.role === "candidate" && (
                    <>
                        {/* Candidate View - Resume Upload First, Then Jobs */}

                        {/* Applied Jobs Section */}
                        {candidates.length > 0 && candidates[0].appliedJobs?.length > 0 && (
                            <>
                                <h5 className="mt-2 mb-3 d-flex align-items-center gradient-text" style={{
                                    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontWeight: "700"
                                }}>
                                    <i className="bi bi-check-circle-fill me-2" style={{ color: "#11998e" }}></i>
                                    My Applications ({candidates[0].appliedJobs.length})
                                </h5>
                                <div className="row">
                                    {jobs.filter(j => candidates[0].appliedJobs.includes(j._id)).map((j) => (
                                        <div key={j._id} className="col-md-6 mb-3 fade-in">
                                            <div className="modern-card h-100" style={{
                                                background: "rgba(255, 255, 255, 0.9)",
                                                borderLeft: "4px solid #11998e",
                                                boxShadow: "0 4px 15px rgba(17, 153, 142, 0.1)"
                                            }}>
                                                <div className="card-body p-0">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
                                                            <i className="bi bi-briefcase-fill me-2" style={{ color: "#11998e" }}></i>
                                                            {j.title}
                                                        </h6>
                                                        <span className="badge-modern" style={{
                                                            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                                            color: "white"
                                                        }}>Applied ✓</span>
                                                    </div>
                                                    <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                        {j.description}
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {j.skills?.map((skill, idx) => (
                                                            <span key={idx} className="badge-modern" style={{
                                                                background: "rgba(17, 153, 142, 0.1)",
                                                                color: "#11998e",
                                                                border: "1px solid rgba(17, 153, 142, 0.2)"
                                                            }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Available Jobs Section */}
                        {/* Available Jobs Section */}
                        <h5 className="mt-4 mb-3 d-flex align-items-center gradient-text" style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "700"
                        }}>
                            <i className="bi bi-search me-2" style={{ color: "#667eea" }}></i>
                            Available Jobs
                        </h5>
                        {jobs.length === 0 && (
                            <div className="modern-card fade-in text-center py-4" style={{
                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(17, 153, 142, 0.1) 100%)",
                                border: "2px dashed rgba(102, 126, 234, 0.3)"
                            }}>
                                <i className="bi bi-info-circle me-2" style={{ fontSize: "24px", color: "#667eea" }}></i>
                                <p className="mb-0 mt-2">No jobs available at the moment. Check back later!</p>
                            </div>
                        )}
                        <div className="row">
                            {jobs.map((j) => {
                                const hasApplied = candidates[0]?.appliedJobs?.includes(j._id);
                                return (
                                    <div key={j._id} className="col-md-6 mb-3 fade-in">
                                        <div className="modern-card h-100" style={{
                                            background: "white",
                                            borderLeft: "4px solid transparent",
                                            borderImage: hasApplied ?
                                                "linear-gradient(135deg, #11998e 0%, #38ef7d 100%) 1" :
                                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1",
                                            transition: "all 0.3s ease"
                                        }}>
                                            <div className="card-body p-0">
                                                <h6 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                                                    <i className="bi bi-bookmark-fill me-2" style={{
                                                        color: hasApplied ? "#11998e" : "#667eea"
                                                    }}></i>
                                                    {j.title}
                                                </h6>
                                                <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                    {j.description}
                                                </p>
                                                <div className="d-flex flex-wrap gap-1 mb-3">
                                                    {j.skills?.map((skill, idx) => (
                                                        <span key={idx} className="badge-modern" style={{
                                                            background: hasApplied ?
                                                                "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" :
                                                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                            color: "white"
                                                        }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    className={`modern-btn w-100 ${hasApplied ? 'btn-gradient-secondary' : 'btn-gradient-primary'}`}
                                                    onClick={() => applyToJob(j._id)}
                                                    disabled={!candidates.length || hasApplied}
                                                    style={{ opacity: (!candidates.length || hasApplied) ? 0.8 : 1 }}
                                                >
                                                    {!candidates.length ? (
                                                        <>
                                                            <i className="bi bi-upload me-2"></i>
                                                            Upload Resume First
                                                        </>
                                                    ) : hasApplied ? (
                                                        <>
                                                            <i className="bi bi-check-circle-fill me-2"></i>
                                                            Applied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-send-fill me-2"></i>
                                                            Apply Now
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Resume Upload Section - After Available Jobs */}
                        <div className="row mt-4">
                            <div className="col-md-8 offset-md-2">
                                {candidates.length === 0 ? (
                                    <>
                                        <div className="alert alert-warning mb-3">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <strong>Upload your resume to start applying for jobs!</strong>
                                        </div>
                                        <CandidateUpload refresh={loadData} />
                                    </>
                                ) : (
                                    <div className="alert alert-success">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Your resume is uploaded! You can now apply to jobs above.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {user?.role === "admin" && (
                    <>
                        {/* Admin View */}
                        <div className="alert alert-warning">
                            <strong>Admin Mode:</strong> You have full access to all jobs and candidates.
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <JobForm refresh={loadData} />
                            </div>
                            <div className="col-md-6">
                                <CandidateUpload refresh={loadData} />
                            </div>
                        </div>

                        <h5 className="mt-4">All Job Postings</h5>
                        <ul className="list-group mb-4">
                            {jobs.map((j) => (
                                <li
                                    key={j._id}
                                    className="list-group-item d-flex justify-content-between align-items-start"
                                >
                                    <div>
                                        <b>{j.title}</b>
                                        <div style={{ fontSize: "14px" }}>{j.description}</div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteJob(j._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {jobs.length > 0 && candidates.length > 0 && (
                            <>
                                <div className="card p-3 mb-3">
                                    <h5>Match Candidates</h5>
                                    <MatchTable
                                        jobId={jobs[0]._id}
                                        candidates={candidates}
                                        refresh={loadData}
                                    />
                                </div>

                                <MatchResult jobId={jobs[0]._id} />
                            </>
                        )}
                    </>
                )}

                {/* Job Applicants Modal */}
                {selectedJob && (
                    <JobApplicants
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </div>
        </div >
    );
}

export default Dashboard;
