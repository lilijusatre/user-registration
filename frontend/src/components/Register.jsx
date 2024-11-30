import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        <div className="col-md-6 p-5 d-flex flex-column align-items-center">
          <div className="mb-5 align-self-start">
            <h1 className="text-primary zen-dots-regular">THE APP</h1>
          </div>
          <div className="flex-grow-1 d-flex align-items-center">
            <div style={{ width: "400px" }}>
              <div className="mb-4">
                <p className="text-muted mb-1">Start your journey</p>
                <h2 className="mb-4">Create your Account</h2>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Full Name</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Email</label>
                  <div className="position-relative">
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <div className="position-relative">
                    <input
                      type="password"
                      className="form-control"
                      ref={passwordRef}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        if (passwordRef.current) {
                          setShowPassword(!showPassword);
                          passwordRef.current.type =
                            passwordRef.current.type === "password"
                              ? "text"
                              : "password";
                        }
                      }}
                    >
                      <i
                        className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-4">
                  Create Account
                </button>
                <p className="text-center text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary text-decoration-none"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            background: "linear-gradient(45deg, #4e54c8, #8f94fb)",
            clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?ixlib=rb-4.0.3")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay",
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
