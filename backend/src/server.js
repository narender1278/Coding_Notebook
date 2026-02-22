import dotenv from "dotenv";
dotenv.config();

import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js";
import { connectDb } from "./config/db.js";
// import { enforceAuthOrUndefined } from "./middleware/authenticate.js";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173" }));
}

// app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/habits",habitRoutes);
app.use("/api/transactions", transactionRoutes);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDb().then(() => {
  app.listen(PORT, () => {
    // console.log("Audience:", process.env.AUTH0_AUDIENCE);
    // console.log("Domain:", process.env.AUTH0_DOMAIN);
    console.log(`Server is listening on port ${PORT}`);
  });
});
