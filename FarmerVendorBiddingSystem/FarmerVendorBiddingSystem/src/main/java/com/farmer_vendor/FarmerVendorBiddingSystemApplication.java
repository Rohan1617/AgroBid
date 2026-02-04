package com.farmer_vendor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class FarmerVendorBiddingSystemApplication {

	public static void main(String[] args) {
		System.out.println(">>> CHECKPOINT: NEW BIDDING LOGIC LOADED <<<");
		SpringApplication.run(FarmerVendorBiddingSystemApplication.class, args);
	}
}
