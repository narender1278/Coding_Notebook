import { useState, useEffect } from "react";
import api from "../lib/axios";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);

  const [habits, setHabits] = useState([]);       
  const [habitTypes, setHabitTypes] = useState([]); 

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const typesRes = await api.get("/habits/getAllHabitTypes");
      const habitsRes = await api.get("/habits/getAllHabits");

      if (typesRes && habitsRes) {
        const types = typesRes.data;
        const habitsList = habitsRes.data;

        // Group habits by HabitType (with counts needed for deletion check)
        const grouped = types.map(type => ({
          sectionId: type._id,
          section: type.HabitType,
          items: habitsList
            .filter(h => h.HabitType && h.HabitType._id === type._id)
            .map(h => ({ id: h._id, name: h.Habit }))
        }));

        setHabitTypes(types);
        setHabits(grouped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addHabitSection = async () => {
    const name = prompt("Enter new section name:");
    if (name) {
      await api.post("/habits/postHabitType", { HabitType: name });
      getData();
    }
  };

  const addHabit = async (sectionId) => {
    const name = prompt("Enter new habit name:");
    if (name) {
      await api.post("/habits/postHabit", { Habit: name, HabitType: sectionId });
      getData();
    }
  };

  // ==========================================
  // DELETE HABIT TYPE (only if no items inside)
  // ==========================================
  const deleteHabitType = async (typeId) => {
    const selected = habits.find(h => h.sectionId === typeId);

    if (selected.items.length > 0) {
      alert("This habit type contains habits. Delete habits first.");
      return;
    }

    if (window.confirm("Delete this habit type?")) {
      await api.delete(`/habits/deleteHabitType/${typeId}`);
      getData();
    }
  };

  // =========================
  // DELETE SINGLE HABIT
  // =========================
  const deleteHabit = async (habitId) => {
    if (window.confirm("Delete this habit?")) {
      await api.delete(`/habits/deleteHabit/${habitId}`);
      getData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 md:p-8 w-full">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Profile</h1>

      {/* ================= TOP CARD (Responsive) ================= */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0">
          N
        </div>

        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Narender Naidu Katta
          </h2>
          <p className="text-gray-600 text-sm sm:text-base break-all">narender@email.com</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Member since Jan 2024</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* ================= PERSONAL DETAILS LEFT ================= */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 w-full lg:max-w-2xl">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Personal Details
          </h3>
          <hr className="mb-6" />

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="text-gray-600 font-medium text-sm sm:text-base">Full Name</label>
              <input type="text" className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base focus:outline-none focus:border-blue-500" defaultValue="Narender Naidu Katta" />
            </div>

            <div>
              <label className="text-gray-600 font-medium text-sm sm:text-base">Username</label>
              <input type="text" className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base focus:outline-none focus:border-blue-500" defaultValue="narender123" />
            </div>

            <div>
              <label className="text-gray-600 font-medium text-sm sm:text-base">Phone</label>
              <input type="text" className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base focus:outline-none focus:border-blue-500" defaultValue="+91 XXXXXXXX" />
            </div>

            <div>
              <label className="text-gray-600 font-medium text-sm sm:text-base">Date of Birth</label>
              <input type="date" className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base focus:outline-none focus:border-blue-500" defaultValue="1999-05-12" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-blue-700 transition">
              Save Changes
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-xl hover:bg-gray-100 transition">
              Change Password
            </button>
          </div>
        </div>

        {/* RIGHT SIDE BUTTON (Responsive) */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 w-full lg:max-w-sm h-fit">
          <button
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-purple-700 transition"
            onClick={() => setShowModal(true)}
          >
            Update Habits List
          </button>
        </div>
      </div>

      {/* ========================= MODAL (Responsive Mobile-First) ========================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-[90vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto relative">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl hover:text-gray-800 transition"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 pr-6">Manage Habit List</h2>

            {/* Render Sections */}
            {habits.length > 0 ? (
              habits.map((section, index) => (
                <div key={index} className="mb-4 sm:mb-6 border border-gray-300 rounded-xl p-3 sm:p-4 bg-gray-50">

                  {/* SECTION HEADER */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3">
                    <p className="font-semibold text-base sm:text-lg text-gray-800">{section.section}</p>

                    <div className="flex gap-2 sm:gap-3 flex-wrap">
                      {/* ADD HABIT */}
                      <button
                        className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm font-medium transition"
                        onClick={() => addHabit(section.sectionId)}
                      >
                        + Add Habit
                      </button>

                      {/* DELETE HABIT TYPE */}
                      {section.items.length === 0 && (
                        <button
                          className="text-red-600 hover:text-red-800 underline text-xs sm:text-sm font-medium transition"
                          onClick={() => deleteHabitType(section.sectionId)}
                        >
                          Delete Type
                        </button>
                      )}
                    </div>
                  </div>

                  {/* HABITS LIST */}
                  <ul className="pl-4 list-disc text-gray-700 text-sm space-y-1">
                    {section.items.map((h) => (
                      <li key={h.id} className="flex justify-between items-center gap-2 group">
                        <span className="break-words">{h.name}</span>
                        <button
                          className="text-red-600 hover:text-red-800 text-xs underline font-medium flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => deleteHabit(h.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>

                </div>
              ))
            ) : (
              <span className="inline-flex items-center gap-1 mb-4 text-sm text-gray-600">
                Start adding habits to make tomorrow better 😄
              </span>
            )}

            <button
              onClick={addHabitSection}
              className="w-full p-2 sm:p-3 mt-4 bg-green-600 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-green-700 transition"
            >
              + Add New Section
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
