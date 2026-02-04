package com.farmer_vendor.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Crop;

public interface BidRepository extends JpaRepository<Bid, Long> {

	 Optional<Bid> findTopByCropOrderByAmountDesc(Crop crop);
    //List<Bid> findByCrop_CropId(Long cropId);
	 List<Bid> findByCrop_CropIdOrderByAmountDesc(Long cropId);

    List<Bid> findByVendor_UserId(Long vendorId);
   
}
