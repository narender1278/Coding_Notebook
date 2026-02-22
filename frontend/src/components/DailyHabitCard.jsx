import { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";
import { useSelector } from "react-redux";

export default function DailyHabitCard({ date, habits = [], innerRef }) {
  const user = useSelector((state) => state.user);

  /**
   * Convert date → YYYY-MM-DD for backend
   */
  const backendDate = formatDateToYYYYMMDD(date);

  function formatDateToYYYYMMDD(dateString) {
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    // Parse "Sun, Feb 8, 26"
    const [dayName, month, day, year] = dateString.match(/\w+/g);
    const fullYear = 2000 + parseInt(year); // '26' → 2026
    
    return `${fullYear}-${months[month]}-${day.padStart(2, '0')}`;
  }

  /**
   * Flatten habits safely
   */
  const flatHabits = useMemo(() => {
    if (!Array.isArray(habits)) return [];

    return habits.flatMap((group) => {
      const groupHabits = Array.isArray(group.habits) ? group.habits : [];

      return groupHabits.map((h) => ({
        ...h,
        type: group.HabitType,
        typeId: group.HabitTypeID,
      }));
    });
  }, [habits]);

  /**
   * Completion state - initialized from backend data
   */
  const [completedHabits, setCompletedHabits] = useState([]);

  // Initialize completedHabits based on actual habit.completed values
  useEffect(() => {
    const initialCompletedState = flatHabits.map(habit => habit.completed || false);
    setCompletedHabits(initialCompletedState);
    console.log(habits, "habits");
    console.log("Initial completed state:", initialCompletedState);
  }, [flatHabits]);

  /**
   * Toggle single habit
   */
  const toggleHabit = async (flatIndex, habitId, habitTypeID) => {
    const newValue = !completedHabits[flatIndex];

    // UI first
    setCompletedHabits((prev) => {
      const arr = [...prev];
      arr[flatIndex] = newValue;
      return arr;
    });

    // Backend update
    await api.post("/habits/habitToggle", {
      userId: user.id,
      habitTypeID,
      habitId,
      completed: newValue,
      backendDate,
    });
  };

  /**
   * Toggle full section
   */
  const toggleHabitSection = async (groupIndex) => {
    const group = habits[groupIndex];
    const groupHabits = Array.isArray(group?.habits) ? group.habits : [];

    // Calculate flat index range
    const startIndex = habits
      .slice(0, groupIndex)
      .reduce(
        (acc, g) => acc + (Array.isArray(g.habits) ? g.habits.length : 0),
        0
      );

    const endIndex = startIndex + groupHabits.length;

    // Check if full section already completed
    const isCompleted = groupHabits.every(
      (_, i) => completedHabits[startIndex + i] === true
    );

    // UI update
    setCompletedHabits((prev) => {
      const updated = [...prev];
      for (let i = startIndex; i < endIndex; i++) {
        updated[i] = !isCompleted;
      }
      return updated;
    });

    // Backend update
    const habitIds = groupHabits.map((h) => h.habitId);

    await api.post("/habits/habitsSectionToggle", {
      userId: user.id,
      habitTypeID: group.HabitTypeID,
      habitIds,
      completed: !isCompleted,
      backendDate,
    });
  };

  /**
   * Progress calculation
   */
  const total = flatHabits.length;
  const completedCount = completedHabits.filter(Boolean).length;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div
      ref={innerRef}
      className="w-full bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-200 mb-4 sm:mb-6 flex flex-col md:flex-row"
    >
      {/* LEFT SECTION */}
      <div className="flex-1 md:pr-6 md:w-3/4 mb-4 md:mb-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{date}</h2>

        {habits.map((group, gIndex) => {
          const groupHabits = Array.isArray(group?.habits) ? group.habits : [];

          const startIndex = habits
            .slice(0, gIndex)
            .reduce(
              (acc, g) => acc + (Array.isArray(g.habits) ? g.habits.length : 0),
              0
            );

          const isSectionChecked =
            groupHabits.length > 0 &&
            groupHabits.every((_, i) => completedHabits[startIndex + i]);

          return (
            <div
              key={group.HabitTypeID || `group-${gIndex}`}
              className="mb-4 sm:mb-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pr-2 sm:pr-3.5">
                <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {group.HabitType}
                </p>

                {groupHabits.length > 0 && (
                  <input
                    type="checkbox"
                    className="w-4 sm:w-5 h-4 sm:h-5 accent-blue-600 cursor-pointer"
                    checked={isSectionChecked}
                    onChange={() => toggleHabitSection(gIndex)}
                  />
                )}
              </div>

              {/* Habits */}
              {groupHabits.map((h, indexInGroup) => {
                const flatIndex = startIndex + indexInGroup;

                return (
                  <div
                    key={h.habitId || `habit-${gIndex}-${indexInGroup}`}
                    className="flex items-center justify-between py-2 px-2 sm:px-3 bg-gray-50 rounded-lg border border-gray-200 mb-2 sm:mb-3"
                  >
                    <span
                      className={`text-sm sm:text-base font-medium transition ${
                        completedHabits[flatIndex]
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {h.habitName}
                    </span>

                    <input
                      type="checkbox"
                      className="w-4 sm:w-5 h-4 sm:h-5 accent-blue-600 cursor-pointer flex-shrink-0"
                      checked={completedHabits[flatIndex]}
                      onChange={() =>
                        toggleHabit(
                          flatIndex,
                          h.habitId,
                          group.HabitTypeID
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

      </div>

      {/* DIVIDER */}
      <div className="w-full md:w-[1px] h-[1px] md:h-auto bg-gray-200 mx-0 md:mx-4 my-4 md:my-0" />

      {/* RIGHT SECTION - PROGRESS CIRCLE */}
      <div className="w-full md:w-1/4 flex flex-col items-center justify-center">
        <div className="relative w-20 sm:w-28 h-20 sm:h-28">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="none"
              d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
            />

            <path
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 1.01}, 100`}
              d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base sm:text-lg font-bold text-gray-800">
              {percentage}%
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">Progress</p>
      </div>
    </div>
  );
}