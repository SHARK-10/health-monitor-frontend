import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function Meals() {
  const { user } = useAuth();

  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Today's meals state
  const [todayMeals, setTodayMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loadingMeals, setLoadingMeals] = useState(true);

  // Daily target calories
  const [dailyTarget, setDailyTarget] = useState(0);

  // Meal type selection (for logging)
  const [selectedMealType, setSelectedMealType] = useState("breakfast");

  useEffect(() => {
    loadTodayMeals();
    loadDailyTarget();
  }, []);

  const loadTodayMeals = async () => {
    setLoadingMeals(true);
    try {
      const res = await api.get("/meals/today");
      setTodayMeals(res.data.meals);
      setTotals(res.data.totals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMeals(false);
    }
  };

  const loadDailyTarget = async () => {
    try {
      const res = await api.get("/health/calories");
      setDailyTarget(res.data.dailyCalories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length < 2) {
      setSearchError("Please enter at least 2 characters");
      return;
    }
    setSearchError("");
    setSearching(true);
    try {
      const res = await api.get(`/meals/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.results);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleLogMeal = async (food) => {
    try {
      await api.post("/meals", {
        mealType: selectedMealType,
        foodName: food.name,
        fdcId: food.fdcId,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      });
      // Refresh today's meals
      await loadTodayMeals();
      // Clear search results
      setSearchResults([]);
      setQuery("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not log meal");
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm("Delete this meal?")) return;
    try {
      await api.delete(`/meals/${mealId}`);
      await loadTodayMeals();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete meal");
    }
  };

  const percentOfTarget =
    dailyTarget > 0
      ? Math.min(100, Math.round((totals.calories / dailyTarget) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            🍽️ Log Your Meals
          </h1>
          <p className="text-gray-500 text-sm">
            Search foods and track your daily calorie intake.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🔍 Search Foods
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., apple, chicken, rice..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Meal Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log as:
            </label>
            <div className="flex gap-2 flex-wrap">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedMealType(type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                    selectedMealType === type
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-3 text-sm">
              {searchError}
            </div>
          )}

          {/* Search Results */}
          {searching && <LoadingSpinner text="Searching USDA database..." />}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food.fdcId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary transition"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-gray-800 truncate">
                      {food.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {food.brand && `${food.brand} · `}
                      {food.servingSize}
                      {food.servingUnit} · {food.calories} kcal · P{" "}
                      {food.protein}g · C {food.carbs}g · F {food.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleLogMeal(food)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 whitespace-nowrap"
                  >
                    + Log
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && !searching && query && (
            <p className="text-gray-500 text-sm text-center py-4">
              No results. Try a different search term.
            </p>
          )}
        </div>

        {/* Today's Meals */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              📋 Today's Meals
            </h2>
            <span className="text-sm text-gray-500">
              {todayMeals.length} {todayMeals.length === 1 ? "meal" : "meals"}
            </span>
          </div>

          {/* Calorie Progress */}
          {dailyTarget > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Calories today</span>
                <span className="font-semibold text-gray-800">
                  {totals.calories} / {dailyTarget} kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    percentOfTarget > 100
                      ? "bg-red-500"
                      : percentOfTarget > 80
                        ? "bg-yellow-500"
                        : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, percentOfTarget)}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs text-gray-500">
                <div>
                  <span className="font-semibold text-blue-600">
                    {totals.protein.toFixed(1)}g
                  </span>{" "}
                  Protein
                </div>
                <div>
                  <span className="font-semibold text-green-600">
                    {totals.carbs.toFixed(1)}g
                  </span>{" "}
                  Carbs
                </div>
                <div>
                  <span className="font-semibold text-yellow-600">
                    {totals.fat.toFixed(1)}g
                  </span>{" "}
                  Fat
                </div>
              </div>
            </div>
          )}

          {/* Meals List */}
          {loadingMeals ? (
            <LoadingSpinner text="Loading your meals..." />
          ) : todayMeals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="text-gray-500">No meals logged today yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Search above and log your first meal!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {meal.mealType}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 truncate">
                      {meal.foodName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {meal.servingSize}
                      {meal.servingUnit} · {meal.calories} kcal
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 font-bold"
                    title="Delete meal"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
