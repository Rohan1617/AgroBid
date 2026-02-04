import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContactPage() {
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
                    <CardTitle className="text-3xl font-bold text-center text-primary">Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-gray-700">We'd love to hear from you! Reach out to us for any queries or support.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-white/50">
                            <Mail className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-sm text-gray-600">support@agrobid.com</p>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-white/50">
                            <Phone className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-semibold">Phone</h3>
                            <p className="text-sm text-gray-600">+91 12345 67890</p>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-white/50">
                            <MapPin className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-semibold">Address</h3>
                            <p className="text-sm text-gray-600">CDAC, Pune, India</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
