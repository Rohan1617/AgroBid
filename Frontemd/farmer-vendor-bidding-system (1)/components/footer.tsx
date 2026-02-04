"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function Footer() {
  const router = useRouter()

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string, requiredRole?: string) => {
    e.preventDefault()

    // Check if user is logged in (in a real app, this would check actual auth state)
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      // Store the intended destination
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", path)
        if (requiredRole) {
          localStorage.setItem("requiredRole", requiredRole)
        }
      }
      router.push("/login")
    } else {
      router.push(path)
    }
  }

  return (
    <footer className="bg-[#1a1f2e] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Farmers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/farmers" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Sell Crops
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Track Bids
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Fair Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Place Bids
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Secure Payments
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Trusted Farmers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-secondary transition-colors duration-200">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 Farmer–Vendor Bidding System. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm text-center md:text-right">Made for farmers and vendors</p>
        </div>
      </div>
    </footer>
  )
}
