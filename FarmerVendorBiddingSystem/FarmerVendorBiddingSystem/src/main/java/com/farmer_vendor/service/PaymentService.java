package com.farmer_vendor.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmer_vendor.dto.PaymentVerifyRequest;
import com.farmer_vendor.entity.Payment;
import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.repo.PaymentRepository;
import com.farmer_vendor.repo.SaleRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws Exception {
        this.razorpayClient = new RazorpayClient(
                razorpayKey,
                razorpaySecret);
    }

    // ✅ CREATE ORDER (VERY IMPORTANT)
    @Transactional
    public Map<String, Object> createOrderBySale(Long saleId) throws Exception {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        if ("PAID".equals(sale.getStatus())) {
            throw new RuntimeException("Payment already completed");
        }

        int amount = sale.getFinalPrice().intValue() * 100;

        JSONObject options = new JSONObject();
        options.put("amount", amount);
        options.put("currency", "INR");
        options.put("receipt", "sale_" + saleId);

        Order order = razorpayClient.orders.create(options);
        String orderId = order.get("id").toString();

        System.out.println("🆕 CREATING ORDER: " + orderId + " for Sale ID: " + saleId);

        // 🔥 SAVE PAYMENT (Upsert Logic)
        Payment payment = paymentRepository.findBySale_SaleId(saleId)
                .orElse(new Payment());

        payment.setSale(sale);
        payment.setAmount(sale.getFinalPrice());
        payment.setGatewayOrderId(orderId); // ⭐ EXPLICIT TO STRING
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus("CREATED");

        paymentRepository.save(payment);

        return Map.of(
                "orderId", orderId,
                "amount", amount,
                "key", razorpayKey);
    }

    // ✅ VERIFY PAYMENT
    @Transactional
    public Payment verifyPayment(PaymentVerifyRequest request) {

        System.out.println("🔍 VERIFYING ORDER ID: " + request.getRazorpayOrderId());

        Payment payment = paymentRepository
                .findByGatewayOrderId(request.getRazorpayOrderId())
                .orElseThrow(
                        () -> new RuntimeException("Payment not found for Order ID: " + request.getRazorpayOrderId()));

        try {
            // 🔐 RAZORPAY SIGNATURE VERIFICATION
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();

            // Use Razorpay Utils to generate signature
            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(
                    new JSONObject()
                            .put("razorpay_order_id", request.getRazorpayOrderId())
                            .put("razorpay_payment_id", request.getRazorpayPaymentId())
                            .put("razorpay_signature", request.getRazorpaySignature()),
                    razorpaySecret);

            if (!isValid) {
                System.err.println("❌ INVALID SIGNATURE");
                throw new RuntimeException("Invalid Payment Signature");
            }

            payment.setGatewayPaymentId(request.getRazorpayPaymentId());
            payment.setGatewaySignature(request.getRazorpaySignature());
            payment.setStatus("SUCCESS"); // Keeping as SUCCESS as per existing convention, but mapped to PAID in UI
            payment.setPaidAt(LocalDateTime.now());

            Sale sale = payment.getSale();
            sale.setStatus("PAID");
            saleRepository.save(sale);

            System.out.println("✅ PAYMENT VERIFIED & SAVED: " + payment.getPaymentId());

            return paymentRepository.save(payment);

        } catch (Exception e) {
            System.err.println("Verification Failed: " + e.getMessage());
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    public java.util.List<Sale> getPaymentHistory(Long vendorId) {
        return saleRepository.findByVendor_UserId(vendorId);
    }
}
