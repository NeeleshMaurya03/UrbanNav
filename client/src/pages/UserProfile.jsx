import React, { useState } from "react";
import profileImage from "../assets/profile.jpg";

const UserProfile = () => {
    const [user] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Traffic Analyst",
  });

  const [activity] = useState([
    { id: 1, action: "🚦 Analyzed traffic data", timestamp: "March 20, 2025 - 10:45 AM" },
    { id: 2, action: "📸 Detected vehicle number plate", timestamp: "March 19, 2025 - 03:30 PM" },
    { id: 3, action: "📝 Submitted a traffic complaint", timestamp: "March 18, 2025 - 08:15 AM" },
  ]);

  return (
    <div className="ml-72 p-10 bg-gray-100 min-h-screen transition-all">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full border-4 border-gray-700 shadow-lg"
        />
        <h3 className="text-2xl font-semibold text-gray-900 mt-4">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 text-sm mt-1">{user.role}</p>

        <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
          ✏️ Edit Profile
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">📌 Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activity.length > 0 ? (
            <ul className="space-y-4">
              {activity.map((item) => (
                <li key={item.id} className="p-3 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition">
                  <span className="text-lg">{item.action}</span>
                  <span className="block text-gray-600 text-sm">{item.timestamp}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">🚫 No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
