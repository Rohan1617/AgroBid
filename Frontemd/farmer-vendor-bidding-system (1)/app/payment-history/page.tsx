"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = "http://localhost:8080"

export default function PaymentHistoryPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const vendorId = localStorage.getItem("userId")
    const role = localStorage.getItem("role")

    if (!vendorId || role !== "VENDOR") {
      router.push("/login")
      return
    }

    fetch(`${API_BASE}/payments/history/${vendorId}`)
      .then(res => res.json())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => alert("Failed to load payment history"))
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <Button onClick={() => router.push("/vendor-dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {["all", "paid", "refunded", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {payments.filter(s => tab === "all" || s.status?.toLowerCase() === tab).length === 0 ? (
              <p className="text-muted-foreground">No {tab} history found</p>
            ) : (
              payments
                .filter(s => tab === "all" || s.status?.toLowerCase() === tab)
                .map((sale: any) => (
                  <Card key={sale.saleId} className="mb-4">
                    <CardHeader>
                      <CardTitle>
                        {sale.payment ? `Payment #${sale.payment.paymentId}` : `Order #${sale.saleId || 'Pending'}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p><b>Sale ID:</b> {sale.saleId}</p>
                          <p><b>Crop:</b> {sale.crop?.cropName || "Unknown"}</p>
                          <p><b>Amount:</b> ₹{sale.finalPrice}</p>
                        </div>
                        <div>
                          <Badge
                            variant={
                              sale.status === "PAID"
                                ? "default"
                                : sale.status === "REFUNDED" || sale.status === "CANCELLED"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {sale.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        <b>Paid At:</b>{" "}
                        {sale.payment?.paidAt
                          ? new Date(sale.payment.paidAt).toLocaleDateString() + " " + new Date(sale.payment.paidAt).toLocaleTimeString()
                          : "—"}
                      </p>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}