import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import ratelimiter from "./middleware/rateLimiter.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001
app.use(express.json());
app.use(cors({origin: "http://localhost:5173",}));
app.use(ratelimiter);
app.use("/api/notes",notesRoutes);
connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log("The port is listening on port 5001");
    });
});