import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import api from "../services/api";

export default function ProgressCharts() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/trends")
      .then((res) => setTrends(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load trends"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <p className="text-gray-500 text-sm">Loading progress charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
        {error}
      </div>
    );
  }

  const hasCalorieData = trends.calories.some((d) => d.calories > 0);
  const hasWeightData = trends.weight.length > 0;
  const hasWaterData = trends.water.some((d) => d.glasses > 0);

  return (
    <>
      {/* Calorie Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📊 Calorie Balance (Last 7 Days)
        </h2>
        {hasCalorieData ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trends.calories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value} kcal`, "Calories"]}
              />
              <Bar dataKey="calories" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No meal data yet. Log meals to see your calorie trend.
          </p>
        )}
      </div>

      {/* Weight Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ⚖️ Weight Trend (Last 30 Days)
        </h2>
        {hasWeightData ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trends.weight}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value} kg`, "Weight"]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No weight entries yet. Log your weight to see the trend.
          </p>
        )}
      </div>

      {/* Water Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💧 Water Intake (Last 7 Days)
        </h2>
        {hasWaterData ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trends.water}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => [
                  name === "glasses" ? `${value} glasses` : `${value} target`,
                  name === "glasses" ? "Consumed" : "Target",
                ]}
              />
              <ReferenceLine
                y={8}
                stroke="#10b981"
                strokeDasharray="3 3"
                label="Target"
              />
              <Bar dataKey="glasses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No water logs yet. Start drinking and logging water to see your
            trend.
          </p>
        )}
      </div>
    </>
  );
}
