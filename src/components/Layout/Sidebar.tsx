import { useLocation, Link } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface User {
  name: string;
  profilePicture: string;
  role: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentUser: User;
}

const menuItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Apply Leave", path: "/apply-leave", icon: CalendarIcon },
  {
    name: "Leave Approval",
    path: "/leave-approval",
    icon: ClipboardDocumentCheckIcon,
  },
  { name: "Leave Balance", path: "/leave-balance", icon: ChartBarIcon },
  { name: "Notifications", path: "/notifications", icon: BellIcon },
  { name: "Team Calendar", path: "/team-calendar", icon: UserGroupIcon },
  { name: "User Roles", path: "/user-roles", icon: UserCircleIcon },
  { name: "Admin Panel", path: "/admin", icon: CogIcon },
];

const MOBILE_BREAKPOINT_QUERY = "(max-width: 768px)";

const Sidebar = ({ isOpen, setIsOpen, currentUser }: SidebarProps) => {
  const location = useLocation();

  // On narrow screens the expanded sidebar covers the page content, so
  // collapse it automatically once the user picks a destination instead of
  // leaving it open (and the page hidden behind it) until they toggle it
  // manually.
  const handleNavigate = () => {
    if (isOpen && window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } transition-width duration-300 ease-in-out bg-gradient-to-b from-primary-600 to-primary-800 text-white`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-center">
          {isOpen ? (
            <h2 className="text-xl font-bold">LMS</h2>
          ) : (
            <h2 className="text-xl font-bold">L</h2>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavigate}
                className={`${
                  isActive
                    ? "bg-primary-700 text-white"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out`}
              >
                <Icon className="h-6 w-6 mr-3" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {isOpen && (
          <div className="p-4 border-t border-primary-700">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.profilePicture}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-primary-200">{currentUser.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
