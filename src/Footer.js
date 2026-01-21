import React from 'react';

const Footer = () => {
    return (
        <footer className="fade-in mt-auto" style={{
            background: "linear-gradient(to right, #2c3e50, #4ca1af)",
            color: "white",
            padding: "30px 0",
            position: "relative",
            zIndex: 10
        }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1">
                            <span style={{ fontSize: "24px", marginRight: "10px" }}>🎯</span>
                            AI Recruitment Platform
                        </h5>
                        <p className="text-white-50 small mb-0">
                            Connecting talent with opportunity through AI.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">

                        <p className="text-white-50 small mb-0">
                            &copy; {new Date().getFullYear()} All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
