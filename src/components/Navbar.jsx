import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `font-medium transition ${
      isActive(path)
        ? "text-primary border-b-2 border-primary pb-1"
        : "text-gray-700 hover:text-primary"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          🏥 Health Monitor
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">
                Hi, {user.name}
              </span>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/meals" className={linkClass("/meals")}>
                Meals
              </Link>
              <Link to="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-danger text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
