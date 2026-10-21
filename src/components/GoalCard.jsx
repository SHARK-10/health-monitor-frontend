import { useState, useEffect } from "react";
import api from "../services/api";

const DURATIONS = [
  { value: "3weeks", label: "3 Weeks" },
  { value: "6weeks", label: "6 Weeks" },
  { value: "1year", label: "1 Year" },
];

export default function GoalCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [targetWeight, setTargetWeight] = useState("");
  const [duration, setDuration] = useState("6weeks");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    setLoading(true);
    try {
      const res = await api.get("/goals/active");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const target = parseFloat(targetWeight);
    if (!target || target < 20 || target > 500) {
      setError("Target weight must be between 20 and 500 kg");
      return;
    }

    setSaving(true);
    try {
      await api.post("/goals", { targetWeight: target, duration });
      setTargetWeight("");
      setShowForm(false);
      await loadGoal();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create goal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this goal?")) return;
    try {
      await api.delete(`/goals/${data.goal._id}`);
      await loadGoal();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
        <p className="text-gray-500 text-sm">Loading goal...</p>
      </div>
    );
  }

  const hasGoal = data?.hasGoal;

  // Formatting
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const goalTypeLabel =
    data?.goal?.goalType === "loss"
      ? "Lose"
      : data?.goal?.goalType === "gain"
        ? "Gain"
        : "Maintain";
  const goalTypeColor =
    data?.goal?.goalType === "loss"
      ? "text-blue-600"
      : data?.goal?.goalType === "gain"
        ? "text-green-600"
        : "text-gray-600";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🎯 Goal Tracking</h2>
        {hasGoal && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete Goal
          </button>
        )}
        {!hasGoal && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
          >
            {showForm ? "Cancel" : "+ Set Goal"}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="e.g., 70"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
          >
            {saving ? "Setting Goal..." : "Create Goal"}
          </button>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      )}

      {/* Goal Display */}
      {hasGoal ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={`font-semibold ${goalTypeColor}`}>
              {goalTypeLabel}{" "}
              {Math.abs(data.goal.startWeight - data.goal.targetWeight).toFixed(
                1,
              )}{" "}
              kg
            </span>
            <span className="text-sm text-gray-500">
              {data.daysRemaining} days left
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Start</div>
              <div className="text-lg font-bold text-gray-800">
                {data.goal.startWeight} kg
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Current</div>
              <div className="text-lg font-bold text-blue-700">
                {data.currentWeight} kg
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Target</div>
              <div className="text-lg font-bold text-green-700">
                {data.goal.targetWeight} kg
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-800">
              {data.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
            <div
              className={`h-3 rounded-full transition-all ${
                data.isAchieved ? "bg-green-500" : "bg-primary"
              }`}
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-500">
            Target date: {formatDate(data.goal.endDate)}
          </div>

          {data.isAchieved && (
            <div className="mt-3 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium text-center">
              🎉 Goal achieved! Congratulations!
            </div>
          )}
        </div>
      ) : (
        !showForm && (
          <p className="text-gray-500 text-sm text-center py-4">
            No active goal. Click "+ Set Goal" to start tracking.
          </p>
        )
      )}
    </div>
  );
}
