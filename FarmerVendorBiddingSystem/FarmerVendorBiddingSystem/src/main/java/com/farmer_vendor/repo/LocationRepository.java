package com.farmer_vendor.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmer_vendor.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
}
