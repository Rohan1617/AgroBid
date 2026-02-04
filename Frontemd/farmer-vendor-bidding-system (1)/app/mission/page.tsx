import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export default function MissionPage() {
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
                    <CardTitle className="text-3xl font-bold text-center text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg text-gray-700">
                        Our mission is to empower farmers by giving them direct access to markets and fair pricing mechanisms.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Eliminate middlemen exploitation.</li>
                        <li>Ensure fair prices through competitive bidding.</li>
                        <li>Reduce food wastage by speeding up the supply chain.</li>
                        <li>Promote sustainable agriculture.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
