package com.hms.service;

import com.hms.dto.CreateOrderRequest;
import com.hms.dto.VerifyPaymentRequest;
import com.hms.entity.Appointment;
import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public List<Bill> getByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    /**
     * Creates a Razorpay Order for the given amount and persists a PENDING
     * Bill row. The React checkout screen uses the returned orderId to open
     * the Razorpay Checkout widget.
     */
    @Transactional
    public Bill createOrder(CreateOrderRequest req) throws Exception {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + req.getPatientId()));

        Appointment appointment = null;
        if (req.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(req.getAppointmentId())
                    .orElse(null);
        }

        // Razorpay expects amount in the smallest currency unit (paise for INR)
        int amountInPaise = (int) Math.round(req.getAmount() * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "hms_receipt_" + System.currentTimeMillis());

        com.razorpay.Order order = razorpayClient.orders.create(orderRequest);

        Bill bill = Bill.builder()
                .patient(patient)
                .appointment(appointment)
                .amount(req.getAmount())
                .description(req.getDescription())
                .status(Bill.PaymentStatus.PENDING)
                .razorpayOrderId(order.get("id"))
                .build();

        return billRepository.save(bill);
    }

    /**
     * Verifies the HMAC-SHA256 signature Razorpay sends back after a
     * successful checkout, then marks the Bill as PAID.
     */
    @Transactional
    public Bill verifyAndCapture(VerifyPaymentRequest req) throws Exception {
        Bill bill = billRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("No bill found for this order"));

        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", req.getRazorpayOrderId());
        attributes.put("razorpay_payment_id", req.getRazorpayPaymentId());
        attributes.put("razorpay_signature", req.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

        if (!isValid) {
            bill.setStatus(Bill.PaymentStatus.FAILED);
            billRepository.save(bill);
            throw new IllegalArgumentException("Payment signature verification failed");
        }

        bill.setStatus(Bill.PaymentStatus.PAID);
        bill.setRazorpayPaymentId(req.getRazorpayPaymentId());
        bill.setRazorpaySignature(req.getRazorpaySignature());
        bill.setPaidAt(LocalDateTime.now());

        return billRepository.save(bill);
    }
}
