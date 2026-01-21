import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Checking authentication...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
