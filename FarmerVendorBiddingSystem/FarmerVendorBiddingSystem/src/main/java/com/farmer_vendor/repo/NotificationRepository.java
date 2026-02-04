package com.farmer_vendor.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmer_vendor.entity.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient_UserIdOrderByCreatedAtDesc(Long userId);
}
