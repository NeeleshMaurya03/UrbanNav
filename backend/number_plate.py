import cv2
import pytesseract
import imutils
import os
import json
import numpy as np
from flask import Flask, request, jsonify

# ✅ Set Tesseract OCR path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ✅ Ensure processed images folder exists
UPLOAD_FOLDER = "static/processed_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def detect_number_plate(image):
    """ Detects and extracts number plate text from an image """
    
    # ✅ Read image from request
    image_array = np.frombuffer(image.read(), np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Image not readable"}

    image = imutils.resize(image, width=600)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edged = cv2.Canny(gray, 30, 200)

    # ✅ Find contours
    cnts, _ = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]

    plate = None
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.018 * peri, True)

        if len(approx) == 4:
            plate = approx
            break

    # ✅ If number plate is detected
    if plate is not None:
        x, y, w, h = cv2.boundingRect(plate)
        roi = gray[y:y + h, x:x + w]

        # ✅ Preprocess for OCR
        roi = cv2.resize(roi, (200, 50))
        roi = cv2.GaussianBlur(roi, (3, 3), 0)
        _, roi = cv2.threshold(roi, 128, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # ✅ Apply OCR
        plate_text = pytesseract.image_to_string(roi, config='--psm 8').strip()
        plate_text = plate_text.replace("\u2014", "").strip()  # 🔥 Fix unwanted characters

        # ✅ Draw rectangle
        cv2.drawContours(image, [plate], -1, (0, 255, 0), 3)

        # ✅ Save processed image with corrected path
        output_path = os.path.join(UPLOAD_FOLDER, "detected_plate.jpg").replace("\\", "/")
        cv2.imwrite(output_path, image)

        return {
            "plate_number": plate_text,
            "processedImage": f"http://localhost:5000/{output_path}"
        }
    
    return {"error": "No number plate detected"}


# ✅ Test the script manually
if __name__ == "__main__":
    image_path = r"C:\Users\dell\OneDrive\Desktop\traffic-management-system\test_data\car.jpg"

    if not os.path.exists(image_path):
        print(f"❌ Error: File not found at {image_path}")
    else:
        with open(image_path, "rb") as image_file:
            result = detect_number_plate(image_file)
        print(json.dumps(result, indent=2))
