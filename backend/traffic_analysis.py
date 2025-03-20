import cv2
import numpy as np
from ultralytics import YOLO

# Load YOLO model (Ensure "yolov8n.pt" exists in the backend folder)
MODEL_PATH = "yolov8n.pt"
model = YOLO(MODEL_PATH)

def analyze_traffic_image(image):
    """Detects vehicles in an uploaded image and calculates signal time."""
    file_bytes = np.frombuffer(image.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Invalid image format"}

    # Run YOLO object detection
    results = model(img)
    vehicles = {"car": 0, "bus": 0, "truck": 0, "bike": 0}

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]

            if class_name in vehicles:
                vehicles[class_name] += 1

    # Estimate signal time based on detected vehicles
    estimated_time = (
        (vehicles["car"] * 2) +
        (vehicles["bike"] * 1) +
        (vehicles["bus"] * 3) +
        (vehicles["truck"] * 3)
    )

    # Keep signal time within 20-90 seconds
    estimated_time = max(20, min(estimated_time, 90))

    return {
        "density": sum(vehicles.values()),
        "signalTime": estimated_time,
        "vehicles": vehicles
    }
