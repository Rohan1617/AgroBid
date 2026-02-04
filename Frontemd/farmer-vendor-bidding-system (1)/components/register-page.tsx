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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserCircle, Store, Home } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"FARMER" | "VENDOR">("FARMER")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.error || data?.message || "Registration failed")
        return
      }

      alert("✅ Registration successful. Please login.")
      router.push("/login")

    } catch (error) {
      console.error("Register error:", error)
      alert("❌ Cannot connect to server. Make sure backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4 z-50">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register to start bidding on crops
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection */}
            <div>
              <Label>Select Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as "FARMER" | "VENDOR")}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <label
                  className={`border p-4 rounded-lg cursor-pointer text-center ${
                    role === "FARMER" ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  <RadioGroupItem value="FARMER" className="hidden" />
                  <UserCircle className="mx-auto mb-1" />
                  Farmer
                </label>

                <label
                  className={`border p-4 rounded-lg cursor-pointer text-center ${
                    role === "VENDOR" ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  <RadioGroupItem value="VENDOR" className="hidden" />
                  <Store className="mx-auto mb-1" />
                  Vendor
                </label>
              </RadioGroup>
            </div>

            {/* Inputs */}
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label>Mobile</Label>
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : `Register as ${role}`}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}