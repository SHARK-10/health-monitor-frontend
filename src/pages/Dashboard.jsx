import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import WaterCard from "../components/WaterCard";
import WeightCard from "../components/WeightCard";
import GoalCard from "../components/GoalCard";
import DietPlanCard from "../components/DietPlanCard";
import ProgressCharts from "../components/ProgressCharts";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Card */}
        <div
          className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            Here's your health snapshot for today.
          </p>
        </div>

        {loading && (
          <div className="bg-gray-800 rounded-3xl shadow-lg border border-gray-700">
            <LoadingSpinner text="Calculating your health metrics..." />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-4 rounded-3xl flex items-start gap-3 animate-fade-in-up">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">Couldn't load your health data</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* BMI Card */}
        {bmi && !loading && (
          <div
            className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Body Mass Index (BMI)
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center text-white shadow-inner flex-shrink-0"
                style={{ backgroundColor: bmi.color }}
              >
                <div className="text-center">
                  <div className="text-4xl font-black">{bmi.bmi}</div>
                  <div className="text-xs uppercase tracking-wider mt-1 opacity-80">
                    BMI
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 text-gray-900"
                  style={{ backgroundColor: bmi.color }}
                >
                  {bmi.category}
                </div>
                <p className="text-gray-300 mb-3 font-medium">{bmi.message}</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>
                    <strong className="text-gray-200">Weight:</strong>{" "}
                    {bmi.weight} kg
                  </div>
                  <div>
                    <strong className="text-gray-200">Height:</strong>{" "}
                    {bmi.height} cm
                  </div>
                  <div>
                    <strong className="text-gray-200">
                      Healthy BMI range:
                    </strong>{" "}
                    {bmi.range}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calorie Card */}
        {calories && !loading && (
          <div
            className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span> Daily Calorie Needs
            </h2>

            <div className="bg-gray-900/50 p-6 rounded-2xl mb-4 text-center border border-gray-600">
              <div className="text-5xl font-black text-orange-500">
                {calories.dailyCalories}
              </div>
              <div className="text-sm font-semibold text-gray-300 mt-1">
                kcal / day
              </div>
              <div className="text-xs text-gray-400 mt-2 font-medium">
                Activity: {calories.activityLabel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-600">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  BMR
                </div>
                <div className="text-lg font-bold text-gray-200">
                  {calories.bmr} kcal
                </div>
                <div className="text-xs text-gray-500">at rest</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-600">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  Multiplier
                </div>
                <div className="text-lg font-bold text-gray-200">
                  × {calories.multiplier}
                </div>
                <div className="text-xs text-gray-500">activity factor</div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wide">
              Recommended Macro Split
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="text-2xl font-bold text-blue-400">
                  {calories.macroSplit.protein}g
                </div>
                <div className="text-xs font-semibold text-gray-400">
                  Protein
                </div>
                <div className="text-xs text-gray-500">30%</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="text-2xl font-bold text-green-400">
                  {calories.macroSplit.carbs}g
                </div>
                <div className="text-xs font-semibold text-gray-400">Carbs</div>
                <div className="text-xs text-gray-500">40%</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="text-2xl font-bold text-yellow-400">
                  {calories.macroSplit.fat}g
                </div>
                <div className="text-xs font-semibold text-gray-400">Fat</div>
                <div className="text-xs text-gray-500">30%</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Based on Mifflin-St Jeor equation + activity multiplier
            </p>
          </div>
        )}

        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {!loading && <WaterCard />}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {!loading && <WeightCard />}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          {!loading && <GoalCard />}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          {!loading && <DietPlanCard />}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          {!loading && <ProgressCharts />}
        </div>

        {!loading && (
          <div
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
            style={{ animationDelay: "0.9s" }}
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wide">
              WHO BMI Classification
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="font-bold text-blue-400">Underweight</div>
                <div className="text-gray-500">&lt; 18.5</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="font-bold text-green-400">Normal</div>
                <div className="text-gray-500">18.5 – 24.9</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="font-bold text-yellow-400">Overweight</div>
                <div className="text-gray-500">25 – 29.9</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-2xl border border-gray-600">
                <div className="font-bold text-red-400">Obese</div>
                <div className="text-gray-500">≥ 30</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
