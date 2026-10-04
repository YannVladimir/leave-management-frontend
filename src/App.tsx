import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveApproval from "./pages/LeaveApproval";
import LeaveBalance from "./pages/LeaveBalance";
import Notifications from "./pages/Notifications";
import AdminPanel from "./pages/AdminPanel";
import TeamCalendar from "./pages/TeamCalendar";
import UserRoles from "./pages/UserRoles";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apply-leave" element={<ApplyLeave />} />
            <Route path="/leave-approval" element={<LeaveApproval />} />
            <Route path="/leave-balance" element={<LeaveBalance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/team-calendar" element={<TeamCalendar />} />
            <Route path="/user-roles" element={<UserRoles />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
