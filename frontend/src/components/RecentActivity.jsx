export default function RecentActivity({ transactions, onEdit, onDelete, setModalOpen }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition w-full sm:w-auto"
        >
          + Add
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[280px] sm:max-h-[350px]">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-sm">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{t.title}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{t.category} • {t.date}</p>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                <p className={`font-semibold text-sm sm:text-base ${t.type == "1" ? "text-green-600" : "text-red-600"}`}>
                  {t.type == "1" ? "+" : "-"}${t.amount.toFixed(2)}
                </p>
                <div className="flex gap-1 sm:gap-2 text-xs">
                  <button
                    onClick={() => onEdit(t)}
                    className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100 transition"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(t.id || t._id)}
                    className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-100 transition"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}