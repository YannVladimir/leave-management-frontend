import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/outline";

interface User {
  name: string;
  profilePicture: string;
  role: string;
}

interface HeaderProps {
  user: User;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
}

const Header = ({
  user,
  isDarkMode,
  setIsDarkMode,
  toggleSidebar,
}: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
            Leave Management System
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.role}
              </span>
            </div>
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
