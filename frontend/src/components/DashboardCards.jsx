export default function DashboardCards({ balance, income, expenses }) {
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow border-l-4 border-blue-500">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">This Month's Balance</h3>
            <p className="text-2xl sm:text-4xl font-bold text-gray-800 mt-2 truncate">${balance.toFixed(2)}</p>
          </div>
          <span className="text-2xl sm:text-3xl flex-shrink-0">💰</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">{getCurrentMonth()}</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl shadow border-l-4 border-green-500">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">This Month's Income</h3>
            <p className="text-2xl sm:text-4xl font-bold text-green-600 mt-2 truncate">+${income.toFixed(2)}</p>
          </div>
          <span className="text-2xl sm:text-3xl flex-shrink-0">📈</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">{getCurrentMonth()}</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl shadow border-l-4 border-red-500">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">This Month's Expenses</h3>
            <p className="text-2xl sm:text-4xl font-bold text-red-600 mt-2 truncate">-${expenses.toFixed(2)}</p>
          </div>
          <span className="text-2xl sm:text-3xl flex-shrink-0">📊</span>
        </div>
        <p className="text-xs text-gray-600 mt-3">{getCurrentMonth()}</p>
      </div>
    </div>
  );
}