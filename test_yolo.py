from ultralytics import YOLO  

model = YOLO('yolov8n.pt')  # Load pre-trained YOLO model  
results = model('test_img.jpg', show=True)  # Detect objects in an image  
