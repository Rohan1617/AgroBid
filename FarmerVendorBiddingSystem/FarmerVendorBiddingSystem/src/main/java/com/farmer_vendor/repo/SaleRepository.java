package com.farmer_vendor.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
	 List<Sale> findByBid_Crop_Farmer_UserId(Long farmerId);
	 List<Sale> findByBid_Vendor_UserId(Long vendorId);
	 Optional<Sale> findByBid(Bid bid);
	 List<Sale> findByVendor_UserId(Long vendorId);
}
