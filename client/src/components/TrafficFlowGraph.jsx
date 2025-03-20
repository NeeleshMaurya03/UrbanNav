import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// ✅ Register Chart.js Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrafficFlowGraph = () => {
  const [trafficFlow, setTrafficFlow] = useState([50, 45, 40, 35, 30]);

  useEffect(() => {
    fetch("http://localhost:5000/traffic-flow") // Replace with your actual API
      .then((res) => res.json())
      .then((data) => setTrafficFlow(data.flow))
      .catch((err) => console.error("❌ Error fetching traffic flow data:", err));
  }, []);

  const data = {
    labels: ["5 min ago", "4 min ago", "3 min ago", "2 min ago", "Now"],
    datasets: [
      {
        label: "Traffic Flow Rate",
        data: trafficFlow,
        borderColor: "#FF5630",
        backgroundColor: "rgba(255, 86, 48, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚦 Traffic Flow Optimization</h2>
      <p className="text-gray-600 mb-4">Live data on how AI is reducing congestion.</p>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
    </div>
  );
};

export default TrafficFlowGraph;
