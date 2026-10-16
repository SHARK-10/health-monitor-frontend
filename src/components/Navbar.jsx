import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-danger text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
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
