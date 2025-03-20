import React from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const Sidebar = () => {
  return (
    <aside className="bg-secondary text-white h-screen w-64 flex flex-col p-6 fixed shadow-xl transition-all">
      {/* Profile Section */}
      <div className="text-center mb-6">
        <img
          src={profileImg}
          alt="User Avatar"
          className="w-20 h-20 mx-auto rounded-full border-4 border-gray-700 shadow-lg transition-transform hover:scale-105"
        />
        <h3 className="text-xl font-semibold mt-3">UrbanNav 🚦</h3>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link to="/" className="block py-3 px-4 rounded-lg bg-gray-800 hover:bg-primary transition">
              📊 <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/smart-traffic" className="block py-3 px-4 rounded-lg bg-gray-800 hover:bg-primary transition">
              🏙️ <span className="ml-3">Smart Traffic Control</span>
            </Link>
          </li>
          <li>
            <Link to="/number-plate" className="block py-3 px-4 rounded-lg bg-gray-800 hover:bg-primary transition">
              🚘 <span className="ml-3">Number Plate Recognition</span>
            </Link>
          </li>
          <li>
            <Link to="/complaints" className="block py-3 px-4 rounded-lg bg-gray-800 hover:bg-primary transition">
              📝 <span className="ml-3">Public Complaints</span>
            </Link>
          </li>
          <li>
            <Link to="/user" className="block py-3 px-4 rounded-lg bg-gray-800 hover:bg-primary transition">
              👤 <span className="ml-3">User Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-sm">
        &copy; 2025 UrbanNav 🚦  
      </footer>
    </aside>
  );
};

export default Sidebar;
