"""
train_model.py
---------------
Generates a synthetic patient-vitals dataset and trains a Scikit-learn
RandomForestClassifier to predict a patient's health Risk Level
(LOW / MEDIUM / HIGH) from age, BMI, blood pressure, glucose level and
heart rate. This mirrors the "Enrollment Prediction" / "Education Level
Prediction" ML features from the Student Management System project, applied
to the hospital domain.

Run once to produce model.pkl, which app.py loads at request time.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

N_SAMPLES = 4000


def label_risk(age, bmi, bp, glucose, heart_rate):
    """Rule-based labeling (with some noise) used to build a realistic
    synthetic training set — mirrors how real clinical risk scoring
    weighs multiple vitals together."""
    score = 0
    score += 1 if age > 55 else (0.5 if age > 40 else 0)
    score += 1 if bmi >= 30 else (0.5 if bmi >= 25 else 0)
    score += 1 if bp >= 140 else (0.5 if bp >= 120 else 0)
    score += 1 if glucose >= 126 else (0.5 if glucose >= 100 else 0)
    score += 1 if heart_rate >= 100 or heart_rate <= 50 else 0

    # small random noise so the model has to actually learn boundaries,
    # not just memorize a deterministic rule
    score += np.random.normal(0, 0.35)

    if score >= 3:
        return "HIGH"
    elif score >= 1.3:
        return "MEDIUM"
    else:
        return "LOW"


def generate_dataset(n=N_SAMPLES):
    ages = np.random.randint(18, 90, n)
    bmis = np.round(np.random.normal(26, 5, n).clip(15, 45), 1)
    bps = np.random.randint(90, 180, n)
    glucoses = np.random.randint(70, 200, n)
    heart_rates = np.random.randint(45, 130, n)

    risk_levels = [
        label_risk(a, b, p, g, h)
        for a, b, p, g, h in zip(ages, bmis, bps, glucoses, heart_rates)
    ]

    return pd.DataFrame({
        "age": ages,
        "bmi": bmis,
        "blood_pressure": bps,
        "glucose_level": glucoses,
        "heart_rate": heart_rates,
        "risk_level": risk_levels,
    })


def main():
    print("Generating synthetic patient risk dataset...")
    df = generate_dataset()

    os.makedirs("dataset", exist_ok=True)
    df.to_csv("dataset/patient_risk_data.csv", index=False)
    print(f"Saved dataset/patient_risk_data.csv ({len(df)} rows)")

    X = df[["age", "bmi", "blood_pressure", "glucose_level", "heart_rate"]]
    y = df["risk_level"]

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_STATE, stratify=y_encoded
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        random_state=RANDOM_STATE,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"\nModel accuracy on held-out test set: {acc:.3f}\n")
    print(classification_report(y_test, preds, target_names=encoder.classes_))

    joblib.dump(model, "model.pkl")
    joblib.dump(encoder, "label_encoder.pkl")
    print("\nSaved model.pkl and label_encoder.pkl")


if __name__ == "__main__":
    main()
