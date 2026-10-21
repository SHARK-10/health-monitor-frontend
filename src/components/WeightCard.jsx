import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function WeightCard() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [latestRes, historyRes] = await Promise.all([
        api.get("/weight/latest"),
        api.get("/weight"),
      ]);
      setLatest(latestRes.data);
      setHistory(historyRes.data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!w || w < 20 || w > 500) {
      toast.error("Weight must be between 20 and 500 kg");
      return;
    }

    setSaving(true);
    try {
      await api.post("/weight", { weight: w });
      toast.success("Weight saved!");
      setNewWeight("");
      setShowForm(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save weight");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const changeColor =
    !latest || latest.change7d === 0
      ? "text-gray-500"
      : latest.change7d < 0
        ? "text-green-600"
        : "text-red-600";

  const changeSymbol =
    !latest || latest.change7d === 0
      ? "—"
      : latest.change7d < 0
        ? `↓ ${Math.abs(latest.change7d)} kg`
        : `↑ ${latest.change7d} kg`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">⚖️ Weight Tracking</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
        >
          {showForm ? "Cancel" : "+ Log Weight"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <>
          {/* Current + Change */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase mb-1">
                Current
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {latest?.currentWeight || "—"}{" "}
                <span className="text-lg">kg</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase mb-1">
                7-day change
              </div>
              <div className={`text-2xl font-bold ${changeColor}`}>
                {changeSymbol}
              </div>
            </div>
          </div>

          {/* Log form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 p-4 rounded-lg mb-4"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Today's weight (kg)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                  placeholder="e.g., 75.5"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Recent Entries
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {history.slice(0, 10).map((log) => (
                  <div
                    key={log._id}
                    className="flex justify-between items-center text-sm py-1 px-2 border-b border-gray-100"
                  >
                    <span className="text-gray-500">
                      {formatDate(log.date)}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {log.weight} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length === 0 && !showForm && (
            <p className="text-gray-500 text-sm text-center py-4">
              No weight entries yet. Click "+ Log Weight" to start tracking.
            </p>
          )}
        </>
      )}
    </div>
  );
}
