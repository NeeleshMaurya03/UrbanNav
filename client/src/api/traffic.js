const BASE_URL = "http://localhost:5000"; // ✅ Ensure backend runs on this port

// ✅ Analyze Traffic Image (Send Image to Backend for Processing)
export const analyzeTrafficImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze-traffic-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing traffic image:", error);
    return { error: "Failed to analyze image. Please try again." };
  }
};


// ✅ Analyze Number Plate (Send Image to Backend for Detection)
export const analyzeNumberPlate = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze-number-plate", {  // ✅ Correct API
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("❌ Error analyzing number plate:", error);
    return { error: "Failed to analyze number plate" };
  }
};

// ✅ Start Traffic Simulation (Trigger Backend Simulation)
export const runTrafficSimulation = async () => {
  try {
    const response = await fetch(`${BASE_URL}/run-simulation`, {
      method: "POST", // ✅ Fixed method to match backend
    });

    if (!response.ok) throw new Error("Failed to start traffic simulation");

    return await response.json();
  } catch (error) {
    console.error("❌ Error starting simulation:", error);
    return { error: error.message };
  }
};

// ✅ Fetch Complaints from Backend
export const fetchComplaints = async () => {
  try {
    const response = await fetch(`${BASE_URL}/public-complaints`, {
      method: "GET",
      headers: { "Accept": "application/json" }, // ✅ Added correct headers
    });

    if (!response.ok) throw new Error("Failed to fetch complaints");

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    return { error: error.message };
  }
};
