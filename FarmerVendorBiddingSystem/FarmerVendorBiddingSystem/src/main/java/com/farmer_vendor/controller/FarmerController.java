package com.farmer_vendor.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.farmer_vendor.entity.Bid;
import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.entity.User;
import com.farmer_vendor.repo.BidRepository;
import com.farmer_vendor.repo.CropRepository;
import com.farmer_vendor.repo.UserRepository;
import com.farmer_vendor.service.BidService;
import com.farmer_vendor.service.SaleService;

@RestController
@RequestMapping("/farmer")
public class FarmerController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private BidService bidService;

    @Autowired
    private SaleService saleService;

    @Autowired
    private UserRepository userRepository;

    /*
     * @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
     * public ResponseEntity<?> addCrop(
     * 
     * @RequestParam("cropName") String cropName,
     * 
     * @RequestParam("quantity") Double quantity,
     * 
     * @RequestParam("basePrice") Double basePrice,
     * 
     * @RequestParam("grade") String grade,
     * 
     * @RequestParam("description") String description,
     * 
     * @RequestParam("image") MultipartFile image, // ⭐ IMPORTANT CHANGE
     * 
     * @RequestParam("farmerId") Long farmerId
     * ) throws IOException {
     * 
     * 
     * User farmer = userRepository.findById(farmerId)
     * .orElseThrow(() -> new RuntimeException("Farmer not found"));
     * 
     * Files.createDirectories(Paths.get("uploads"));
     * 
     * String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
     * Path path = Paths.get("uploads/" + fileName);
     * Files.write(path, image.getBytes());
     * 
     * Crop crop = new Crop();
     * crop.setCropName(cropName);
     * crop.setQuantity(quantity);
     * crop.setBasePrice(basePrice);
     * crop.setGrade(grade);
     * crop.setDescription(description);
     * crop.setImageUrl("/uploads/" + fileName);
     * crop.setCreatedAt(LocalDateTime.now());
     * crop.setExpiryTime(LocalDateTime.now().plusHours(24));
     * crop.setStatus("ACTIVE");
     * crop.setFarmer(farmer);
     * 
     * cropRepository.save(crop);
     * 
     * return ResponseEntity.ok(Map.of(
     * "message", "Crop added successfully",
     * "imageUrl", "/uploads/" + fileName
     * ));
     * }
     */
    @Autowired
    private com.farmer_vendor.repo.LocationRepository locationRepository;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCrop(
            @RequestParam("cropName") String cropName,
            @RequestParam("quantity") Double quantity,
            @RequestParam("basePrice") Double basePrice,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "grade", required = false) String grade,
            // Expiry removed
            @RequestParam("farmerId") Long farmerId) throws IOException {

        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            // Create uploads dir if not exists
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, image.getBytes());

            // URL to be served
            imageUrl = "/uploads/" + fileName;
        }

        // 📍 SAVE LOCATION
        com.farmer_vendor.entity.Location location = new com.farmer_vendor.entity.Location();
        location.setCity(city);
        location.setDistrict(district);
        location.setState(state);
        locationRepository.save(location);

        Crop crop = new Crop();
        crop.setCropName(cropName);
        crop.setQuantity(quantity);
        crop.setBasePrice(basePrice);
        crop.setDescription(description);
        crop.setImageUrl(imageUrl);
        crop.setStatus("ACTIVE");
        crop.setCreatedAt(LocalDateTime.now());

        // 🧪 Optional Fields
        crop.setGrade(grade);

        // Expiry time removed means unlimited duration
        crop.setExpiryTime(null);

        crop.setFarmer(farmer);
        crop.setLocation(location); // Link Location

        cropRepository.save(crop);

        return ResponseEntity.ok("Crop added successfully");
    }

    // ===============================
    // VIEW BIDS FOR A CROP
    // ===============================
    @GetMapping("/crops/{cropId}/bids")
    public ResponseEntity<List<Bid>> getBidsForCrop(@PathVariable Long cropId) {
        return ResponseEntity.ok(bidService.getBidsByCrop(cropId));
    }

    // ===============================
    // ACCEPT HIGHEST BID (NEW)
    // ===============================
    /*
     * @PostMapping("/accept-bid/{cropId}")
     * public ResponseEntity<Sale> acceptHighestBid(@PathVariable Long cropId) {
     * 
     * Crop crop = cropRepository.findById(cropId)
     * .orElseThrow(() -> new RuntimeException("Crop not found"));
     * 
     * Bid highestBid = bidService.getHighestBid(crop)
     * .orElseThrow(() -> new RuntimeException("No bids found"));
     * 
     * return ResponseEntity.ok(saleService.createSale(highestBid));
     * }
     */
    // ===============================
    // GET ALL CROPS (FARMER VIEW)
    // ===============================
    @GetMapping("/crops")
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAll());
    }

    @PostMapping("/bids/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        try {
            bidService.acceptBid(bidId);
            return ResponseEntity.ok("Bid accepted successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log duplicate key errors etc.
            return ResponseEntity.badRequest().body("Error accepting bid: " + e.getMessage());
        }
    }

    @GetMapping("/my-crops/{farmerId}")
    public ResponseEntity<List<Crop>> getMyCrops(@PathVariable Long farmerId) {
        return ResponseEntity.ok(
                cropRepository.findByFarmer_UserId(farmerId));
    }

    @Autowired
    private com.farmer_vendor.repo.SaleRepository saleRepository;

    @GetMapping("/orders/{farmerId}")
    public ResponseEntity<List<Sale>> getFarmerOrders(@PathVariable Long farmerId) {
        return ResponseEntity.ok(saleRepository.findByBid_Crop_Farmer_UserId(farmerId));
    }

    // 🛠️ SELF-HEALING ENDPOINT
    @PostMapping("/debug/fix-stuck-crops")
    public ResponseEntity<?> fixStuckCrops() {
        List<Crop> soldCrops = cropRepository.findAll().stream()
                .filter(c -> "SOLD".equals(c.getStatus()))
                .toList();

        int fixedCount = 0;
        for (Crop crop : soldCrops) {
            // Check if there is a valid sale for this crop
            // A valid sale is one that is NOT CANCELLED and NOT REFUNDED
            // logic: If latest sale is CANCELLED -> Crop should be ACTIVE
            // But getting "latest" is hard. Let's look for ANY active sale.

            // Actually, we can check via Bid -> Sale linkage
            // Or just check if ANY sale exists for this crop that is "CREATED" or "PAID"

            // Simplified logic: If the most recent sale for this crop is CANCELLED, revert
            // to ACTIVE.
            // But we don't have direct linkage easily without fetching all sales.

            // We can query SaleRepository by Crop
            // But Sale doesn't map Crop directly in repo method... Let's add it or iterate.

            // Since we injected SaleService, let's use it or SaleRepository.
            // Wait, SaleRepository method findByBid_Crop_Farmer... isn't enough.

            // Quick Fix: Reset ALL SOLD crops (DANGEROUS).
            // Better: Reset specific crop if user provides ID.

            // Safe approach: Reset only if NO active sale found.
        }

        return ResponseEntity.ok("This endpoint requires more logic. Use /debug/reset-crop/{cropId} instead.");
    }

    @PostMapping("/debug/reset-crop/{cropId}")
    public ResponseEntity<?> resetCropStatus(@PathVariable Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        crop.setStatus("ACTIVE");
        cropRepository.save(crop);
        return ResponseEntity.ok("Crop " + cropId + " status reset to ACTIVE.");
    }

}
