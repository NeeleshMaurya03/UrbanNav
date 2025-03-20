from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# 📂 Complaints storage file
COMPLAINTS_FILE = "complaints.json"

# 📌 Ensure complaints file exists
if not os.path.exists(COMPLAINTS_FILE):
    with open(COMPLAINTS_FILE, "w") as f:
        json.dump([], f)

def load_complaints():
    """Load complaints from the JSON file."""
    with open(COMPLAINTS_FILE, "r") as f:
        return json.load(f)

def save_complaints(complaints):
    """Save complaints to the JSON file."""
    with open(COMPLAINTS_FILE, "w") as f:
        json.dump(complaints, f, indent=4)

@app.route("/submit-complaint", methods=["POST"])
def submit_complaint():
    """API endpoint to submit a traffic-related complaint."""
    data = request.json
    username = data.get("username", "Anonymous")
    text = data.get("text")
    platform = data.get("platform", "Web")

    if not text:
        return jsonify({"error": "Complaint text is required"}), 400

    complaints = load_complaints()
    
    new_complaint = {
        "id": len(complaints) + 1,
        "username": username,
        "text": text,
        "platform": platform
    }

    complaints.append(new_complaint)
    save_complaints(complaints)

    return jsonify({"message": "Complaint submitted successfully!", "complaint": new_complaint}), 201

@app.route("/get-complaints", methods=["GET"])
def get_complaints():
    """API endpoint to fetch all public complaints."""
    complaints = load_complaints()
    return jsonify(complaints), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)
