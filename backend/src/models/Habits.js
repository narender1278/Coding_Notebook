import mongoose from "mongoose";

const habitTypeSchema = new mongoose.Schema(
  {
    HabitType: {
      type: String,
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

const habitSchema = new mongoose.Schema(
  {
    Habit: {
      type: String,
      required: true,
    },

    HabitType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitType",   // foreign key reference
      required: true,
    },
  },
  { timestamps: true }
);

const HabitsLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    HabitType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitType",
      required: true,
    },

    Habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
HabitsLogSchema.index({ userId: 1, Habit: 1, date: 1 }, { unique: true });

const HabitType = mongoose.model("HabitType", habitTypeSchema);
const Habit = mongoose.model("Habit", habitSchema);
const HabitLog = mongoose.model("HabitLog", HabitsLogSchema);

export { HabitType, Habit, HabitLog };


