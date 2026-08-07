package com.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private Integer age;
    private Double bmi;
    private Integer bloodPressure;
    private Integer glucoseLevel;
    private Integer heartRate;

    @Column(nullable = false)
    private String riskLevel; // LOW, MEDIUM, HIGH (returned by Python scikit-learn model)

    private Double confidence;

    @Column(updatable = false)
    private LocalDateTime predictedAt;

    @PrePersist
    protected void onCreate() {
        this.predictedAt = LocalDateTime.now();
    }
}
