"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterPanelProps {
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  language: "en" | "hi"
}

// Keep original static categories
const staticCategories = [
  { id: "wheat", en: "Wheat", hi: "गेहूं" },
  { id: "rice", en: "Rice", hi: "चावल" },
  { id: "onion", en: "Onion", hi: "प्याज" },
  { id: "tomato", en: "Tomato", hi: "टमाटर" },
  { id: "potato", en: "Potato", hi: "आलू" },
  { id: "corn", en: "Corn", hi: "मक्का" },
]

const translations = {
  en: {
    filters: "Filters",
    category: "Category",
    priceRange: "Price Range",
  },
  hi: {
    filters: "फ़िल्टर",
    category: "श्रेणी",
    priceRange: "मूल्य सीमा",
  },
}

interface FilterPanelProps {
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  language: "en" | "hi"
  dynamicCategories?: string[] // NEW PROP
}

export default function FilterPanel({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  language,
  dynamicCategories = [],
}: FilterPanelProps) {
  const t = translations[language]

  // Merge static and dynamic categories
  const allCategories = [...staticCategories]

  if (dynamicCategories) {
    dynamicCategories.forEach(catName => {
      // Check if already exists (case insensitive)
      const exists = allCategories.some(c => c.id.toLowerCase() === catName.toLowerCase())
      if (!exists) {
        allCategories.push({
          id: catName.toLowerCase(),
          en: catName, // Fallback to name itself
          hi: catName  // Fallback to name itself
        })
      }
    })
  }

  return (
    <div className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="font-bold text-lg">{t.filters}</h2>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.category}</Label>
        <div className="space-y-2">
          {allCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryChange(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {language === "en" ? category.en : category.hi}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.priceRange}</Label>
        <div className="space-y-2">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
