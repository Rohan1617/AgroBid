package com.farmer_vendor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmer_vendor.service.PaymentService;
import com.farmer_vendor.dto.PaymentVerifyRequest;

@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /*
     * @PostMapping("/create-order/{cropId}")
     * public ResponseEntity<?> createOrder(@PathVariable Long cropId) {
     * try {
     * return ResponseEntity.ok(paymentService.createOrderBySale(cropId));
     * } catch (Exception e) {
     * return ResponseEntity.badRequest().body(e.getMessage());
     * }
     * }
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerifyRequest request) {
        // ✅ DEBUG PRINTS — YAHAN AAYENGE
        System.out.println("PaymentId = " + request.getRazorpayPaymentId());
        System.out.println("OrderId   = " + request.getRazorpayOrderId());
        System.out.println("Signature = " + request.getRazorpaySignature());

        try {
            return ResponseEntity.ok(
                    paymentService.verifyPayment(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create-order/sale/{saleId}")
    public ResponseEntity<?> createOrderBySale(@PathVariable Long saleId) {
        try {
            return ResponseEntity.ok(
                    paymentService.createOrderBySale(saleId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history/{vendorId}")
    public ResponseEntity<?> getPaymentHistory(@PathVariable Long vendorId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(vendorId));
    }
}
