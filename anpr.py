import cv2
import pytesseract
import imutils
import mysql.connector
from datetime import datetime

# Set Tesseract OCR path (Change if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",  # Change to your MySQL username
    password="112233",  # Change to your MySQL password
    database="TrafficDB"
)
cursor = conn.cursor()

# Load image
image = cv2.imread("car.jpg")
image = imutils.resize(image, width=600)

# Convert to grayscale & detect edges
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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
    
    # Apply OCR
    plate_text = pytesseract.image_to_string(roi, config='--psm 8').strip()
    
    if plate_text:
        print("Detected Plate:", plate_text)
        
        # Save to database
        sql = "INSERT INTO VehicleLogs (plate_number) VALUES (%s)"
        cursor.execute(sql, (plate_text,))
        conn.commit()

        print("Plate saved to database! ✅")

    # Draw rectangle
    cv2.drawContours(image, [plate], -1, (0, 255, 0), 3)
    cv2.imshow("Detected Plate", image)
    cv2.waitKey(0)

# Close DB connection
cursor.close()
conn.close()
cv2.destroyAllWindows()
