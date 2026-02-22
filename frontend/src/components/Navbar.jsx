import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/userSlice';
import { Menu } from 'lucide-react';

const LogoutButton = () => {
    const dispatch = useDispatch();
    return (
      <button
        onClick={() => {
          dispatch(logout());
          localStorage.removeItem("user");
        }}
        className="hidden sm:block px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
      >
        Log Out
      </button>
    );
  };

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          
          {/* Menu Toggle Button - Mobile/Tablet Only */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
            title="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 md:flex-none">
            <img 
              src="earlybird_logo.png" 
              alt='earlybird logo' 
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">EarlyBird</h1>
              <p className="text-xs text-gray-500">Personal Improvement</p>
            </div>
          </div>

          {/* Right Section - User & Logout */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">Welcome back</p>
              </div>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                {userInitial}
              </div>
            </div>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

            {/* Logout Button */}
            <LogoutButton />

            {/* Mobile Logout Icon Button */}
            <button
              onClick={() => {
                dispatch(logout());
                localStorage.removeItem("user");
              }}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-red-500"
              title="Logout"
            >
              ✕
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar