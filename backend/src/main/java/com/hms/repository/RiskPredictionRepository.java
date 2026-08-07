package com.hms.repository;

import com.hms.entity.RiskPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, Long> {
    List<RiskPrediction> findByPatientIdOrderByPredictedAtDesc(Long patientId);
}
