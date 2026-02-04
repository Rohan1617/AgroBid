package com.farmer_vendor.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    private Double amount;

    private String paymentMethod;

    // INITIATED / SUCCESS / FAILED
    private String status;

    // Razorpay IDs
    @Column(nullable = false, unique = true)
    private String gatewayOrderId;     // razorpay_order_id

    private String gatewayPaymentId;   // razorpay_payment_id

    @Column(length = 512)
    private String gatewaySignature;   // razorpay_signature

    private LocalDateTime paidAt;

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Sale getSale() {
		return sale;
	}

	public void setSale(Sale sale) {
		this.sale = sale;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getGatewayOrderId() {
		return gatewayOrderId;
	}

	public void setGatewayOrderId(String gatewayOrderId) {
		this.gatewayOrderId = gatewayOrderId;
	}

	public String getGatewayPaymentId() {
		return gatewayPaymentId;
	}

	public void setGatewayPaymentId(String gatewayPaymentId) {
		this.gatewayPaymentId = gatewayPaymentId;
	}

	public String getGatewaySignature() {
		return gatewaySignature;
	}

	public void setGatewaySignature(String gatewaySignature) {
		this.gatewaySignature = gatewaySignature;
	}

	public LocalDateTime getPaidAt() {
		return paidAt;
	}

	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}

    // getters & setters
    
    
}
