export default function MonthlyBreakdown({ transactions }) {

  // Sort months in descending order (newest first)
  const sortedMonths = Object.values(transactions).sort(
    (a, b) => new Date(b.month) - new Date(a.month)
  );

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  if (sortedMonths.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Monthly Breakdown</h2>
        <p className="text-gray-500 text-center py-8 text-sm">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Monthly Breakdown</h2>
      <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[280px] sm:max-h-[400px]">
        {sortedMonths.map((monthData) => {
          const balance = monthData.income - monthData.expenses;
          const balanceColor = balance >= 0 ? "text-green-600" : "text-red-600";

          return (
            <div
              key={monthData.month}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {formatMonth(monthData.month)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {monthData.transactionCount || monthData.count} txn{(monthData.transactionCount || monthData.count) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className={`text-right font-semibold text-sm sm:text-base whitespace-nowrap ${balanceColor}`}>
                  {balance >= 0 ? "+" : ""}${balance.toFixed(2)}
                </div>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Income</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 truncate">
                    ${monthData.income.toFixed(0)}
                  </p>
                </div>
                <div className="bg-red-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Expenses</p>
                  <p className="text-base sm:text-lg font-bold text-red-600 truncate">
                    ${monthData.expenses.toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {monthData.income > 0 && (
                <div className="mt-2 sm:mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Savings</span>
                    <span>
                      {(((monthData.income - monthData.expenses) / monthData.income) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        balance >= 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, ((monthData.income - monthData.expenses) / monthData.income) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
