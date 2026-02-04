"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "./navbar"
import FilterPanel from "./filter-panel"
import ProductCard from "./product-card"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SlidersHorizontal } from "lucide-react"

const dummyProducts = [
  {
    id: "1",
    name: "Premium Wheat",
    description: "High-quality wheat from Punjab, excellent for flour production",
    basePrice: 2500,
    category: "wheat",
    image: "/wheat-grains-golden.jpg",
  },
  {
    id: "2",
    name: "Basmati Rice",
    description: "Aromatic long-grain rice, perfect for biryani and pulao",
    basePrice: 4500,
    category: "rice",
    image: "/basmati-rice-grains-white.jpg",
  },
  {
    id: "3",
    name: "Fresh Onions",
    description: "Farm-fresh red onions, ideal for cooking and export",
    basePrice: 1800,
    category: "onion",
    image: "/red-onions-fresh.jpg",
  },
  {
    id: "4",
    name: "Ripe Tomatoes",
    description: "Juicy red tomatoes, perfect for sauces and salads",
    basePrice: 2200,
    category: "tomato",
    image: "/red-tomatoes-ripe.jpg",
  },
  {
    id: "5",
    name: "Organic Potatoes",
    description: "Certified organic potatoes, great for chips and fries",
    basePrice: 1500,
    category: "potato",
    image: "/potatoes-organic-brown.jpg",
  },
  {
    id: "6",
    name: "Sweet Corn",
    description: "Fresh sweet corn kernels, ideal for processing",
    basePrice: 2800,
    category: "corn",
    image: "/corn-yellow-kernels.jpg",
  },
  {
    id: "7",
    name: "Golden Wheat",
    description: "Premium quality golden wheat with high protein content",
    basePrice: 2700,
    category: "wheat",
    image: "/golden-wheat-field.jpg",
  },
  {
    id: "8",
    name: "Brown Rice",
    description: "Nutritious brown rice with natural fiber",
    basePrice: 3800,
    category: "rice",
    image: "/brown-rice-grains.jpg",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [isLoggedIn] = useState(false)
  const [activeCrops, setActiveCrops] = useState<any[]>([])
  const [cropNames, setCropNames] = useState<string[]>([])

  useEffect(() => {
    fetch("http://localhost:8080/vendor/active-crops")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setActiveCrops(data)
      })
      .catch(err => console.error(err))

    fetch("http://localhost:8080/vendor/crop-names")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCropNames(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const combinedProducts = useMemo(() => {
    const dynamicProducts = activeCrops.map(crop => ({
      id: `dynamic-${crop.cropId}`,
      name: crop.cropName,
      description: crop.description || "Fresh crop",
      basePrice: crop.basePrice,
      category: crop.cropName.toLowerCase(),
      image: crop.imageUrl ? `http://localhost:8080${crop.imageUrl}` : "/placeholder.svg",
    }))
    return [...dummyProducts, ...dynamicProducts]
  }, [activeCrops])

  const filteredProducts = useMemo(() => {
    return combinedProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.some(c => c.toLowerCase() === product.category.toLowerCase())
      const matchesPrice = product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchQuery, selectedCategories, priceRange, combinedProducts])

  const handleBidNow = (productId: string) => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push(`/bid/${productId}`)
    }
  }

  const translations = {
    en: {
      filters: "Filters",
      noProducts: "No products found",
      tryAdjusting: "Try adjusting your filters",
    },
    hi: {
      filters: "फ़िल्टर",
      noProducts: "कोई उत्पाद नहीं मिला",
      tryAdjusting: "अपने फ़िल्टर समायोजित करने का प्रयास करें",
    },
  }

  const t = translations[language]

  return (
    <div className="min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={isLoggedIn}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white/95 rounded-xl shadow-lg p-6 backdrop-blur-sm">
          <div className="flex gap-6">
            {/* Desktop Filter Panel */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20">
                <FilterPanel
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  language={language}
                  dynamicCategories={cropNames}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full bg-white">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      {t.filters}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <FilterPanel
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      language={language}
                      dynamicCategories={cropNames}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} onBidNow={handleBidNow} language={language} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-2xl font-semibold text-muted-foreground">{t.noProducts}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t.tryAdjusting}</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
