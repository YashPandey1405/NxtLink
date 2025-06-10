"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";
import Navbar from "../../components/Navbar.jsx";

export default function Home() {
  const [items, setItems] = useState([]);
  const [urlList, seturlList] = useState([]);
  const router = useRouter();

  const handleUpdate = (itemId) => {
    router.push(`/home/${itemId}`);
  };

  const handleDelete = (itemId) => {
    router.push(`/delete/${itemId}`);
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        try {
          const response = await UrlService.getAllUrls();

          setItems(response);
          seturlList(response.data);
          console.log("Fetched Request Status Code :", response?.status);
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
      <h1 className="text-center mt-3">Welcome to NxtLink Homepage Mate</h1>
      {items && (
        <div className="container my-4">
          <div className="row">
            {urlList.map((item) => (
              <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
                <div className="card h-100 shadow-sm bg-dark text-light border-warning">
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      Created By : {item.createdBy.fullname}
                    </h5>
                    <p className="card-text">
                      <strong>Username:</strong> {item.createdBy.username}{" "}
                      <br />
                      <strong>Short ID:</strong> {item.shortId} <br />
                      <strong>Description: </strong>
                      <span
                        style={{
                          color: "#40E0D0",
                          textShadow: "0 0 2px #40E0D0",
                        }}
                      >
                        {item.description}
                      </span>
                      <br />
                      <strong>Type:</strong> {item.typeURL} <br />
                      <strong>ShortUrl:</strong>{" "}
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/urls/${item.shortId}`}
                        className="text-info"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${process.env.NEXT_PUBLIC_API_URL}/urls/${item.shortId}`}
                      </a>{" "}
                      <br />
                      <strong>Visit Counts:</strong> {item.visitHistory.length}{" "}
                      <br />
                      <strong>CreatedAt: </strong>{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {item.createdBy._id === items.currentUser ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleUpdate(item._id)}
                        >
                          Update URL
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete URL
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-2 disabled"
                        >
                          Update URL
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2 disabled"
                        >
                          Delete URL
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
