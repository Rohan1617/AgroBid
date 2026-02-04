"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Chrome, Facebook, Sprout, Briefcase, Home } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

type UserRole = "vendor" | "farmer" | null

export default function LoginPage() {
  const router = useRouter()

  const [userRole, setUserRole] = useState<UserRole>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ EMAIL LOGIN (REAL BACKEND CALL)
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userRole) {
      alert("Please select role")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.message || "Invalid credentials")
        return
      }

      // 🔐 Save auth data
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.userId)
      localStorage.setItem("role", data.role)

      // 🔍 VERIFY ROLE MATCH
      const backendRole = data.role.toUpperCase() // e.g., "FARMER"
      const selectedRole = userRole?.toUpperCase() // e.g., "VENDOR"

      if (backendRole !== selectedRole) {
        alert(`❌ Account Role Mismatch!\n\nYou are registered as a ${backendRole}, but you are trying to login as a ${selectedRole}.\n\nPlease switch to the "${backendRole === "FARMER" ? "Login as Farmer" : "Login as Vendor"}" tab.`)
        return
      }

      // 🔀 Redirect based on BACKEND role (TRUST SERVER)
      if (data.role === "FARMER") {
        router.push("/farmer-dashboard")
      } else if (data.role === "VENDOR") {
        router.push("/vendor-dashboard")
      } else {
        alert("Unknown role: " + data.role)
      }

    } catch (error) {
      console.error("Login error:", error)
      alert("❌ Cannot connect to server. Is backend running?")
    } finally {
      setLoading(false)
    }
  }

  // 🚧 MOBILE / OTP LOGIN (NOT IMPLEMENTED IN BACKEND)
  const handleMobileLogin = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Mobile login not implemented yet")
  }

  // 🚧 SOCIAL LOGIN (NOT IMPLEMENTED)
  const handleSocialLogin = () => {
    alert("Social login not implemented yet")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4 z-50">
        <Button asChild variant="outline" size="sm" className="gap-2 shadow-md bg-transparent">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Select your role and login to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ROLE SELECTION */}
          <div className="mb-6 space-y-3">
            <Label>Select Your Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserRole("vendor")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 ${userRole === "vendor"
                  ? "border-primary bg-primary/10"
                  : "border-border"
                  }`}
              >
                <Briefcase className="h-6 w-6 mb-2" />
                Login as Vendor
              </button>

              <button
                type="button"
                onClick={() => setUserRole("farmer")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 ${userRole === "farmer"
                  ? "border-primary bg-primary/10"
                  : "border-border"
                  }`}
              >
                <Sprout className="h-6 w-6 mb-2" />
                Login as Farmer
              </button>
            </div>
          </div>

          {/* LOGIN TABS */}
          <Tabs defaultValue="email">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !userRole}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="mobile">
              <form onSubmit={handleMobileLogin} className="space-y-4">
                <Input placeholder="Mobile number" />
                <Input placeholder="OTP" />
                <Button type="submit" className="w-full" disabled>
                  Mobile Login (Coming Soon)
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold">
              Register Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}