"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "./navbar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"
import { Eye, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { useLanguage } from "@/components/language-provider"
// ... imports

const API_BASE_URL = "http://localhost:8080"

export default function FarmerDashboard() {
  const router = useRouter()
  const { t } = useLanguage()

  const [crops, setCrops] = useState<any[]>([])
  const [selectedCrop, setSelectedCrop] = useState<any>(null)
  const [showBids, setShowBids] = useState(false)

  const [cropName, setCropName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [description, setDescription] = useState("")
  const [farmerId, setFarmerId] = useState<string | null>(null)

  const [orders, setOrders] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const storedFarmerId = localStorage.getItem("userId")

    if (!token || role !== "FARMER" || !storedFarmerId) {
      router.push("/login")
      return
    }

    setFarmerId(storedFarmerId)

    const loadData = () => {
      // 1. Crops
      fetch(`${API_BASE_URL}/farmer/my-crops/${storedFarmerId}`, {
        headers: { Authorization: "Bearer " + token },
      })
        .then(res => res.json())
        .then(data => setCrops(Array.isArray(data) ? data : []))
        .catch(() => setCrops([]))

      // 2. Orders
      fetch(`${API_BASE_URL}/farmer/orders/${storedFarmerId}`, {
        headers: { Authorization: "Bearer " + token },
      })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))

      // 3. Notifications
      fetch(`${API_BASE_URL}/notifications/${storedFarmerId}`, {
        headers: { Authorization: "Bearer " + token },
      })
        .then(res => res.json())
        .then(data => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => setNotifications([]))
    }

    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [router])

  const [imageFile, setImageFile] = useState<File | null>(null)



  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [grade, setGrade] = useState("")

  // ➕ ADD CROP
  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) return

    const formData = new FormData()
    formData.append("cropName", cropName)
    formData.append("quantity", quantity)
    formData.append("basePrice", basePrice)
    formData.append("description", description)
    formData.append("farmerId", farmerId!)
    formData.append("city", city)
    formData.append("district", district)
    formData.append("state", state)
    formData.append("grade", grade)

    if (imageFile) {
      formData.append("image", imageFile)
    }

    const res = await fetch(`${API_BASE_URL}/farmer/add`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // No Content-Type; browser sets it for FormData
      },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.text()
      alert("Failed to add crop ❌ " + err)
      return
    }

    alert("Crop added successfully ✅")

    setCropName("")
    setQuantity("")
    setBasePrice("")
    setDescription("")
    setCity("")
    setDistrict("")
    setState("")
    setGrade("")
    setImageFile(null)
  }

  // 👁 VIEW BIDS
  const openBids = async (cropId: number) => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(
      `${API_BASE_URL}/farmer/crops/${cropId}/bids`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )

    if (!res.ok) {
      console.error("Failed to load bids", res.status)
      alert("Failed to load bids")
      return
    }

    const data = await res.json()

    const sortedBids = Array.isArray(data)
      ? [...data].sort((a: any, b: any) => b.amount - a.amount)
      : []

    setSelectedCrop({
      cropId,
      bids: sortedBids,
    })

    setShowBids(true)
  }

  // ✅ ACCEPT BID
  const acceptHighestBid = async (id: number) => {
    const token = localStorage.getItem("token")
    if (!token) return
    const res = await fetch(`${API_BASE_URL}/farmer/bids/accept/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })

    if (!res.ok) {
      const err = await res.text()
      alert("Failed to accept bid: " + err)
      return
    }

    alert("Bid accepted successfully ✅")
    setShowBids(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
    return
  }



  return (
    <div className="min-h-screen bg-background">
      {/* ... navbar ... */}
      <Navbar
        searchQuery=""
        onSearchChange={() => { }}
        isLoggedIn={true}
        userRole="farmer"
        onLogout={handleLogout}
      />

      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">{t.farmerDashboard}</h1>

        <Tabs defaultValue="crops">
          <TabsList>
            <TabsTrigger value="crops">{t.myCrops}</TabsTrigger>
            <TabsTrigger value="orders">{t.myOrders}</TabsTrigger>
            <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          </TabsList>

          {/* MY CROPS */}
          <TabsContent value="crops">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t.addNewCrop}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCrop} className="grid gap-4">
                  {/* ... Existing Form ... */}
                  <Input
                    placeholder={t.cropName}
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={t.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                    <Input
                      placeholder={t.basePrice}
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={t.grade}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder={t.city}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <Input
                      placeholder={t.district}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                    <Input
                      placeholder={t.state}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <Textarea
                    placeholder={t.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit">{t.addCrop}</Button>
                </form>
              </CardContent>
            </Card>

            {crops.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  {t.noCropsYet}
                </CardContent>
              </Card>
            ) : (
              crops.map((crop) => (
                <Card key={crop.cropId} className="mb-4">
                  <CardContent className="flex justify-between items-center p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        <img
                          src={crop.imageUrl ? `${API_BASE_URL}${crop.imageUrl}` : "/placeholder.svg"}
                          alt={crop.cropName}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{crop.cropName}</h3>
                        <p className="text-sm">₹{crop.basePrice}</p>
                        <Badge>{crop.status}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => openBids(crop.cropId)}>
                      <Eye className="mr-2 h-4 w-4" /> {t.viewBids}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* MY ORDERS */}
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <p className="text-muted-foreground">{t.noOrders}</p>
            ) : (
              orders.map((order: any) => (
                <Card key={order.saleId} className="mb-4">
                  <CardContent className="flex justify-between items-center p-6">
                    <div>
                      <h3 className="font-semibold">{order.cropName}</h3>
                      <p>{t.soldTo}: {order.vendor?.name || "Unknown"}</p>
                      <p>{t.price}: ₹{order.finalPrice}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground">{t.noNotifications}</p>
            ) : (
              notifications.map((notif: any) => (
                <Card key={notif.id} className="mb-2">
                  <CardContent className="p-4">
                    <p>{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* BIDS MODAL */}
      <Dialog open={showBids} onOpenChange={setShowBids}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.bids}</DialogTitle>
          </DialogHeader>

          {selectedCrop?.bids?.length === 0 ? (
            <p className="text-muted-foreground">{t.noBidsYet}</p>
          ) : (
            selectedCrop?.bids?.map((bid: any, index: number) => (
              <Card key={bid.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p>{bid.vendor?.name}</p>
                    <p>₹{bid.amount}</p>
                  </div>
                  {index === 0 && (
                    <Button onClick={() => acceptHighestBid(bid.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" /> {t.accept}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
