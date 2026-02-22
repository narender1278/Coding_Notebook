import { useState, useEffect } from "react";
import DailyHabitCard from "../components/DailyHabitCard";
import api from "../lib/axios";

export default function DailyPlanner() {
  const [daysData, setDaysData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const typesRes = await api.get("/habits/getAllHabitTypes");
      const habitsRes = await api.get("/habits/getAllHabits");
      const logsRes = await api.get("/habits/getAllHabitsLog");

      const habitTypes = typesRes.data;
      const habitList = habitsRes.data.data;
      const logs = logsRes.data;

      //--------------------------------------------------
      // 1️⃣ Determine Start Date (latest log or 7 days ago)
      //--------------------------------------------------

      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      let startDate;

      if (logs.length > 0) {
        const latestLogDate = new Date(logs[logs.length - 1].date);
        startDate = latestLogDate > sevenDaysAgo ? latestLogDate : sevenDaysAgo;
      } else {
        startDate = sevenDaysAgo;
      }

      //--------------------------------------------------
      // 2️⃣ Build logs lookup
      //--------------------------------------------------

      const logsByDate = {};
      logs.forEach((log) => {
        if (!logsByDate[log.date]) logsByDate[log.date] = {};
        logsByDate[log.date][log.Habit] = log.completed;
      });

      //--------------------------------------------------
      // 3️⃣ Build master habit list (all habits with IDs)
      //--------------------------------------------------
      

      //--------------------------------------------------
      // 4️⃣ Generate DATE RANGE (from today -> startDate)
      //--------------------------------------------------

      const msInDay = 1000 * 60 * 60 * 24;
      const dayCount = Math.ceil((today - startDate) / msInDay) + 1;

      const daysFinal = [...Array(dayCount)].map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const formatted = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "2-digit"
        });      
        const dbDate = d.toISOString().split("T")[0];

        const habitsWithStatus = habitTypes.map((type) => {
            const filtered = habitList.filter(
              (h) => h.HabitType && h.HabitType._id === type._id
            );

            return {
              HabitType: type.HabitType,
              HabitTypeID: type._id,
              habits: filtered.map((h) => ({
                habitName: h.Habit,
                habitId: h._id,
                completed:logsByDate[dbDate]?.[h._id] || false,
              })),
            };
          });
        return {
          viewDate: formatted,
          dbDate,
          habits: habitsWithStatus,
        };
      });

      setDaysData(daysFinal);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-6 bg-gray-50 shadow-sm border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Daily Habit Tracker</h1>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        {daysData.map((day, index) => (
          <div key={index} className="mb-6 sm:mb-8 md:mb-10">
            <DailyHabitCard
              date={day.viewDate}
              dbDate={day.dbDate}
              habits={day.habits}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
