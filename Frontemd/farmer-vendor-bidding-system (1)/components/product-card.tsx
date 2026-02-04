"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface ProductCardProps {
  id: string
  name: string
  description: string
  basePrice: number
  image: string
  onBidNow: (id: string) => void
  language: "en" | "hi"
}

const translations = {
  en: {
    bidNow: "Bid Now",
    basePrice: "Base Price",
  },
  hi: {
    bidNow: "बोली लगाएं",
    basePrice: "आधार मूल्य",
  },
}

export default function ProductCard({ id, name, description, basePrice, image, onBidNow, language }: ProductCardProps) {
  const t = translations[language]

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">{t.basePrice}</p>
            <p className="text-xl font-bold text-primary">₹{basePrice.toLocaleString()}</p>
          </div>
          <Button
            onClick={() => onBidNow(id)}
            className="transition-all duration-300 group-hover:bg-secondary group-hover:scale-105"
          >
            {t.bidNow}
          </Button>
        </div>
      </div>
    </Card>
  )
}
