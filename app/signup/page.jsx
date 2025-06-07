"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup form data:", formData);

    const signupUser = await UrlService.SignUp(
      formData.email,
      formData.fullname,
      formData.username,
      formData.password,
    );
    setData(signupUser);

    // after successful login Redirect To /home page after 5 seconds.....
    if (signupUser.success) {
      setTimeout(() => {
        router.push("/home");
      }, 3000);
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
        <h2 className="text-center mb-4">Sign Up for NxtLink</h2>
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
            />
          </div>

          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">
              Fullname
            </label>
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
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
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            Signup
          </button>
          <Link
            href="/login"
            className="btn btn-outline-warning w-75 mx-auto d-block mt-3"
          >
            Already have an account? <strong>Log In</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}
