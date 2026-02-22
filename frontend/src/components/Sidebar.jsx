import { Link } from "react-router";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

export default function Sidebar({ closeSidebar = () => {} }) {
    const user = useSelector((state) => state.user);
    console.log(user);
  return (
    <aside className="w-[260px] h-full border-r bg-gray-50 overflow-y-auto flex flex-col">
      
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={closeSidebar}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Logo */}
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-md"></div>
        <h1 className="font-semibold text-lg">EarlyBird</h1>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1 text-sm flex-1">

        <Section title="GENERAL">
          <Link to="/home" onClick={closeSidebar}><MenuItem icon="🏠" text="Dashboard" /></Link>
          <Link to="/notes" onClick={closeSidebar}><MenuItem icon="📝" text="Notes" /></Link>
          <MenuItem icon="📚" text="Categories" />
        </Section>

        <Section title="PRODUCTIVITY">
          <Link to="/dailyPlanner" onClick={closeSidebar}><MenuItem icon="📅" text="Daily Planner" /></Link>
          <MenuItem icon="💪" text="Jym Tracker" />
          <Link to="/financePLanner" onClick={closeSidebar}><MenuItem icon="💰" text="Finance" /></Link>
        </Section>

      </nav>

      {/* User */}
      <Link to="/profile" onClick={closeSidebar}>
        <div className="mt-auto p-4 border-t bg-gray-100 flex items-center gap-3">
          <Avatar name={user.name ? user.name : user.email} size={40} />
          <div>
            <p className="font-medium">Narender</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </Link>

    </aside>
  );
}

// Helper Components
function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h2 className="text-[11px] font-semibold text-gray-500 mb-1">{title}</h2>
      <div className="space-y-[2px]">{children}</div>
    </div>
  );
}

function MenuItem({ icon, text }) {
  return (
    <button
      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition"
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
