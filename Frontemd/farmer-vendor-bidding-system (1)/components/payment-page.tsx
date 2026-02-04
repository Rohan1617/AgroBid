"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"

const API_BASE = "http://localhost:8080"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()

  // ✅ URL: /payment/1 → id = 1
  const saleId = Array.isArray(params.id) ? params.id[0] : params.id

  const [sale, setSale] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // 🔹 Load sale details
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!saleId || !token) return

    fetch(`${API_BASE}/sales/${saleId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setSale(data))
      .catch(() => alert("Failed to load sale"))
  }, [saleId])

  // 🔹 Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return

    const script = document.createElement("script")
    script.id = "razorpay-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  if (!sale) return <p className="p-6">Loading...</p>

  const bidAmount = Number(sale.finalPrice ?? sale.bid?.amount ?? 0)
  const processingFee = Math.round(bidAmount * 0.02)
  const totalAmount = bidAmount + processingFee

  // 💳 PAYMENT HANDLER
  const handlePayment = async () => {
    try {
      setLoading(true)

      // 1️⃣ Create order
      const orderRes = await fetch(
        `${API_BASE}/payments/create-order/sale/${saleId}`,
        { method: "POST" }
      )

      if (!orderRes.ok) {
        throw new Error(await orderRes.text())
      }

      const order = await orderRes.json()

      // 2️⃣ Razorpay popup
      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        order_id: order.orderId,
        name: "Farmer Vendor Bidding",
        description: "Crop Purchase",

        handler: async (response: any) => {
          console.log("Razorpay response 👉", response)

          // 3️⃣ Verify payment (Spring Boot)
          const verifyRes = await fetch(
            `${API_BASE}/payments/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature ?? ""
              }),
            }
          )

          if (!verifyRes.ok) {
            const err = await verifyRes.text()
            alert("Payment verification failed ❌ " + err)
            return
          }

          setSuccess(true)
          setTimeout(() => router.push("/vendor-dashboard"), 1500)
        },
      }

      new window.Razorpay(options).open()
    } catch (err: any) {
      alert(err.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="py-10">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="mt-2">Redirecting to dashboard…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🧾 ORDER SUMMARY UI
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><b>Crop:</b> {sale.bid?.crop?.cropName}</p>
          <p><b>Bid Amount:</b> ₹{bidAmount}</p>
          <p><b>Processing Fee:</b> ₹{processingFee}</p>

          <Separator />

          <p className="text-xl font-bold">
            Total Payable: ₹{totalAmount}
          </p>

          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}