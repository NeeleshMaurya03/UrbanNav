import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// ✅ Register Chart.js Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AIImpactGraph = () => {
  const [impactData, setImpactData] = useState([80, 70, 65, 60, 55]);

  useEffect(() => {
    fetch("http://localhost:5000/ai-impact") // Replace with actual API
      .then((res) => res.json())
      .then((data) => setImpactData(data.impact))
      .catch((err) => console.error("❌ Error fetching AI impact data:", err));
  }, []);

  const data = {
    labels: ["5 min ago", "4 min ago", "3 min ago", "2 min ago", "Now"],
    datasets: [
      {
        label: "AI Efficiency (%)",
        data: impactData,
        borderColor: "#007FFF",
        backgroundColor: "rgba(0, 127, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 AI Impact Analysis</h2>
      <p className="text-gray-600 mb-4">Live impact analysis of AI-driven traffic system.</p>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
    </div>
  );
};

export default AIImpactGraph;
