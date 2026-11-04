import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Layout = ({ children, isDarkMode, setIsDarkMode }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mockUser = {
    name: "John Doe",
    profilePicture: "https://ui-avatars.com/api/?name=John+Doe",
    role: "Manager",
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentUser={mockUser}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          user={mockUser}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
