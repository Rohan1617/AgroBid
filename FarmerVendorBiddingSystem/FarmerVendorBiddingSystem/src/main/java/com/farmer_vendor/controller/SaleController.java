package com.farmer_vendor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmer_vendor.entity.Sale;
import com.farmer_vendor.repo.SaleRepository;

@RestController
@RequestMapping("/sales")
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @GetMapping("/{id}")
    public Sale getSaleById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }
    @GetMapping("/farmer/{farmerId}")
    public List<Sale> getSalesByFarmer(@PathVariable Long farmerId) {
        return saleRepository.findByBid_Crop_Farmer_UserId(farmerId);
    }
    @GetMapping("/vendor/{vendorId}")
    public List<Sale> getSalesByVendor(@PathVariable Long vendorId) {
        return saleRepository.findByBid_Vendor_UserId(vendorId);
}
    @PutMapping("/{saleId}/pay")
    public ResponseEntity<?> markAsPaid(@PathVariable Long saleId) {
        Sale sale = saleRepository.findById(saleId)
            .orElseThrow(() -> new RuntimeException("Sale not found"));

        sale.setStatus("PAID");
        saleRepository.save(sale);

        return ResponseEntity.ok("Payment successful");
    }

}