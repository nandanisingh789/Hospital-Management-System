package com.hms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotNull
    private Long patientId;
    private Long appointmentId;
    @NotNull
    private Double amount; // in INR
    private String description;
}
