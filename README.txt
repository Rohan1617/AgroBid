================================================================================
          FARMER-VENDOR BIDDING SYSTEM - COMPLETE PROJECT GUIDE
================================================================================

1. PROJECT OVERVIEW
-------------------
This is a full-stack web application designed to help Farmers sell their crops 
directly to Vendors via a bidding system. It eliminates middlemen and ensures 
fair pricing using an auction-style mechanism.

Key Features:
- Farmers add crops.
- Vendors place bids.
- Highest bid wins (Auction Logic).
- Secure Payments via Razorpay.
- Admin features for managing conflicts (Refunds/Cancellations).

--------------------------------------------------------------------------------

2. TECH STACK
-------------
| Component        | Technology                          | Port  |
|------------------|-------------------------------------|-------|
| Frontend         | Next.js (React), Tailwind CSS       | 3000  |
| Backend (Main)   | Spring Boot (Java)                  | 8080  |
| Microservice     | .NET Core (C#)                      | 5xxx  |
| Database         | MySQL (Shared Database)             | 3306  |
| Payment Gateway  | Razorpay                            | -     |

--------------------------------------------------------------------------------

3. FOLDER STRUCTURE & EXPLANATION
---------------------------------

ROOT DIRECTORY: d:\CDAC Project\CDAC Project\

[1] FarmerVendorBiddingSystem (Spring Boot Backend)
    Location: .../FarmerVendorBiddingSystem/src/main/java/com/farmer_vendor
    - controller/ : API Endpoints (AuthController, PaymentController, etc.)
    - service/    : Business Logic (Bidding rules, Payment verification)
    - entity/     : Database Tables (User, Crop, Bid, Sale, Payment)
    - repo/       : Database Queries (JPA Repositories)

[2] Frontemd (Next.js Frontend)
    Location: .../Frontemd/farmer-vendor-bidding-system (1)/app
    - app/login/             : Login Page
    - app/farmer-dashboard/  : Farmer's main controls
    - app/vendor-dashboard/  : Vendor's market view
    - app/payment-history/   : Payment status view
    - lib/api.ts             : API Configuration (localhost:8080)

[3] payment-dotnet (.NET Microservice)
    Location: .../payment-dotnet/PaymentService
    - Controllers/PaymentController.cs : Admin actions (Cancel/Refund)

--------------------------------------------------------------------------------

4. CORE FLOWS (INTERVIEW EXPLANATION)
-------------------------------------

(A) USER REGISTRATION & LOGIN
    1. User fills form on Frontend -> Calls Spring Boot (/auth/register).
    2. Spring Boot saves User to MySQL (Password is Encrypted).
    3. User Logs in -> Spring Boot verifies credentials.
    4. Spring Boot generates a JWT (JSON Web Token) and sends it back.
    5. Frontend saves JWT in LocalStorage to stay logged in.

(B) BIDDING FLOW
    1. Farmer adds a Crop (Spring Boot: /crops/add).
    2. Vendor sees Crop on Dashboard.
    3. Vendor places a Bid (Spring Boot: /bids/place).
    4. Logic: Bid must be > Base Price & > Current Highest Bid.
    5. Loop continues until Farmer clicks "Accept Bid".

(C) SALE & PAYMENT FLOW
    1. Farmer accepts a Bid -> System creates a "SALE" record (Status: PENDING).
    2. Vendor sees "Pay Now" button on Frontend.
    3. Clicking "Pay Now" calls Spring Boot (/payments/create-order).
    4. Spring Boot talks to Razorpay -> Gets Order ID.
    5. Frontend opens Razorpay Popup (User enters card/UPI).
    6. On Success, Razorpay sends ID + Signature to Frontend.
    7. Frontend sends these to Spring Boot (/payments/verify).
    8. Spring Boot verifies Signature -> Updates DB (Sale = PAID).

(D) MICROSERVICE ROLE (.NET)
    - The .NET service acts as a specialized "Admin Module" for Payments.
    - It handles complex post-payment operations like Refunds and Cancellations.
    - Ideally runs on a separate port to demonstrate "Microservice Architecture" 
      where different teams can work on different services (Main App vs Payment Ops).

--------------------------------------------------------------------------------

5. DATABASE DESIGN (MySQL)
--------------------------
All services share the same database: `farmer_vendor_db`

KEY TABLES:
- users     : Farmers, Vendors, Admins
- crops     : Added by Farmers
- bids      : Placed by Vendors on Crops
- sales     : Created when Bid is accepted
- payments  : Stores Razorpay details (Order ID, Payment ID)

--------------------------------------------------------------------------------

6. HOW TO RUN THE PROJECT
-------------------------

STEP 1: DATABASE
   - Open MySQL Workbench.
   - Create Schema: `create database farmer_vendor_db;`
   - (Tables will be auto-created by Spring Boot).

STEP 2: SPRING BOOT (MAIN BACKEND)
   - Open Folder: `FarmerVendorBiddingSystem` in IntelliJ/Eclipse/VS Code.
   - Run `FarmerVendorBiddingSystemApplication.java`.
   - Wait for "Started Application on Port 8080".

STEP 3: .NET SERVICE (OPTIONAL/ADMIN)
   - Open Command Prompt in `payment-dotnet/PaymentService`.
   - Run: `dotnet run`
   - It will start on localhost:5xxx (Check console for port).

STEP 4: FRONTEND
   - Open Command Prompt in `Frontemd/farmer-vendor-bidding-system (1)`.
   - Run: `npm run dev`
   - Open Browser: http://localhost:3000

--------------------------------------------------------------------------------

7. COMMON INTERVIEW QUESTIONS
-----------------------------

Q: Why use Microservices (.NET)?
A: To separate the "Core Business Logic" (Java) from "Financial Operations" (.NET). 
   If the main app crashes, the refund service can still run (theoretically). 
   Also shows multi-language proficiency.

Q: How is security handled?
A: Passwords are BCrypt encrypted. API calls are protected using JWT.

Q: How does Payment Verification work?
A: We don't trust the Frontend. We send the Payment ID/Signature to the Backend. 
   The Backend uses the Razorpay Secret Key to mathematically verify the signature.

--------------------------------------------------------------------------------
WARNING: Do not delete any files without understanding their role! 
This project is consistent and clean. Good luck!
================================================================================
