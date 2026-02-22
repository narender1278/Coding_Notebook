import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Calendar, Book, Dumbbell } from "lucide-react";


const Home = () => {
  const [financeSummary] = useState({
    income: 12000,
    expenses: 8500,
    savings: 3500,
  });

  const recentNotes = [
    { id: 1, title: "Meeting Summary", date: "2026-02-05" },
    { id: 2, title: "Workout Plan Update", date: "2026-02-04" },
    { id: 3, title: "Personal Reflection", date: "2026-02-03" },
  ];

  const tasks = [
    { id: 1, task: "Morning Jog - 5km", status: "completed" },
    { id: 2, task: "Budget Update", status: "pending" },
    { id: 3, task: "Write Daily Note", status: "pending" },
  ];

  

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full bg-gray-50 min-h-screen overflow-y-auto">

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Income */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <h2 className="text-xl font-semibold">₹{financeSummary.income}</h2>
            <span className="flex items-center text-green-600 text-sm mt-1">
              <ArrowUpRight size={16} className="mr-1" /> +4.2%
            </span>
          </div>
          <span className="p-3 bg-green-100 rounded-xl">
            <ArrowUpRight size={22} className="text-green-600" />
          </span>
        </div>

        {/* Expenses */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <h2 className="text-xl font-semibold">₹{financeSummary.expenses}</h2>
            <span className="flex items-center text-red-600 text-sm mt-1">
              <ArrowDownRight size={16} className="mr-1" /> +3.0%
            </span>
          </div>
          <span className="p-3 bg-red-100 rounded-xl">
            <ArrowDownRight size={22} className="text-red-600" />
          </span>
        </div>

        {/* Savings */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Savings</p>
            <h2 className="text-xl font-semibold">₹{financeSummary.savings}</h2>
            <span className="flex items-center text-blue-600 text-sm mt-1">
              <ArrowUpRight size={16} className="mr-1" /> +8.1%
            </span>
          </div>
          <span className="p-3 bg-blue-100 rounded-xl">
            <ArrowUpRight size={22} className="text-blue-600" />
          </span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Recent Notes */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Book className="mr-2 text-indigo-600" /> Recent Notes
          </h2>

          <ul className="space-y-3">
            {recentNotes.map((note) => (
              <li key={note.id} className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">{note.title}</span>
                <span className="text-sm text-gray-500">{note.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Calendar className="mr-2 text-orange-600" /> Today’s Tasks
          </h2>

          <ul className="space-y-3">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{t.task}</span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    t.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fitness Stats */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Dumbbell className="mr-2 text-purple-600" /> Fitness Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Workout Days</span>
              <span className="font-semibold text-gray-800">18 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calories Burned</span>
              <span className="font-semibold text-gray-800">6,400 kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Running Distance</span>
              <span className="font-semibold text-gray-800">42 km</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;