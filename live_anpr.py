import cv2
import pytesseract
import mysql.connector
import imutils
import numpy as np

# Set Tesseract OCR Path (Change if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",  # Change this
    password="112233",  # Change this
    database="TrafficDB"
)
cursor = conn.cursor()

# Open webcam (Change to video file path if needed)
cap = cv2.VideoCapture(0)  # Use 'video.mp4' for recorded footage

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Resize frame for faster processing
    frame = imutils.resize(frame, width=800)

    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to reduce noise
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge Detection
    edged = cv2.Canny(gray, 30, 200)

    # Find contours
    cnts, _ = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]

    plate = None
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.018 * peri, True)

        if len(approx) == 4:
            plate = approx
            break

    if plate is not None:
        x, y, w, h = cv2.boundingRect(plate)
        roi = gray[y:y + h, x:x + w]

        # Apply Adaptive Thresholding
        roi = cv2.adaptiveThreshold(roi, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

        # OCR Processing
        plate_text = pytesseract.image_to_string(roi, config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').strip()

        if plate_text:
            print("🚗 Detected Plate:", plate_text)

            # Save to database
            sql = "INSERT INTO VehicleLogs (plate_number) VALUES (%s)"
            cursor.execute(sql, (plate_text,))
            conn.commit()

            print("✅ Plate saved to database!")

        # Draw rectangle around detected plate
        cv2.drawContours(frame, [plate], -1, (0, 255, 0), 3)

    # Show live feed
    cv2.imshow("Live ANPR", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Close resources
cap.release()
cv2.destroyAllWindows()
cursor.close()
conn.close()
