package com.hms.controller;

import com.hms.dto.CreateOrderRequest;
import com.hms.dto.VerifyPaymentRequest;
import com.hms.entity.Bill;
import com.hms.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Bill>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingService.getByPatient(patientId));
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest req) {
        try {
            Bill bill = billingService.createOrder(req);
            return ResponseEntity.ok(Map.of(
                    "billId", bill.getId(),
                    "razorpayOrderId", bill.getRazorpayOrderId(),
                    "amount", bill.getAmount(),
                    "razorpayKeyId", razorpayKeyId // frontend needs this to open Checkout widget
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody VerifyPaymentRequest req) {
        try {
            Bill bill = billingService.verifyAndCapture(req);
            return ResponseEntity.ok(bill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
