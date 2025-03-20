import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [trafficData, setTrafficData] = useState({ cars: 0, bikes: 0, buses: 0, trucks: 0 });

  // 🔄 Fetch data from backend
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const response = await fetch("http://localhost:5000/traffic-data");
        const data = await response.json();
        setTrafficData(data);
      } catch (error) {
        console.error("❌ Error fetching traffic data:", error);
      }
    };

    fetchTrafficData();

    // Auto-refresh data every 10 seconds
    const interval = setInterval(fetchTrafficData, 10000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: ["Cars", "Bikes", "Buses", "Trucks"],
    datasets: [
      {
        label: "Detected Vehicles",
        data: [trafficData.cars, trafficData.bikes, trafficData.buses, trafficData.trucks],
        backgroundColor: ["#007FFF", "#00AB55", "#FFB300", "#FF5630"],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "📊 Live Traffic Analysis" },
    },
  };

  return (
    <div className="ml-72 p-10 bg-gray-100 min-h-screen transition-all">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
        🚦 UrbanNav – AI Traffic Dashboard
      </h1>

      {/* 🚀 AI Features Overview (Now at the top) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
          <h3 className="text-xl font-semibold">🚦 Smart Traffic Control</h3>
          <p>AI optimizes traffic signals in real-time, reducing congestion by 40%.</p>
        </div>
        <div className="p-6 bg-accent text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
          <h3 className="text-xl font-semibold">🚘 Number Plate Recognition</h3>
          <p>Automatic vehicle identification for security & law enforcement.</p>
        </div>
        <div className="p-6 bg-yellow-500 text-gray-900 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
          <h3 className="text-xl font-semibold">📝 Public Complaints Portal</h3>
          <p>Citizens can report traffic violations & road issues instantly.</p>
        </div>
        <div className="p-6 bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
          <h3 className="text-xl font-semibold">🚀 AI Efficiency</h3>
          <p>Faster traffic response, less waiting time, and improved safety.</p>
        </div>
        <div className="p-6 bg-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
          <h3 className="text-xl font-semibold">🌍 Environmental Impact</h3>
          <p>Reduces carbon emissions by optimizing traffic flow.</p>
        </div>
      </div>

      {/* 📊 Live Traffic Graph (Now at the bottom) */}
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Real-Time Traffic Density</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
