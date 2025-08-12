"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function SignupPage() {
  const params = useParams()
  const router = useRouter()
  const userType = params.type
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    fullName: "",
    address: "",
    vehicleType: "",
    licenseNumber: "",
    restaurantName: "",
    businessAddress: "",
    cuisineType: "",
    description: "",
    businessLicense: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    localStorage.setItem("user", JSON.stringify({
      email: formData.email,
      type: userType,
      isLoggedIn: true,
      name: userType === "restaurant" ? formData.restaurantName : formData.fullName,
    }))
    router.push("/login")
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getTitle = () => {
    switch (userType) {
      case "customer": return "Join as Customer"
      case "rider": return "Become a Delivery Partner"
      case "restaurant": return "Partner with Us"
      default: return "Sign Up"
    }
  }

  const getDescription = () => {
    switch (userType) {
      case "customer": return "Create your account to start ordering delicious food"
      case "rider": return "Start earning by delivering food in your area"
      case "restaurant": return "Grow your business with Cravangers"
      default: return "Create your account"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header aligned like homepage */}
        <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="h-16 flex items-center justify-center w-full">
            <Link href="/login" className="absolute left-4 text-orange-500 hover:text-orange-600 inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <a href="/" className="flex justify-center w-full">
              <img
                src="/Cravengers.png"
                alt="Cravengers Logo"
                width={160}
                height={50}
                priority
                className="object-contain"
              />
            </a>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">{getDescription()}</p>
        </div>

        <Card className="border border-orange-500 shadow-xl rounded-xl transition duration-300 hover:shadow-orange-500/40 hover:border-orange-400">
          <CardHeader>
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>Fill in your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{userType === "restaurant" ? "Contact Person Name" : "Full Name"}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                />
              </div>

              {/* Role-specific Fields */}
              {userType === "restaurant" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cuisineType">Cuisine Type</Label>
                      <Input
                        id="cuisineType"
                        name="cuisineType"
                        value={formData.cuisineType}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessLicense">Business License</Label>
                      <Input
                        id="businessLicense"
                        name="businessLicense"
                        value={formData.businessLicense}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Restaurant Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                  </div>
                </>
              )}

              {userType === "rider" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Input
                      id="vehicleType"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                  </div>
                </div>
              )}

              {userType === "customer" && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  />
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600">Terms and Conditions</Link> and{" "}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600">Privacy Policy</Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 transition-transform duration-200 hover:scale-105"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 hover:text-orange-600">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
