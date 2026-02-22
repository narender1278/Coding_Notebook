import express from "express";
import { addTransaction, getTransactions, deleteTransaction, updateTransaction } from "../controllers/transactionControllers.js";

const router = express.Router();

router.post("/", addTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.put("/", updateTransaction);

export default router;