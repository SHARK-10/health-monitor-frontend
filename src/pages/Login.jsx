import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float">🏥</div>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Login to your Health Monitor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-900/50 text-white placeholder-gray-500 focus:bg-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-900/50 text-white placeholder-gray-500 focus:bg-gray-900"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-gray-900 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
