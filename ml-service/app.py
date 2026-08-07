"""
app.py
------
Flask microservice that wraps the trained Scikit-learn RandomForestClassifier
and exposes it as a REST API. Called by the Spring Boot backend
(MLPredictionService) to predict a patient's health Risk Level.

Run:
    python train_model.py   # generates model.pkl (once)
    python app.py           # starts the service on port 5001
"""

import os
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.pkl"
ENCODER_PATH = "label_encoder.pkl"

model = None
encoder = None


def load_artifacts():
    global model, encoder
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        encoder = joblib.load(ENCODER_PATH)
        print("Loaded trained model and label encoder.")
    else:
        print("WARNING: model.pkl not found. Run `python train_model.py` first.")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None or encoder is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json(force=True)

    required = ["age", "bmi", "blood_pressure", "glucose_level", "heart_rate"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        features = np.array([[
            float(data["age"]),
            float(data["bmi"]),
            float(data["blood_pressure"]),
            float(data["glucose_level"]),
            float(data["heart_rate"]),
        ]])
    except (TypeError, ValueError):
        return jsonify({"error": "All fields must be numeric"}), 400

    prediction_encoded = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    risk_level = encoder.inverse_transform([prediction_encoded])[0]
    confidence = float(np.max(probabilities))

    return jsonify({
        "risk_level": risk_level,
        "confidence": round(confidence, 4),
        "probabilities": {
            cls: round(float(prob), 4)
            for cls, prob in zip(encoder.classes_, probabilities)
        }
    })


if __name__ == "__main__":
    load_artifacts()
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
