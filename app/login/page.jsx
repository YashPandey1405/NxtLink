"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [useSample, setUseSample] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    console.log("Login form data:", formData);
    const loginUser = await UrlService.Login(
      formData.email,
      formData.username,
      formData.password,
    );
    setData(loginUser);

    // after successful login Redirect To /home page after 5 seconds.....
    if (loginUser.success) {
      setTimeout(() => {
        router.push("/home");
      }, 3000);
    }
    setIsLoggingIn(false);
  };

  // Toggle Feature for Sample Data......
  const handleSampleToggle = (e) => {
    const checked = e.target.checked;
    setUseSample(checked);

    if (checked) {
      setFormData({
        email: "sample123@gmail.com",
        username: "sampleuser",
        password: "sampleuser",
      });
    } else {
      setFormData({
        email: "",
        username: "",
        password: "",
      });
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "25px",
          backgroundColor: "#1f1f1f",
          color: "#ffffff",
        }}
      >
        <h2 className="text-center mb-4">Log In to NxtLink</h2>
        {data && showAlert && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {data.message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowAlert(false)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={useSample}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              readOnly={useSample}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              readOnly={useSample}
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="sampleAccount"
              checked={useSample}
              onChange={handleSampleToggle}
            />
            <label className="form-check-label" htmlFor="sampleAccount">
              Use sample account
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          <Link
            href="/signup"
            className="btn btn-outline-warning w-75 mx-auto d-block mt-3"
          >
            Don’t have an account? <strong>Sign Up</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}
