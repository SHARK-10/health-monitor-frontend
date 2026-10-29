import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function Meals() {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [todayMeals, setTodayMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loadingMeals, setLoadingMeals] = useState(true);

  const [dailyTarget, setDailyTarget] = useState(0);
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
      toast.success("Meal logged!");
      await loadTodayMeals();
      setSearchResults([]);
      setQuery("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not log meal");
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm("Delete this meal?")) return;
    try {
      await api.delete(`/meals/${mealId}`);
      toast.success("Meal deleted");
      await loadTodayMeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete meal");
    }
  };

  const percentOfTarget =
    dailyTarget > 0
      ? Math.min(100, Math.round((totals.calories / dailyTarget) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div
          className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
            🍽️ Log Your Meals
          </h1>
          <p className="text-gray-400 text-sm">
            Search foods and track your daily calorie intake.
          </p>
        </div>

        {/* Search Box */}
        <div
          className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span> Search Foods
          </h2>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 mb-4"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., apple, chicken, rice..."
              className="flex-1 px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-900/50 text-white placeholder-gray-500 focus:bg-gray-900"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-primary text-gray-900 px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Log as:
            </label>
            <div className="flex gap-2 flex-wrap">
              {MEAL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedMealType(type)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    selectedMealType === type
                      ? "bg-primary text-gray-900 shadow-md"
                      : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="bg-red-900/30 text-red-200 px-4 py-3 rounded-xl mb-3 text-sm border border-red-700">
              {searchError}
            </div>
          )}

          {searching && <LoadingSpinner text="Searching USDA database..." />}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {searchResults.map((food) => (
                <div
                  key={food.fdcId}
                  className="flex items-center justify-between p-4 border border-gray-600 bg-gray-900/50 rounded-2xl hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-bold text-gray-200 truncate">
                      {food.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {food.brand && `${food.brand} · `}
                      {food.servingSize}
                      {food.servingUnit} ·{" "}
                      <span className="font-semibold text-orange-400">
                        {food.calories} kcal
                      </span>{" "}
                      · P {food.protein}g · C {food.carbs}g · F {food.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleLogMeal(food)}
                    className="bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-gray-900 transition-all whitespace-nowrap"
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
        <div
          className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-700 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📋</span> Today's Meals
            </h2>
            <span className="text-sm font-semibold text-primary bg-primary/20 px-3 py-1 rounded-full">
              {todayMeals.length} {todayMeals.length === 1 ? "meal" : "meals"}
            </span>
          </div>

          {dailyTarget > 0 && (
            <div className="mb-6 bg-gray-900/50 p-4 rounded-2xl border border-gray-600">
              <div className="flex justify-between text-sm mb-2 font-semibold">
                <span className="text-gray-400">Calories today</span>
                <span className="text-gray-200">
                  {totals.calories} / {dailyTarget} kcal
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    percentOfTarget > 100
                      ? "bg-red-500"
                      : percentOfTarget > 80
                        ? "bg-yellow-500"
                        : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, percentOfTarget)}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs font-semibold text-gray-400">
                <div className="bg-gray-800 py-2 rounded-xl border border-gray-600">
                  <span className="text-blue-400 text-sm">
                    {totals.protein.toFixed(1)}g
                  </span>{" "}
                  Protein
                </div>
                <div className="bg-gray-800 py-2 rounded-xl border border-gray-600">
                  <span className="text-green-400 text-sm">
                    {totals.carbs.toFixed(1)}g
                  </span>{" "}
                  Carbs
                </div>
                <div className="bg-gray-800 py-2 rounded-xl border border-gray-600">
                  <span className="text-yellow-400 text-sm">
                    {totals.fat.toFixed(1)}g
                  </span>{" "}
                  Fat
                </div>
              </div>
            </div>
          )}

          {loadingMeals ? (
            <LoadingSpinner text="Loading your meals..." />
          ) : todayMeals.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/50 rounded-2xl border border-dashed border-gray-600">
              <div className="text-6xl mb-3 opacity-30">🍽️</div>
              <p className="text-gray-300 font-medium">
                No meals logged today yet.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Search above and log your first meal!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-600 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/20 px-2 py-0.5 rounded">
                        {meal.mealType}
                      </span>
                    </div>
                    <p className="font-bold text-gray-200 truncate">
                      {meal.foodName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      {meal.servingSize}
                      {meal.servingUnit} ·{" "}
                      <span className="text-orange-400">
                        {meal.calories} kcal
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white transition-all"
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
