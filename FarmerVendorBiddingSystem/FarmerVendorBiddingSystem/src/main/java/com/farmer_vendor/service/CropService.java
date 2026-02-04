package com.farmer_vendor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.repo.CropRepository;

import jakarta.transaction.Transactional;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    @Transactional
    public void closeExpiredCrops() {

        List<Crop> expiredCrops = cropRepository.findExpiredCrops();

        for (Crop crop : expiredCrops) {
            crop.setStatus("EXPIRED");
            cropRepository.save(crop);
        }
    }
}
