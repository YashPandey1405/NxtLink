"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";
import Navbar from "@/components/Navbar.jsx";

export default function HomeById(paramsPromise) {
  const { id } = use(paramsPromise.params);

  const [formData, setFormData] = useState({
    orignalURL: "",
    description: "",
    visibility: "Private", // default value
  });
  const [data, setData] = useState(null);
  const [Items, setItems] = useState(null);
  const [isUpdating, setisUpdating] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisUpdating(true);
    console.log("Update ShortURL Form data:", formData);
    const loginUser = await UrlService.updateUrl(
      id,
      formData.orignalURL,
      formData.description,
      formData.visibility,
    );
    setData(loginUser);

    // after successful login Redirect To /home page after 5 seconds.....
    if (loginUser.success) {
      setTimeout(() => {
        router.push("/home");
      }, 3000);
    }
    setisUpdating(false);
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        try {
          const response = await UrlService.getUrlByID(id);

          if (response?.success === false) {
            console.error("Error fetching URL by ID:", response?.message);
            router.push("/login");
            return;
          }
          setItems(response);

          console.log("Fetched Request Status Code :", response?.status);
          formData.orignalURL = response?.data.redirectURL;
          formData.description = response?.data.description;
          formData.visibility = response?.data.typeURL || "Private"; // default to Private if not set
        } catch (err) {
          console.error("Auth check failed", err);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ marginTop: "6rem" }}></div>
      <div className="container d-flex justify-content-center align-items-center mt-4">
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
          <h2 className="text-center mb-4">Update ShortURL On NxtLink</h2>

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
            {/* For The Input Of OrignalURL */}
            <div className="mb-3">
              <label htmlFor="orignalURL" className="form-label">
                Enter The Orignal URL
              </label>
              <input
                type="text"
                className="form-control"
                id="orignalURL"
                name="orignalURL"
                placeholder="Enter the Orignal URL"
                value={formData.orignalURL}
                onChange={handleChange}
                required
              />
            </div>

            {/* For description Of The URL Type */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Enter The description
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                placeholder="Enter the description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* For The Input Of Type Of The URL Visibility */}
            <div className="mb-3">
              <label htmlFor="visibility" className="form-label">
                Visibility Of URL
              </label>
              <select
                className="form-control"
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                aria-describedby="visibilityHelp"
                required
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
              <div id="visibilityHelp" className="form-text text-white">
                Choose "Public" to share with everyone , "Private" to keep it
                just for yourself.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mt-3"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
