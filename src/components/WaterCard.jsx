import { useState, useEffect } from "react";
import api from "../services/api";

export default function WaterCard() {
  const [data, setData] = useState({
    glasses: 0,
    targetGlasses: 8,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadWater();
  }, []);

  const loadWater = async () => {
    try {
      const res = await api.get("/water/today");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (amount) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await api.post("/water/add", { amount });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const percent = Math.min(100, data.percentage);
  const circleColor =
    percent >= 100 ? "#10b981" : percent >= 50 ? "#3b82f6" : "#93c5fd";

  // SVG progress circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">💧 Water Intake</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Ring */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="transform -rotate-90" width="128" height="128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={circleColor}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-800">
                {data.glasses}
              </div>
              <div className="text-xs text-gray-500">
                / {data.targetGlasses}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-700 mb-4">
              {data.glasses === 0
                ? "Start hydrating today! 💧"
                : data.glasses >= data.targetGlasses
                  ? "🎉 Goal reached! Great job!"
                  : `${data.targetGlasses - data.glasses} more glass${data.targetGlasses - data.glasses === 1 ? "" : "es"} to reach your goal`}
            </p>

            <div className="flex gap-3 justify-center md:justify-start">
              <button
                onClick={() => handleAdd(-1)}
                disabled={updating || data.glasses === 0}
                className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full font-bold text-xl hover:bg-gray-300 disabled:opacity-50"
              >
                −
              </button>
              <button
                onClick={() => handleAdd(1)}
                disabled={updating}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50"
              >
                + Add Glass
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              {Math.round(data.percentage)}% of daily goal
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
