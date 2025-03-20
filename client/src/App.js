import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SmartTrafficControl from "./pages/SmartTrafficControl";
import NumberPlateRecognition from "./pages/NumberPlateRecognition";
import PublicComplaints from "./pages/PublicComplaints";
import UserProfile from "./pages/UserProfile";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="flex bg-background min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 transition-all">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/smart-traffic" element={<SmartTrafficControl />} />
            <Route path="/number-plate" element={<NumberPlateRecognition />} />
            <Route path="/complaints" element={<PublicComplaints />} />
            <Route path="/user" element={<UserProfile />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
