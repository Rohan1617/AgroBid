package com.farmer_vendor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.repo.BidRepository;
import com.farmer_vendor.repo.CropRepository;
import com.farmer_vendor.repo.SaleRepository;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private CropRepository cropRepository;

    public Sale createSale(Bid winningBid) {

        // 🔐 SAFETY CHECK
        Crop crop = winningBid.getCrop();
        if ("SOLD".equals(crop.getStatus())) {
            throw new RuntimeException("Crop already sold. No further sales allowed.");
        }

        // 1️⃣ Mark winning bid
        winningBid.setStatus("WON");
        bidRepository.save(winningBid);

        // 2️⃣ Mark other bids as LOST
        bidRepository.findByCrop_CropIdOrderByAmountDesc(crop.getCropId())
                .stream()
                .filter(b -> !b.getId().equals(winningBid.getId()))
                .forEach(b -> {
                    b.setStatus("LOST");
                    bidRepository.save(b);
                });

        // 3️⃣ Mark crop as SOLD
        crop.setStatus("SOLD");
        cropRepository.save(crop);

        // 4️⃣ Create or reuse Sale (IDEMPOTENT)
        Sale sale = saleRepository.findByBid(winningBid)
                .orElseGet(() -> {
                    Sale newSale = new Sale();
                    newSale.setBid(winningBid);
                    newSale.setCrop(crop);
                    newSale.setFarmer(crop.getFarmer());
                    newSale.setVendor(winningBid.getVendor());
                    newSale.setFinalPrice(winningBid.getAmount());
                    newSale.setStatus("PAYMENT_PENDING");
                    return saleRepository.save(newSale);
                });

        return sale;
    }
}


