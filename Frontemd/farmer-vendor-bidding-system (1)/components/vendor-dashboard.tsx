"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

const API_BASE_URL = "http://localhost:8080"
const DOTNET_API = "http://localhost:5002"

export default function VendorDashboard() {
  const router = useRouter()
  const { t } = useLanguage()

  const [crops, setCrops] = useState<any[]>([])
  const [bids, setBids] = useState<Record<number, string>>({})
  const [mySales, setMySales] = useState<any[]>([])

  // 🔐 AUTH + LOAD DATA
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const vendorId = localStorage.getItem("userId")

    if (!token || role !== "VENDOR" || !vendorId) {
      router.push("/login")
      return
    }

    // 🌾 Load crops
    fetch(`${API_BASE_URL}/vendor/nearby-bids/${vendorId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => setCrops(Array.isArray(data) ? data : []))
      .catch(() => alert("Failed to load crops"))

    // 🤝 Load sales
    fetch(`${API_BASE_URL}/vendor/my-sales/${vendorId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
        console.log("My Sales Data:", data)
        setMySales(Array.isArray(data) ? data : [])
      })
  }, [router])

  // 💰 PLACE BID
  const placeBid = async (cropId: number, amount: number) => {
    if (!amount || amount <= 0) {
      alert("Enter valid bid amount")
      return
    }

    const token = localStorage.getItem("token")
    const vendorId = localStorage.getItem("userId")

    const res = await fetch(`${API_BASE_URL}/vendor/place-bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ cropId, vendorId, amount }),
    })

    if (!res.ok) {
      const errorMsg = await res.text()
      alert(errorMsg)
      return
    }

    alert("Bid placed successfully")
  }

  // ❌ CANCEL PAYMENT
  const cancelPayment = async (saleId: number) => {
    const res = await fetch(`${DOTNET_API}/payments/cancel/${saleId}`, {
      method: "POST",
    })

    if (!res.ok) {
      alert(await res.text())
      return
    }

    alert("Payment cancelled")
    window.location.reload()
  }

  // 🔁 REFUND PAYMENT
  const refundPayment = async (paymentId: number) => {
    const res = await fetch(`${DOTNET_API}/payments/refund/${paymentId}`, {
      method: "POST",
    })

    if (!res.ok) {
      alert(await res.text())
      return
    }

    alert("Refund successful")
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery=""
        onSearchChange={() => { }}
        isLoggedIn={true}
        userRole="vendor"
        onLogout={handleLogout}
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* 🔝 HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.vendorDashboard}</h1>

          <Button
            variant="outline"
            onClick={() => router.push("/payment-history")}
          >
            {t.paymentHistory}
          </Button>
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">{t.availableCrops}</TabsTrigger>
            <TabsTrigger value="deals">{t.myAcceptedDeals}</TabsTrigger>
          </TabsList>

          {/* 🌾 AVAILABLE CROPS */}
          <TabsContent value="available">
            {crops.length === 0 && (
              <p className="text-muted-foreground mt-4">
                {t.noCropsAvailable}
              </p>
            )}

            {crops.map(crop => {
              return (
                <Card key={crop.cropId} className="mb-4">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="relative h-24 w-24">
                      <Image
                        src={
                          crop.imageUrl
                            ? `${API_BASE_URL}${crop.imageUrl}`
                            : "/placeholder.svg"
                        }
                        alt={crop.cropName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{crop.cropName}</h3>
                      <p>{t.basePrice}: ₹{crop.basePrice}</p>
                      {crop.location && (
                        <p className="text-sm text-muted-foreground">
                          📍 {crop.location.city}, {crop.location.state}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.posted}: {new Date(crop.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <>
                      <Input
                        type="number"
                        placeholder={t.bidAmount}
                        className="w-32"
                        value={bids[crop.cropId] || ""}
                        onChange={e =>
                          setBids({ ...bids, [crop.cropId]: e.target.value })
                        }
                      />

                      <Button
                        onClick={() =>
                          placeBid(crop.cropId, Number(bids[crop.cropId]))
                        }
                      >
                        {t.placeBid}
                      </Button>
                    </>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* 🤝 MY DEALS */}
          <TabsContent value="deals">
            {mySales.length === 0 && (
              <p className="text-muted-foreground mt-4">
                {t.noOrders}
              </p>
            )}

            {mySales.map(sale => (
              <Card key={sale.saleId} className="mb-4">
                <CardContent className="flex justify-between items-center p-6">
                  <div>
                    <h3 className="font-semibold">
                      {sale.cropName}
                    </h3>

                    <p>
                      {t.finalPrice}: ₹{sale.finalPrice}
                    </p>

                    <Badge className="mb-2">{sale.status}</Badge>

                    {sale.status === "CREATED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelPayment(sale.saleId)}
                      >
                        {t.cancelPayment}
                      </Button>
                    )}

                    {sale.status === "PAID" && sale.paymentId ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refundPayment(sale.paymentId)}
                      >
                        {t.requestRefund}
                      </Button>
                    ) : sale.status === "PAID" ? (
                      <Badge variant="destructive">Error: No Payment ID</Badge>
                    ) : null}

                    {sale.status === "REFUNDED" && (
                      <Badge variant="secondary">Refunded</Badge>
                    )}

                    {sale.status === "CANCELLED" && (
                      <Badge variant="secondary">Cancelled</Badge>
                    )}
                  </div>

                  {sale.status === "CREATED" && (
                    <Button
                      onClick={() => router.push(`/payment/${sale.saleId}`)}
                    >
                      {t.payNow}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}