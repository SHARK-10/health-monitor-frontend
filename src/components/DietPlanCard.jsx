import { useState, useEffect } from "react";
import api from "../services/api";

export default function DietPlanCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/diet-plan");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await api.post("/diet-plan/generate");
      await loadPlan();
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate plan");
    } finally {
      setGenerating(false);
    }
  };

  const goalLabel = (type) => {
    if (type === "loss") return "Weight Loss";
    if (type === "gain") return "Weight Gain";
    return "Maintain Weight";
  };

  const goalColor = (type) => {
    if (type === "loss") return "text-blue-600";
    if (type === "gain") return "text-green-600";
    return "text-gray-600";
  };

  const goalBg = (type) => {
    if (type === "loss") return "bg-blue-50 border-blue-200";
    if (type === "gain") return "bg-green-50 border-green-200";
    return "bg-gray-50 border-gray-200";
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <p className="text-gray-500 text-sm">Loading diet plan...</p>
      </div>
    );
  }

  const hasPlan = data?.hasPlan;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🍽️ Diet Plan</h2>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
        >
          {generating
            ? "Generating..."
            : hasPlan
              ? "Regenerate"
              : "+ Generate Plan"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {hasPlan ? (
        <div>
          {/* Summary */}
          <div
            className={`${goalBg(data.plan.goalType)} border p-4 rounded-xl mb-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold uppercase ${goalColor(data.plan.goalType)}`}
                >
                  {goalLabel(data.plan.goalType)}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.plan.dailyCalories} kcal / day
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p className="text-lg font-bold text-gray-800 capitalize">
                  {data.plan.duration
                    .replace("weeks", " weeks")
                    .replace("1year", "1 year")}
                </p>
              </div>
            </div>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.plan.plan.map((meal) => (
              <div
                key={meal.mealType}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{meal.mealType}</h3>
                  <span className="text-sm font-semibold text-orange-600">
                    {meal.targetCalories} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-sm font-bold text-blue-700">
                      {meal.targetProtein}g
                    </div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-sm font-bold text-green-700">
                      {meal.targetCarbs}g
                    </div>
                    <div className="text-xs text-gray-500">Carbs</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <div className="text-sm font-bold text-yellow-700">
                      {meal.targetFat}g
                    </div>
                    <div className="text-xs text-gray-500">Fat</div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Suggestions
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {meal.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="text-gray-500 mb-1">No diet plan yet.</p>
          <p className="text-sm text-gray-400">
            Set a goal first, then click "Generate Plan".
          </p>
        </div>
      )}
    </div>
  );
}
