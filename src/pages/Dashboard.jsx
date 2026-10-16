import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mb-6">
            This is your health dashboard. Features coming in the next days.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-2xl font-bold text-gray-800">{user?.age}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Height</p>
              <p className="text-2xl font-bold text-gray-800">
                {user?.height} cm
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-2xl font-bold text-gray-800">
                {user?.currentWeight} kg
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Coming soon:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📊 BMI Calculator</li>
              <li>🍎 Daily Calorie Target</li>
              <li>🍽️ Meal Logging</li>
              <li>💧 Water Intake Tracking</li>
              <li>⚖️ Weight Tracking</li>
              <li>📈 Progress Charts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
