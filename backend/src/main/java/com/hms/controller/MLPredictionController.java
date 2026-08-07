package com.hms.controller;

import com.hms.dto.RiskPredictionRequest;
import com.hms.entity.RiskPrediction;
import com.hms.service.MLPredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
public class MLPredictionController {

    private final MLPredictionService mlPredictionService;

    @PostMapping("/predict-risk")
    public ResponseEntity<?> predictRisk(@Valid @RequestBody RiskPredictionRequest req) {
        try {
            RiskPrediction prediction = mlPredictionService.predictRisk(req);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "ML service unavailable or prediction failed: " + e.getMessage()));
        }
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<RiskPrediction>> history(@PathVariable Long patientId) {
        return ResponseEntity.ok(mlPredictionService.history(patientId));
    }
}
