import { useState, useEffect } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("Checking...");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => {
        setIsConnected(true);
        setStatus(`Backend OK — Database: ${res.data.database}`);
      })
      .catch((err) => {
        setIsConnected(false);
        setStatus(`Error: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="text-6xl mb-4">🏥</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Health Monitor
        </h1>
        <p className="text-gray-500 mb-6">
          AI-Based Smart Health Monitoring Application
        </p>

        <div
          className={`px-4 py-3 rounded-lg font-medium ${
            loading
              ? "bg-yellow-50 text-yellow-700"
              : isConnected
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {loading ? "⏳ Connecting..." : isConnected ? "✅" : "❌"} {status}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Frontend: <code>localhost:5173</code>
          <br />
          Backend: <code>localhost:5000</code>
        </p>
      </div>
    </div>
  );
}

export default App;
