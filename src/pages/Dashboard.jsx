import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { user } = useAuth();
  const [bmi, setBmi] = useState(null);
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/health/bmi"), api.get("/health/calories")])
      .then(([bmiRes, calRes]) => {
        setBmi(bmiRes.data);
        setCalories(calRes.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load health data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500">
            Here's your health snapshot for today.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <LoadingSpinner text="Calculating your health metrics..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl mb-6 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">Couldn't load your health data</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* BMI Card */}
        {bmi && !loading && (
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Body Mass Index (BMI)
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: bmi.color }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{bmi.bmi}</div>
                  <div className="text-xs uppercase tracking-wider mt-1">
                    BMI
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                  style={{
                    backgroundColor: `${bmi.color}20`,
                    color: bmi.color,
                  }}
                >
                  {bmi.category}
                </div>
                <p className="text-gray-700 mb-3">{bmi.message}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>
                    <strong>Weight:</strong> {bmi.weight} kg
                  </div>
                  <div>
                    <strong>Height:</strong> {bmi.height} cm
                  </div>
                  <div>
                    <strong>Healthy BMI range:</strong> {bmi.range}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calorie Card */}
        {calories && !loading && (
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🔥 Daily Calorie Needs
            </h2>

            <div className="bg-orange-50 p-6 rounded-xl mb-4 text-center">
              <div className="text-5xl font-bold text-orange-600">
                {calories.dailyCalories}
              </div>
              <div className="text-sm text-gray-600 mt-1">kcal / day</div>
              <div className="text-xs text-gray-500 mt-2">
                Activity: {calories.activityLabel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 uppercase">BMR</div>
                <div className="text-lg font-bold text-gray-800">
                  {calories.bmr} kcal
                </div>
                <div className="text-xs text-gray-500">at rest</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 uppercase">
                  Multiplier
                </div>
                <div className="text-lg font-bold text-gray-800">
                  × {calories.multiplier}
                </div>
                <div className="text-xs text-gray-500">activity factor</div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Recommended Macro Split
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {calories.macroSplit.protein}g
                </div>
                <div className="text-xs text-gray-600">Protein</div>
                <div className="text-xs text-gray-400">30%</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {calories.macroSplit.carbs}g
                </div>
                <div className="text-xs text-gray-600">Carbs</div>
                <div className="text-xs text-gray-400">40%</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {calories.macroSplit.fat}g
                </div>
                <div className="text-xs text-gray-600">Fat</div>
                <div className="text-xs text-gray-400">30%</div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Based on Mifflin-St Jeor equation + activity multiplier
            </p>
          </div>
        )}

        {/* WHO Reference Table */}
        {!loading && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              WHO BMI Classification
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-bold text-blue-700">Underweight</div>
                <div className="text-gray-600">&lt; 18.5</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-bold text-green-700">Normal</div>
                <div className="text-gray-600">18.5 – 24.9</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="font-bold text-yellow-700">Overweight</div>
                <div className="text-gray-600">25 – 29.9</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-bold text-red-700">Obese</div>
                <div className="text-gray-600">≥ 30</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
