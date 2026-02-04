package com.farmer_vendor.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmer_vendor.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	// Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
	Optional<Payment> findBySale_SaleId(Long saleId);

	Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

	java.util.List<Payment> findBySale_Vendor_UserId(Long vendorId);
}
