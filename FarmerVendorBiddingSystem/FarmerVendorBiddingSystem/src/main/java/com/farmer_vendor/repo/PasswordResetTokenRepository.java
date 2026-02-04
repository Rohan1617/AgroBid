package com.farmer_vendor.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmer_vendor.entity.PasswordResetToken;
import com.farmer_vendor.entity.User;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}

