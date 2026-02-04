package com.farmer_vendor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.User;
import com.farmer_vendor.repo.CropRepository;
import com.farmer_vendor.repo.UserRepository;


@Service
public class VendorService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CropRepository cropRepository;

    public List<Crop> getNearbyBids(Long vendorId) {

        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        return cropRepository.findActiveCropsByLocation(
                vendor.getLocation()
        );
    }
}
