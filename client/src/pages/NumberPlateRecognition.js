import React, { useState } from "react";
import { analyzeNumberPlate } from "../api/traffic";

const NumberPlateRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plateResult, setPlateResult] = useState(null);

  // 📸 Handle Image Upload & Analysis
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIsAnalyzing(true);
      setPlateResult(null);

      // ✅ Send image to backend for analysis
      const response = await analyzeNumberPlate(file);
      setPlateResult(response || {}); // ✅ Prevents "undefined" error
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="ml-72 p-10 bg-gray-100 min-h-screen transition-all">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">🚘 Number Plate Recognition</h1>

      {/* 📸 Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">📸 Upload Vehicle Image</h3>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mt-3" />

        {/* 🖼️ Show Uploaded Image */}
        {selectedImage && (
          <img src={selectedImage} alt="Uploaded" className="mt-4 w-full max-w-md rounded-lg shadow-md" />
        )}

        {/* ⏳ Show Analysis Status */}
        {isAnalyzing && <p className="mt-4 text-gray-600 animate-pulse">🔍 Analyzing number plate...</p>}

        {/* ✅ Show AI Analysis Results */}
        {plateResult && !isAnalyzing && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-md animate-fade-in">
            {plateResult.plates && plateResult.plates.length > 0 ? (
              <>
                <h4 className="text-lg font-semibold text-gray-900">🔢 Detected Plate:</h4>
                <p className="text-xl font-bold text-gray-800 bg-white p-2 rounded-md shadow">
                  {plateResult.plates[0]}
                </p>

                {/* Show Processed Image */}
                {plateResult.processedImage && (
                  <img
                    src={plateResult.processedImage}
                    alt="Detected Plate"
                    className="mt-4 w-full max-w-lg rounded-lg shadow-md"
                  />
                )}
              </>
            ) : (
              <p className="text-red-500">❌ No number plate detected.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberPlateRecognition;
