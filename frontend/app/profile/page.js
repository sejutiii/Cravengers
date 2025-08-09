"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CustomerProfilePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)

    if (user.type !== "customer") {
      router.push("/login")
    }

    // You can fetch from API here
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Save logic goes here - in real app, you'd call an API
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    const updatedUser = { ...userData, ...formData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    alert("Profile updated successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-[5px] shadow-md bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-orange-500 text-2xl">Your Profile</CardTitle>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-[5px] flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your delivery address"
              />
            </div>

            <Button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white transition-transform hover:scale-105 rounded-[5px] flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
