import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";


const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">

      {/* Top Navigation */}
      <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="flex h-[calc(100vh-70px)] w-full">
        {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile/Tablet sidebar overlay */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={closeSidebar}
            ></div>
            {/* Mobile sidebar */}
            <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-50 md:hidden bg-white shadow-lg">
              <Sidebar closeSidebar={closeSidebar} />
            </div>
          </>
        )}

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </div>
    </div>
    </div>
  );
}

export default Layout;