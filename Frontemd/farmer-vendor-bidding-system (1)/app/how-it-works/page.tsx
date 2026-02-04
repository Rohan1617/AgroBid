import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export default function HowItWorksPage() {
    const steps = [
        { title: "Register", desc: "Sign up as a Farmer or Vendor." },
        { title: "List Crops", desc: "Farmers upload crop details and expected prices." },
        { title: "Bidding", desc: "Vendors place bids on active listings." },
        { title: "Acceptance", desc: "Farmers select the best bid." },
        { title: "Payment & Delivery", desc: "Secure transaction and crop delivery." }
    ]

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
                    <CardTitle className="text-3xl font-bold text-center text-primary">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-1">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-white/50">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
