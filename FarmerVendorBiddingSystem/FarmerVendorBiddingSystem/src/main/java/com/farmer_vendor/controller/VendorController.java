package com.farmer_vendor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.entity.User;
import com.farmer_vendor.repo.CropRepository;
import com.farmer_vendor.repo.SaleRepository;
import com.farmer_vendor.repo.UserRepository;
import com.farmer_vendor.service.BidService;

@RestController
@RequestMapping("/vendor")
@CrossOrigin
public class VendorController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidService bidService;

    @Autowired
    private SaleRepository saleRepository;

    // ===============================
    // VIEW NEARBY CROPS
    // ===============================
    @GetMapping("/nearby-crops")
    public List<Crop> getNearbyCrops(@RequestParam String district) {
        return cropRepository.findByLocation_District(district);
    }

    // ===============================
    // PLACE BID (MAIN)
    // ===============================
    @PostMapping("/place-bid")
    public ResponseEntity<?> placeBid(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("DEBUG: Place Bid Request Received: " + payload);
            Long cropId = Long.valueOf(payload.get("cropId").toString());
            Long vendorId = Long.valueOf(payload.get("vendorId").toString());
            Double amount = Double.valueOf(payload.get("amount").toString());

            bidService.placeBid(cropId, vendorId, amount);

            return ResponseEntity.ok("Bid placed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ===============================
    // PLACE BID (ALIAS)
    // ===============================
    @PostMapping("/bid")
    public ResponseEntity<?> placeBidAlias(@RequestParam Long cropId, @RequestParam Double amount,
            @RequestParam Long vendorId) {
        try {
            bidService.placeBid(cropId, vendorId, amount);
            return ResponseEntity.ok("Bid placed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ===============================
    // GET BIDS BY VENDOR
    // ===============================
    @GetMapping("/bids/{vendorId}")
    public ResponseEntity<List<Bid>> getBidsByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(bidService.getBidsByVendor(vendorId));
    }

    // ===============================
    // GET ALL CROPS
    // ===============================
    @GetMapping("/crops")
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    @GetMapping("/nearby-bids/{vendorId}")
    public List<Crop> nearbyBids(@PathVariable Long vendorId) {
        return cropRepository.findByStatus("ACTIVE");
    }

    // ===============================
    // PUBLIC HOME PAGE APIs
    // ===============================
    @GetMapping("/active-crops")
    public List<Crop> getActiveCrops() {
        return cropRepository.findByStatus("ACTIVE");
    }

    @GetMapping("/crop-names")
    public List<String> getCropNames() {
        return cropRepository.findDistinctCropNames();
    }

    @Autowired
    private com.farmer_vendor.repo.PaymentRepository paymentRepository;

    @GetMapping("/my-sales/{vendorId}")
    public List<com.farmer_vendor.dto.SaleDTO> getVendorSales(@PathVariable Long vendorId) {
        List<Sale> sales = saleRepository.findByVendor_UserId(vendorId);

        return sales.stream().map(s -> {
            Long paymentId = null;
            if (s.getPayment() != null) {
                paymentId = s.getPayment().getPaymentId();
            } else {
                // 🛡️ FALLBACK: Explicitly check Payment table
                var p = paymentRepository.findBySale_SaleId(s.getSaleId()).orElse(null);
                if (p != null)
                    paymentId = p.getPaymentId();
            }

            return new com.farmer_vendor.dto.SaleDTO(s.getSaleId(), s.getBid().getCrop().getCropName(),
                    s.getFinalPrice() != null ? s.getFinalPrice() : s.getBid().getAmount(), s.getStatus(), paymentId);
        }).collect(java.util.stream.Collectors.toList());
    }
}
