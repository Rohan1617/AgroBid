import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="fixed top-4 right-4 z-50">
                <Button asChild variant="outline" size="sm" className="gap-2 shadow-md bg-white">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Link>
                </Button>
            </div>

            <Card className="max-w-4xl mx-auto shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-primary">About Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg text-gray-700">
                        Welcome to the Farmer–Vendor Bidding System. We are dedicated to bridging the gap between hardworking farmers and market vendors.
                    </p>
                    <p className="text-gray-700">
                        Our platform provides a transparent, efficient, and fair marketplace where farmers can list their crops and vendors can place bids, ensuring the best prices for everyone.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
