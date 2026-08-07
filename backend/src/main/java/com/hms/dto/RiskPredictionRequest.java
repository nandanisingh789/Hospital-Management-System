package com.hms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RiskPredictionRequest {
    @NotNull
    private Long patientId;
    @NotNull
    private Integer age;
    @NotNull
    private Double bmi;
    @NotNull
    private Integer bloodPressure;
    @NotNull
    private Integer glucoseLevel;
    @NotNull
    private Integer heartRate;
}
