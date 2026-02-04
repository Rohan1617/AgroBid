package com.farmer_vendor.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.entity.User;
import com.farmer_vendor.repo.BidRepository;
import com.farmer_vendor.repo.CropRepository;
import com.farmer_vendor.repo.SaleRepository;
import com.farmer_vendor.repo.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private com.farmer_vendor.repo.NotificationRepository notificationRepository;

    @Transactional
    public Bid placeBid(Long cropId, Long vendorId, Double amount) {
        System.out.println("Processing Bid: Crop=" + cropId + ", Vendor=" + vendorId + ", Amount=" + amount);

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        // 🚫 BLOCK bidding if crop not ACTIVE
        if (!"ACTIVE".equals(crop.getStatus())) {
            throw new RuntimeException("Bidding closed. Crop is already sold or expired.");
        }

        // 1️⃣ RULE: Bid > Base Price
        if (amount <= crop.getBasePrice()) {
            throw new RuntimeException("Bid price should be greater than base price");
        }

        // 2️⃣ RULE: Bid > Highest Bid
        Optional<Bid> highestBid = getHighestBid(crop);
        if (highestBid.isPresent()) {
            Double currentMax = highestBid.get().getAmount();
            if (amount <= currentMax) {
                throw new RuntimeException("The highest bid on this crop is ₹" + currentMax);
            }
        }

        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Bid bid = new Bid();
        bid.setCrop(crop);
        bid.setVendor(vendor);
        bid.setAmount(amount);
        bid.setStatus("PLACED");
        bid.setCreatedAt(LocalDateTime.now());

        Bid savedBid = bidRepository.save(bid);
        System.out.println("Bid saved with ID: " + savedBid.getId());

        // 🔔 Notify Farmer
        try {
            com.farmer_vendor.entity.Notification notif = new com.farmer_vendor.entity.Notification(
                    "New bid of ₹" + amount + " on your crop '" + crop.getCropName() + "'",
                    crop.getFarmer());
            notificationRepository.save(notif);
            System.out.println("Notification saved for Farmer ID: " + crop.getFarmer().getUserId());
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("FAILED to save notification: " + e.getMessage());
        }

        return savedBid;
    }

    // 🔍 Get highest bid for a crop
    public Optional<Bid> getHighestBid(Crop crop) {
        return bidRepository.findTopByCropOrderByAmountDesc(crop);
    }

    // 📄 Get all bids for a crop
    public List<Bid> getBidsByCrop(Long cropId) {
        return bidRepository.findByCrop_CropIdOrderByAmountDesc(cropId);
    }

    // 📄 Get all bids by vendor
    public List<Bid> getBidsByVendor(Long vendorId) {
        return bidRepository.findByVendor_UserId(vendorId);
    }

    @Transactional
    public void acceptBid(Long bidId) {

        Bid winningBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        Crop crop = winningBid.getCrop();

        // 🚫 Only ACTIVE crop allowed
        if (!"ACTIVE".equals(crop.getStatus())) {
            throw new RuntimeException("Crop already closed");
        }

        // ✅ Accept winning bid (WIN)
        winningBid.setStatus("WIN");
        bidRepository.save(winningBid);

        // 🔔 Notify Vendor
        com.farmer_vendor.entity.Notification notif = new com.farmer_vendor.entity.Notification(
                "farmer accepted your bid please pay now",
                winningBid.getVendor());
        notificationRepository.save(notif);

        // ❌ Reject all other bids (LOSE)
        List<Bid> allBids = bidRepository.findByCrop_CropIdOrderByAmountDesc(crop.getCropId());

        for (Bid bid : allBids) {
            if (!bid.getId().equals(bidId)) {
                bid.setStatus("LOSE");
                bidRepository.save(bid);
            }
        }

        // 🏁 Mark crop SOLD
        crop.setStatus("SOLD");
        cropRepository.save(crop);

        // 💥 CREATE OR UPDATE SALE
        Sale sale = saleRepository.findByBid(winningBid).orElse(new Sale());

        if (sale.getSaleId() == null) {
            // New Sale
            sale.setBid(winningBid);
            sale.setCrop(crop);
            sale.setFarmer(crop.getFarmer());
            sale.setVendor(winningBid.getVendor());
        }

        // Always update these fields to be sure
        sale.setFinalPrice(winningBid.getAmount());
        sale.setStatus("CREATED"); // Reset status to allow payment

        saleRepository.save(sale);
    }

}
