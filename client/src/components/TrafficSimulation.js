import React from "react";

const TrafficSimulation = () => {
  return (
    <div>
      <h2>AI Traffic Light Simulation 🚦</h2>
      <img
        src="http://127.0.0.1:5001/traffic_feed"
        alt="Traffic Simulation"
        style={{ width: "100%", height: "600px", borderRadius: "10px" }}
      />
    </div>
  );
};

export default TrafficSimulation;
