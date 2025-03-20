from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
import subprocess
import sys
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import easyocr

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# ✅ Set up folders for processed images
UPLOAD_FOLDER = "static/processed_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Load YOLO models
vehicle_model = YOLO("yolov8n.pt")  # Ensure this model exists for vehicle detection
plate_model = YOLO("license_plate_detector.pt")  # License plate detection model

# ✅ Initialize OCR
reader = easyocr.Reader(["en"])

# ✅ Complaints Storage
complaints_db = []  # Using a list for now, can be replaced with a database later


# 🚦 **Traffic Analysis API**
@app.route("/analyze-traffic-image", methods=["POST"])
def analyze_traffic_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    # ✅ Run YOLO vehicle detection
    results = vehicle_model(img)
    vehicles = {"car": 0, "bus": 0, "truck": 0, "bike": 0}
    total_vehicles = 0

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = vehicle_model.names[class_id]

            if class_name in vehicles:
                vehicles[class_name] += 1
                total_vehicles += 1

            # ✅ Draw bounding box
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # ✅ Calculate estimated time for signal based on vehicle density
    estimated_time = (
        (vehicles["car"] * 2) +
        (vehicles["bike"] * 1) +
        (vehicles["bus"] * 3) +
        (vehicles["truck"] * 3)
    )
    estimated_time = max(20, min(estimated_time, 90))  # Keep between 20-90 seconds

    # ✅ Save processed image
    processed_path = os.path.join(UPLOAD_FOLDER, filename)
    cv2.imwrite(processed_path, img)

    return jsonify({
        "totalVehicles": total_vehicles,
        "vehicles": vehicles,
        "signalTime": estimated_time,
        "processedImage": f"http://localhost:5000/static/processed_images/{filename}"
    })


# 🚘 **Number Plate Detection API**
@app.route("/analyze-number-plate", methods=["POST"])
def analyze_number_plate():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # ✅ Load image
    img = cv2.imread(file_path)
    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    # ✅ Run YOLO Number Plate Detection
    results = plate_model(img)
    plates_detected = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = plate_model.names[class_id]

            # ✅ Check if detected class is a number plate
            if "plate" in class_name.lower():
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                plate_region = img[y1:y2, x1:x2]

                # ✅ Apply OCR for number plate recognition
                ocr_result = reader.readtext(plate_region, detail=0)
                plate_text = " ".join(ocr_result)

                if plate_text:
                    plates_detected.append(plate_text)

                # ✅ Draw bounding box
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(img, plate_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    # ✅ Save processed image
    processed_path = os.path.join(UPLOAD_FOLDER, filename)
    cv2.imwrite(processed_path, img)

    # return jsonify({
    #     "plates": plates_detected,
    #     "processedImage": f"http://localhost:5000/static/processed_images/{filename}"
    # })

    return jsonify({
    "plates": plates_detected,  
    "processedImage": f"http://localhost:5000/static/processed_images/{filename}"
})


# 🏙️ **Traffic Simulation API**
@app.route("/run-simulation", methods=["POST"])
def run_traffic_simulation():
    simulation_script = "traffic_simulation.py"  # Ensure this file exists
    try:
        subprocess.Popen([sys.executable, simulation_script], cwd=os.getcwd())  # Runs asynchronously
        return jsonify({"message": "Traffic simulation started successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Simulation failed: {str(e)}"}), 500


# 📝 **Public Complaints API**
@app.route("/public-complaints", methods=["GET", "POST"])
def complaints_route():
    if request.method == "POST":
        data = request.json
        if not data or "message" not in data:
            return jsonify({"error": "Message field is required"}), 400

        complaints_db.append(data["message"])  # Store complaints
        return jsonify({"message": "Complaint submitted successfully"}), 201

    return jsonify({"complaints": complaints_db})


# 🔥 **Serve Processed Images**
@app.route("/static/processed_images/<filename>")
def get_processed_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# 🚦 Sample Dynamic Data (Replace this with real-time data from analysis)
traffic_data = {
    "cars": 50,
    "bikes": 30,
    "buses": 10,
    "trucks": 5
}

@app.route("/traffic-data", methods=["GET"])
def get_traffic_data():
    return jsonify(traffic_data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)


@app.route("/ai-impact", methods=["GET"])
def get_ai_impact():
    """Returns AI impact analysis data"""
    return jsonify({"impact": [80, 70, 65, 60, 55]})  # Replace with real-time data

@app.route("/traffic-flow", methods=["GET"])
def get_traffic_flow():
    """Returns traffic flow data over the last few minutes"""
    return jsonify({"flow": [50, 45, 40, 35, 30]})  # Replace with real-time data

    
# ✅ **Run Flask App**
if __name__ == "__main__":
    app.run(debug=True, port=5000)
