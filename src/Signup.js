import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./modern.css";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "candidate",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
            formData.role
        );

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const roleInfo = {
        candidate: {
            icon: "bi-person-badge",
            title: "Job Seeker",
            desc: "Upload resume & apply",
            color: "#11998e",
            gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
        },
        recruiter: {
            icon: "bi-briefcase",
            title: "Recruiter",
            desc: "Post jobs & hire talent",
            color: "#667eea",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }
    };

    return (
        <div className="gradient-bg d-flex align-items-center justify-content-center py-5" style={{ minHeight: "100vh" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="glass-card p-4 p-md-5 fade-in" style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.3)" }}>

                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
                                    boxShadow: "0 10px 25px rgba(56, 239, 125, 0.4)"
                                }}>
                                    <i className="bi bi-rocket-takeoff-fill text-white" style={{ fontSize: "32px" }}></i>
                                </div>
                                <h2 className="fw-bold gradient-text" style={{
                                    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>Start Your Journey</h2>
                                <p className="text-secondary">Join thousands of professionals today</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-4 modern-card" style={{ border: "none", borderLeft: "4px solid #dc3545", background: "#fff5f5" }}>
                                    <i className="bi bi-exclamation-circle-fill me-2 fs-5 text-danger"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                                            <i className="bi bi-person text-secondary"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control modern-input border-start-0 ps-0"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{ borderRadius: "0 12px 12px 0" }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                                            <i className="bi bi-envelope text-secondary"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control modern-input border-start-0 ps-0"
                                            name="email"
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{ borderRadius: "0 12px 12px 0" }}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label text-muted fw-bold small text-uppercase">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                                                <i className="bi bi-lock text-secondary"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control modern-input border-start-0 ps-0"
                                                name="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: "0 12px 12px 0" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label text-muted fw-bold small text-uppercase">Confirm</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                                                <i className="bi bi-shield-lock text-secondary"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control modern-input border-start-0 ps-0"
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: "0 12px 12px 0" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase mb-3">
                                        I am joining as a...
                                    </label>
                                    <div className="row g-3">
                                        {Object.entries(roleInfo).map(([key, info]) => (
                                            <div className="col-6" key={key}>
                                                <div
                                                    className="position-relative h-100"
                                                    onClick={() => setFormData({ ...formData, role: key })}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <div
                                                        className={`card h-100 border-0 ${formData.role === key ? 'shadow-sm' : ''}`}
                                                        style={{
                                                            background: formData.role === key ? "white" : "#f8f9fa",
                                                            borderRadius: "16px",
                                                            border: formData.role === key ? `2px solid ${info.color}` : "2px solid transparent",
                                                            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                                            transform: formData.role === key ? "translateY(-5px)" : "none"
                                                        }}
                                                    >
                                                        <div className="card-body text-center p-3">
                                                            <div className="mb-2" style={{
                                                                color: formData.role === key ? info.color : "#adb5bd",
                                                                fontSize: "28px",
                                                                transition: "color 0.3s"
                                                            }}>
                                                                <i className={`bi ${info.icon}`}></i>
                                                            </div>
                                                            <h6 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>{info.title}</h6>
                                                            <small className="text-muted d-block lh-sm" style={{ fontSize: "11px" }}>{info.desc}</small>
                                                        </div>

                                                        {formData.role === key && (
                                                            <div className="position-absolute top-0 end-0 mt-2 me-2">
                                                                <i className="bi bi-check-circle-fill" style={{ color: info.color }}></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="modern-btn w-100 mb-4"
                                    disabled={loading}
                                    style={{
                                        padding: "14px",
                                        fontWeight: "600",
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                                        color: "white",
                                        border: "none"
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Setting up account...
                                        </>
                                    ) : (
                                        <>
                                            Create My Account <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            <hr style={{ opacity: 0.1 }} />

                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">Already have an account?</p>
                                <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#11998e" }}>
                                    Sign In Instead
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
