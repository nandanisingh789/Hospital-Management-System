package com.hms.service;

import com.hms.dto.RiskPredictionRequest;
import com.hms.entity.Patient;
import com.hms.entity.RiskPrediction;
import com.hms.repository.PatientRepository;
import com.hms.repository.RiskPredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Bridges the Java backend to the Python (Scikit-learn) microservice that
 * predicts a patient's health risk tier - the hospital-domain equivalent of
 * the "Enrollment Prediction" / "Education Level Prediction" ML features.
 */
@Service
@RequiredArgsConstructor
public class MLPredictionService {

    private final RestTemplate restTemplate;
    private final RiskPredictionRepository riskPredictionRepository;
    private final PatientRepository patientRepository;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @SuppressWarnings("unchecked")
    public RiskPrediction predictRisk(RiskPredictionRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + req.getPatientId()));

        Map<String, Object> payload = new HashMap<>();
        payload.put("age", req.getAge());
        payload.put("bmi", req.getBmi());
        payload.put("blood_pressure", req.getBloodPressure());
        payload.put("glucose_level", req.getGlucoseLevel());
        payload.put("heart_rate", req.getHeartRate());

        String riskLevel = "UNKNOWN";
        Double confidence = 0.0;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            Map<String, Object> response = restTemplate.postForObject(
                    mlServiceUrl + "/predict", entity, Map.class);

            riskLevel = response != null ? String.valueOf(response.get("risk_level")) : "UNKNOWN";
            confidence = response != null && response.get("confidence") != null
                    ? Double.valueOf(String.valueOf(response.get("confidence")))
                    : 0.0;
        } catch (Exception e) {
            // Rule-based fallback if ML microservice is offline or failed to deploy
            System.err.println("ML Microservice offline (" + e.getMessage() + "). Using local rule-based fallback.");
            double age = req.getAge();
            double bmi = req.getBmi();
            double bp = req.getBloodPressure();
            double glucose = req.getGlucoseLevel();

            if (age > 60 || bp > 140 || glucose > 150 || bmi > 30) {
                riskLevel = "HIGH";
                confidence = 0.85;
            } else if (age > 40 || bp > 120 || glucose > 100 || bmi > 25) {
                riskLevel = "MEDIUM";
                confidence = 0.75;
            } else {
                riskLevel = "LOW";
                confidence = 0.92;
            }
        }

        RiskPrediction prediction = RiskPrediction.builder()
                .patient(patient)
                .age(req.getAge())
                .bmi(req.getBmi())
                .bloodPressure(req.getBloodPressure())
                .glucoseLevel(req.getGlucoseLevel())
                .heartRate(req.getHeartRate())
                .riskLevel(riskLevel)
                .confidence(confidence)
                .build();

        return riskPredictionRepository.save(prediction);
    }

    public List<RiskPrediction> history(Long patientId) {
        return riskPredictionRepository.findByPatientIdOrderByPredictedAtDesc(patientId);
    }
}
