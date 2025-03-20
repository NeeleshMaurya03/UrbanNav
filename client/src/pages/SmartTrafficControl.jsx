import React, { useState } from "react";
import { analyzeTrafficImage, runTrafficSimulation } from "../api/traffic";
import AIImpactGraph from "../components/AIImpactGraph";
import TrafficFlowGraph from "../components/TrafficFlowGraph";

const SmartTrafficControl = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 📸 Handle Image Upload & AI Analysis
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIsAnalyzing(true);
      setResult(null);

      // Send image to backend for AI analysis
      const response = await analyzeTrafficImage(file);
      
      setIsAnalyzing(false);
      setResult(response || { error: "Failed to analyze image" });
    }
  };

  // 🚦 Run Traffic Simulation
  const handleRunSimulation = async () => {
    const response = await runTrafficSimulation();
    if (response) {
      alert("🚦 Traffic simulation started!");
    }
  };

  return (
    <div className="ml-72 p-10 bg-gray-100 min-h-screen transition-all">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
        🚦 Smart Traffic Control
      </h1>

      {/* Run Simulation Button */}
      <button
        onClick={handleRunSimulation}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg text-lg hover:bg-gray-800 transition animate-bounce"
      >
        ▶️ Run Traffic Simulation
      </button>

      {/* Image Upload for AI-Based Traffic Analysis */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">📸 Upload Traffic Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-3"
        />

        {/* Show Uploaded Image */}
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Uploaded"
            className="mt-4 w-full max-w-md rounded-lg shadow-md transform transition duration-500 hover:scale-105"
          />
        )}

        {/* Show "Analyzing..." message */}
        {isAnalyzing && <p className="mt-4 text-gray-600 animate-pulse">🔍 Analyzing image, please wait...</p>}

        {/* Display AI Analysis Results */}
        {result && !isAnalyzing && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-md animate-fade-in">
            {result.error ? (
              <p className="text-red-500">❌ {result.error}</p>
            ) : (
              <>
                <h4 className="text-lg font-semibold text-gray-900">🚗 Vehicle Density: {result.density}</h4>
                <h4 className="text-lg font-semibold text-gray-900">⏳ Signal Time: {result.signalTime} sec</h4>
                <img src={result.processedImage} alt="Processed Traffic" 
                  className="mt-4 w-full max-w-lg rounded-lg shadow-md"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Traffic Insights Section */}
      <div className="mt-12">
  <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Real-Time Traffic Insights</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* ✅ AI Efficiency Graph */}
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-800">📈 AI Efficiency Stats</h3>
      <p className="text-gray-600 mt-2">Live impact analysis of AI-driven traffic system.</p>
      <AIImpactGraph />
    </div>
    
    {/* ✅ Traffic Flow Optimization Graph */}
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-800">🚦 Traffic Flow Optimization</h3>
      <p className="text-gray-600 mt-2">Live data on how AI is reducing congestion.</p>
      <TrafficFlowGraph />
    </div>

  </div>
</div>
    </div>
  );
};

export default SmartTrafficControl;
