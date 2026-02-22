import { useEffect, useState } from "react";
import AddTransactionModal from "../components/AddTransactionModal";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";
import MonthlyBreakdown from "../components/MonthlyBreakdown";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function FinancePLanner() {

  const user = useSelector((state) => state.user);

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [yearlyTransactions, setYearlyTransactions] = useState([]);
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      if (response.status === 200) {
        const responseData = response.data.data;
        
        // If new format with currentMonth and yearlyStats
        if (responseData.currentMonth) {
          console.log("Fetched transactions (new format):", responseData);
          setTransactions(
            responseData.currentMonth.transactions.map((tx) => ({ ...tx, id: tx._id }))
          );
        } else {
          // Fallback for old format
          console.log("Fetched transactions (old format):", responseData);
          setTransactions(responseData.map((tx) => ({ ...tx, id: tx._id })));
        }
        setYearlyTransactions(responseData.yearlyStats.monthlyData.filter((month) => month.transactionCount > 0));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async (tx) => {
    // Restrict income: only 1 per month
    if (tx.type === "income") {
      const month = tx.date.slice(0, 7);

      const exists = transactions.some(
        (t) => t.type === "income" && t.date.slice(0, 7) === month && t.id !== tx.id
      );

      if (exists) {
        toast.error("You already added income for this month!");
        return;
      }
    }
    
    try {
      if (tx.id) {
        // Update existing transaction
        console.log("Updating transaction:", tx);
        const response = await api.put("/transactions", tx);
        if (response.status === 200) {
          toast.success("Transaction updated successfully!");
          setEditingTransaction(null);
        }
      } else {
        // Add new transaction
        console.log("Adding transaction:", tx);
        const response = await api.post("/transactions", { userId: user.id, ...tx });
        if (response.status === 200) {
          toast.success("Transaction added successfully!");
        }
      }
      fetchTransactions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save transaction");
    }
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await api.delete(`/transactions/${id}`);
      if (response.status === 200) {
        toast.success("Transaction deleted successfully!");
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const currentMonth = getCurrentMonth();

  // Filter transactions for current month only
  const currentMonthTransactions = transactions.filter(
    (t) => t.date.slice(0, 7) === currentMonth
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type == "1")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type == "0")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 md:p-8">
      {/* Summary Cards */}
      <DashboardCards
        balance={balance}
        income={totalIncome}
        expenses={totalExpenses}
      />

      {/* Main Content Grid - Fully Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {/* Left side - Monthly Breakdown */}
        <div className="lg:col-span-2 w-full">
          <MonthlyBreakdown transactions={yearlyTransactions} />
        </div>

        {/* Right side - Recent Activity */}
        <RecentActivity 
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={deleteTransaction}
          setModalOpen={setModalOpen}
        />
      </div>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={addTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}