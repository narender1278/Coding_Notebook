import { Habit, HabitType, HabitLog } from "../models/Habits.js";

// =====================================================
// GET ALL HABITS
// =====================================================
export const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find().populate("HabitType");
    res.status(200).json({
      message: "Habits fetched successfully",
      data: habits
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================================
// GET ALL HABIT TYPES
// =====================================================
export const getAllHabitTypes = async (req, res) => {
  try {
    const types = await HabitType.find().sort();
    res.status(200).json(types);
  } catch (error) {
    console.error("Error fetching habit types:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================================
// POST HABIT TYPE
// =====================================================
export const postHabitType = async (req, res) => {
  try {
    const { HabitType: habitTypeName } = req.body;  // rename

    const newType = new HabitType({
      HabitType: habitTypeName,
    });

    await newType.save();

    res.status(201).json({ message: "Habit Type created successfully" });
  } catch (error) {
    console.error("Error creating Habit Type:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// =====================================================
// POST HABIT
// =====================================================
export const postHabit = async (req, res) => {
  try {
    const { Habit: habitName, HabitType: habitTypeId } = req.body;

    const newHabit = new Habit({
      Habit: habitName,
      HabitType: habitTypeId, // must be ObjectId
    });

    await newHabit.save();

    res.status(201).json({ message: "Habit created successfully" });
  } catch (error) {
    console.error("Error creating Habit:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Habit.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting Habit:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteHabitType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await HabitType.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Habit Type not found" });
    }

    res.status(200).json({ message: "Habit Tyoe deleted successfully" });
  } catch (error) {
    console.error("Error deleting Habit:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const habitToggle = async (req, res) => {
  try {
    const { userId, habitId, completed, backendDate } = req.body;

    if (!userId || !habitId || !backendDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if record exists
    const existing = await HabitLog.findOne({
      userId,
      Habit: habitId,
      date: backendDate,
    });

    if (existing) {
      existing.completed = completed;
      await existing.save();

      return res.status(200).json({
        message: "Habit updated successfully",
        data: existing,
      });
    }

    // Create new entry
    const newLog = await HabitLog.create({
      userId,
      Habit: habitId,
      // HabitType is required → lookup from Habit collection
      HabitType: req.body.habitTypeID || null, // optional fallback
      completed,
      date: backendDate,
    });

    return res.status(201).json({
      message: "Habit log created successfully",
      data: newLog,
    });
  } catch (error) {
    console.error("Error in habitToggle", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const habitsSectionToggle = async (req, res) => {
  try {
    const { userId, habitTypeID, habitIds, completed, backendDate } = req.body;

    if (!userId || !habitTypeID || !habitIds || habitIds.length === 0 || !backendDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ops = habitIds.map((habitId) => ({
      updateOne: {
        filter: {
          userId,
          Habit: habitId,
          date: backendDate,
        },
        update: {
          $set: {
            userId,
            HabitType: habitTypeID,
            Habit: habitId,
            completed,
            date: backendDate,
          },
        },
        upsert: true,
      },
    }));

    await HabitLog.bulkWrite(ops);

    return res.status(200).json({
      message: "Section habits updated successfully",
    });
  } catch (error) {
    console.error("Error in habitsSectionToggle", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllHabitsLog = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await HabitLog.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching habits log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
