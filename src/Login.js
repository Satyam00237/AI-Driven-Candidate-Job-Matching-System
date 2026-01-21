import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./modern.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }

        setLoading(false);
    };


    return (
        <div className="gradient-bg d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="glass-card p-5 fade-in" style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.3)" }}>
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                                }}>
                                    <i className="bi bi-person-fill text-white" style={{ fontSize: "40px" }}></i>
                                </div>
                                <h2 className="fw-bold gradient-text" style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>Welcome Back</h2>
                                <p className="text-secondary">Sign in to continue to your dashboard</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-4 modern-card" style={{ border: "none", borderLeft: "4px solid #dc3545", background: "#fff5f5" }}>
                                    <i className="bi bi-exclamation-circle-fill me-2 fs-5 text-danger"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(0,0,0,0.1)" }}>
                                            <i className="bi bi-envelope text-primary"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control modern-input border-start-0 ps-0"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{ borderRadius: "0 12px 12px 0" }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px", border: "1px solid rgba(0,0,0,0.1)" }}>
                                            <i className="bi bi-lock text-primary"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control modern-input border-start-0 ps-0"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ borderRadius: "0 12px 12px 0" }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="modern-btn btn-gradient-primary w-100 mb-4"
                                    disabled={loading}
                                    style={{ padding: "14px", fontSize: "16px", borderRadius: "12px" }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            <hr style={{ opacity: 0.1 }} />

                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">Don't have an account?</p>
                                <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: "#667eea" }}>
                                    Create Free Account

                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default Login;
