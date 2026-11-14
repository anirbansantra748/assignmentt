import { useNavigate } from 'react-router-dom';
import { Settings, Search, Bell } from 'lucide-react';

/**
 * TopBar – Top navigation bar with settings, search, and notification icons.
 *
 * Displayed at the top of the Home screen.
 */
const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-1 py-3">
      {/* Left: Settings icon */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-smooth"
        aria-label="Settings"
      >
        <Settings size={22} className="text-gray-700" />
      </button>

      {/* Right: Search + Bell icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-full hover:bg-gray-100 transition-smooth"
          aria-label="Search tasks"
        >
          <Search size={22} className="text-gray-700" />
        </button>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-smooth"
          aria-label="Notifications"
        >
          <Bell size={22} className="text-gray-700" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
