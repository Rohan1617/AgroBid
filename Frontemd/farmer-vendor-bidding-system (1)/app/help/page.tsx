import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function HelpCenterPage() {
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
                    <CardTitle className="text-3xl font-bold text-center text-primary">Help Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-lg text-gray-700">
                        Need assistance? Browse our guides or contact support.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="p-6 border rounded-lg bg-white/50">
                            <h3 className="font-semibold text-xl mb-2">User Guides</h3>
                            <p className="text-sm text-gray-600 mb-4">Detailed documentation on how to use the platform.</p>
                            <Button asChild variant="outline">
                                <Link href="/how-it-works">Go to Guides</Link>
                            </Button>
                        </div>
                        <div className="p-6 border rounded-lg bg-white/50">
                            <h3 className="font-semibold text-xl mb-2">Support Team</h3>
                            <p className="text-sm text-gray-600 mb-4">Direct assistance for account or technical issues.</p>
                            <Button asChild>
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
