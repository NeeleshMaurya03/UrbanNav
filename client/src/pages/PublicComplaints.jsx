import React, { useState, useEffect } from "react";
import { fetchComplaints } from "../api/traffic";

const PublicComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComplaint, setNewComplaint] = useState("");

  // 🔄 Fetch complaints on component mount
  useEffect(() => {
    const getComplaints = async () => {
      const data = await fetchComplaints();
      setComplaints(data.complaints || []);
      setLoading(false);
    };

    getComplaints();
  }, []);

  // 📩 Handle Complaint Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;

    const response = await fetch("http://127.0.0.1:5000/public-complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newComplaint }),
    });

    if (response.ok) {
      const updatedComplaints = [...complaints, newComplaint];
      setComplaints(updatedComplaints);
      setNewComplaint(""); // Clear input field
    }
  };

  return (
    <div className="ml-72 p-10 bg-gray-100 min-h-screen transition-all">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
        📝 Public Complaints Portal
      </h1>

      {/* Complaint Submission Form */}
      <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📩 Submit a Complaint</h3>
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            placeholder="Describe the issue..."
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            🚀 Submit
          </button>
        </form>
      </div>

      {/* Complaints List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">📢 Recent Complaints</h2>
        {loading ? (
          <p className="text-gray-500 animate-pulse">⏳ Loading complaints...</p>
        ) : complaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map((complaint, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                <p className="text-gray-800">{complaint}</p>
                <span className="block text-gray-500 text-sm mt-2">📅 Just now</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">🚫 No complaints found</p>
        )}
      </div>
    </div>
  );
};

export default PublicComplaints;
