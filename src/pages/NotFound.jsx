import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <div className="text-7xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">
          Page not found. It might have been moved or deleted.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
