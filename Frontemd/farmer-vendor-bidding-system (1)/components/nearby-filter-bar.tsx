"use client"

import { MapPin, X } from "lucide-react"
import { Button } from "./ui/button"

interface NearbyFilterBarProps {
  selectedDistance: string
  onDistanceChange: (distance: string) => void
  onReset: () => void
}

export default function NearbyFilterBar({ selectedDistance, onDistanceChange, onReset }: NearbyFilterBarProps) {
  const distanceOptions = [
    { value: "10", label: "Within 10 km" },
    { value: "25", label: "Within 25 km" },
    { value: "50", label: "Within 50 km" },
    { value: "all", label: "All Distances" },
  ]

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Distance Filter
        </h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
          <X className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Desktop: Dropdown */}
      <div className="hidden md:block">
        <select
          value={selectedDistance}
          onChange={(e) => onDistanceChange(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {distanceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile: Horizontal Chips */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
        {distanceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onDistanceChange(option.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedDistance === option.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
