package com.farmer_vendor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CropExpiryScheduler {

    @Autowired
    private CropService cropService;

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void autoCloseBids() {
        cropService.closeExpiredCrops();
    }
}

