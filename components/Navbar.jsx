"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BootstrapLoader from "./BootstrapLoader";

const Navbar = () => {
  const router = useRouter();

  // Function to handle Create action
  const handleCreate = async () => {
    try {
      router.push("/create");
    } catch (error) {
      console.error("Error while Create Routing:", error);
    }
  };

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom mb-4 px-4 py-3">
        <div className="container-fluid">
          {/* Brand */}
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center text-white"
          >
            <i
              className="fas fa-feather-alt fa-xl"
              style={{ color: "#1da1f2" }}
            ></i>
            <span className="ms-2">NxtLink Project</span>
          </Link>
          <div className="d-none d-sm-flex ms-auto">
            <button
              onClick={handleCreate}
              className="btn btn-primary me-2"
              style={{ fontSize: "20px", lineHeight: "1" }}
            >
              Shorten
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger ms-2"
              style={{ fontSize: "20px", lineHeight: "1" }}
            >
              Logout
            </button>
          </div>

          <div className="dropdown d-sm-none ms-auto">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Menu
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={handleCreate}>
                  Shorten
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
