import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Add timeout to prevent infinite loading
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/me`, {
                withCredentials: true,
                timeout: 5000 // 5 seconds timeout
            });
            setUser(res.data.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Login failed",
            };
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/auth/signup`,
                { name, email, password, role },
                { withCredentials: true }
            );
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || "Signup failed",
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
