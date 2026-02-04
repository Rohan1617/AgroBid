package com.farmer_vendor.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmer_vendor.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

}
