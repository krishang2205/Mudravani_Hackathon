from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import threading
import io
from PIL import Image

app = Flask(__name__)
#CORS(app,origins=["http://localhost:3001"])  # Enable CORS for all routes
CORS(app)
# Load Model
model_dict = pickle.load(open('C:/Users/Krishang Darji/OneDrive/Desktop/Mudravani1/model.p', 'rb'))
model = model_dict['model']

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# Labels Dictionary
labels_dict = {0: 'Hello', 1: 'Rock', 2: 'You', 3: 'Me', 4: 'I agree', 5: 'I disagree', 6: 'Goodbye', 7: 'Thankyou', 8: 'Sorry', 9: 'I Love You'}

# Initialize Text-to-Speech
engine = pyttsx3.init()
engine.setProperty('rate', 200)

def speak_text(text):
    """Speak the recognized text in a separate thread."""
    speech_thread = threading.Thread(target=lambda: (engine.say(text), engine.runAndWait()))
    speech_thread.start()

@app.route("/predict", methods=["POST","GET"])
def predict_gesture():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    # Process the image
    image = Image.open(io.BytesIO(file.read()))
    frame = np.array(image)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

    results = hands.process(frame_rgb)
    data_aux = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            x_ = [landmark.x for landmark in hand_landmarks.landmark]
            y_ = [landmark.y for landmark in hand_landmarks.landmark]
            min_x, min_y = min(x_), min(y_)

            data_aux = [(landmark.x - min_x, landmark.y - min_y) for landmark in hand_landmarks.landmark]
            data_aux = np.array(data_aux).flatten()

        if len(data_aux) == 42:
            prediction = model.predict([data_aux])
            predicted_character = labels_dict.get(int(prediction[0]), "Unknown")

            # Speak the recognized text
            speak_text(predicted_character)

            return jsonify({"prediction": predicted_character})

    return jsonify({"error": "No hand detected"}), 400

# Run Flask app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3005, debug=True)
