package com.farmer_vendor.dto;

public class SaleDTO {
    private Long saleId;
    private String cropName;
    private Double finalPrice;
    private String status;
    private Long paymentId; // Can be null if not paid

    public SaleDTO(Long saleId, String cropName, Double finalPrice, String status, Long paymentId) {
        this.saleId = saleId;
        this.cropName = cropName;
        this.finalPrice = finalPrice;
        this.status = status;
        this.paymentId = paymentId;
    }

    // Getters and Setters
    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
}
