"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BootstrapLoader from "./BootstrapLoader";

const Navbar = () => {
  const router = useRouter();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      router.push("/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <BootstrapLoader />
      <nav className="navbar navbar-expand-lg bg-dark  border-bottom mb-4 px-4 py-3 ">
        <div className="container-fluid">
          <Link
            href="/"
            className="navbar-brand"
            style={{ color: "white", display: "flex", alignItems: "center" }}
          >
            <i
              className="fas fa-feather-alt fa-xl"
              style={{ color: "#1da1f2" }}
            ></i>
            &nbsp;
            <span className="ml-3">NxtLink Project</span>
          </Link>

          <div className="d-flex ms-auto">
            <button
              onClick={handleLogout}
              className="btn btn-primary"
              style={{ fontSize: "20px", lineHeight: "1" }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
