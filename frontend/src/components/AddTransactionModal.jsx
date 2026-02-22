import { useState, useEffect } from "react";

export default function AddTransactionModal({ isOpen, onClose, onAdd, editingTransaction = null }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type === 1 ? "income" : "expense");
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
    } else {
      setType("expense");
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !category.trim() || !date) {
      alert("Please fill all fields");
      return;
    }

    const txData = {
      type: type === 'income' ? 1 : 0,
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    if (editingTransaction) {
      txData.id = editingTransaction.id || editingTransaction._id;
    }

    onAdd(txData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[90vw] sm:max-w-[450px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-4 sm:p-6 ${type === 'income' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            {editingTransaction ? "Update your transaction details" : "Record a new transaction"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Type Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  type === "income"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💰 Income
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  type === "expense"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💸 Expense
              </button>
            </div>
            {type === "income" && (
              <p className="text-xs text-amber-600 mt-2">⚠️ Only one income per month allowed</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Salary, Groceries, Gas..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Food, Entertainment, Utilities..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base text-white font-semibold rounded-lg transition-all ${
                type === "income"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}