import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function VendorsPage() {
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
                    <CardTitle className="text-3xl font-bold text-center text-primary">For Vendors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-lg text-gray-700">
                        Source fresh produce directly from farms at competitive rates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <h3 className="font-bold text-lg">Place Bids</h3>
                            <p className="text-sm text-gray-600">Competitive bidding</p>
                        </div>
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <h3 className="font-bold text-lg">Secure Payments</h3>
                            <p className="text-sm text-gray-600">Protected transactions</p>
                        </div>
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <h3 className="font-bold text-lg">Quality Assurance</h3>
                            <p className="text-sm text-gray-600">Direct from source</p>
                        </div>
                    </div>

                    <Button asChild size="lg">
                        <Link href="/vendor-dashboard">Go to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
