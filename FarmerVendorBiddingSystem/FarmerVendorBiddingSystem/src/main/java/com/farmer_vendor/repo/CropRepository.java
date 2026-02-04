package com.farmer_vendor.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.farmer_vendor.entity.Crop;
import com.farmer_vendor.entity.Location;

public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByLocation_District(String district);

    List<Crop> findByStatus(String status);

    List<Crop> findByCropNameContainingIgnoreCase(String cropName);

    // 🔹 Nearby ACTIVE crops
    @Query("""
            SELECT c FROM Crop c
            WHERE c.status = 'ACTIVE'
            AND c.location = :location
            """)
    List<Crop> findActiveCropsByLocation(@Param("location") Location location);

    // 🔹 Expired crops for scheduler
    @Query("""
            SELECT c FROM Crop c
            WHERE c.status = 'ACTIVE'
            AND c.expiryTime IS NOT NULL
            AND c.expiryTime < CURRENT_TIMESTAMP
            """)
    List<Crop> findExpiredCrops();

    // 🔹 Distinct Crop Names for Filters
    @Query("SELECT DISTINCT c.cropName FROM Crop c WHERE c.status = 'ACTIVE'")
    List<String> findDistinctCropNames();

    List<Crop> findByFarmer_UserId(Long farmerId);

}
