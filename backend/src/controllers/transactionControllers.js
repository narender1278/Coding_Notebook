import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
    const data = req.body;
    try {
        const newTransaction = new Transaction(data);
        await newTransaction.save();
        res.status(200).json({
            message: "Transaction added successfully",
            data: newTransaction
        });
    }
    catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ message: "Failed to add transaction" });
    }
};

export const getTransactions = async (req, res) => {
    try {
        // Get current month in YYYY-MM format
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        // Get date 12 months ago
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoStr = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}`;

        // Fetch all transactions
        const allTransactions = await Transaction.find().sort({ date: -1 });

        // Current month transactions
        const currentMonthTransactions = allTransactions.filter(
            (t) => t.date.startsWith(currentMonth)
        );

        // Last 12 months transactions (including current month)
        const last12MonthsTransactions = allTransactions.filter(
            (t) => t.date >= oneYearAgoStr
        );

        // Compute monthly aggregates for last 12 months
        const monthlyStats = {};
        for (let i = 0; i < 12; i++) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyStats[monthKey] = {
                month: monthKey,
                income: 0,
                expenses: 0,
                balance: 0,
                transactionCount: 0
            };
        }

        // Aggregate transactions into monthly stats
        last12MonthsTransactions.forEach((tx) => {
            const monthKey = tx.date.slice(0, 7);
            if (monthlyStats[monthKey]) {
                if (tx.type === 1) {
                    monthlyStats[monthKey].income += tx.amount;
                } else {
                    monthlyStats[monthKey].expenses += tx.amount;
                }
                monthlyStats[monthKey].transactionCount += 1;
                monthlyStats[monthKey].balance = monthlyStats[monthKey].income - monthlyStats[monthKey].expenses;
            }
        });

        // Convert to array and sort by month (newest first)
        const monthlyDataArray = Object.values(monthlyStats).sort(
            (a, b) => new Date(b.month) - new Date(a.month)
        );

        // Calculate yearly totals
        const yearlyTotals = {
            totalIncome: last12MonthsTransactions
                .filter((t) => t.type === 1)
                .reduce((acc, t) => acc + t.amount, 0),
            totalExpenses: last12MonthsTransactions
                .filter((t) => t.type === 0)
                .reduce((acc, t) => acc + t.amount, 0),
        };
        yearlyTotals.totalBalance = yearlyTotals.totalIncome - yearlyTotals.totalExpenses;

        res.status(200).json({
            message: "Transactions fetched successfully",
            data: {
                currentMonth: {
                    month: currentMonth,
                    transactions: currentMonthTransactions
                },
                yearlyStats: {
                    monthlyData: monthlyDataArray,
                    totals: yearlyTotals
                },
                // allTransactions: allTransactions
            }
        });
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: "Transaction deleted" });
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Failed to delete transaction" });
    }
};

export const updateTransaction = async (req, res) => {
    const data = req.body;
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(data.id, data, { new: true });
        res.status(200).json({
            message: "Transaction updated successfully",
            data: updatedTransaction
        });

    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Failed to update transaction" });
    }
};
