"use client"
//comment
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("customer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: formData.email,
        type: userType,
        isLoggedIn: true,
      })
    )

    if (userType === "restaurant") {
      router.push("/restaurant-dashboard")
    } else if (userType === "rider") {
      router.push("/rider-dashboard")
    } else {
      router.push("/")
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo Header */}
        <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="h-16 flex items-center justify-center w-full">
            <a href="/" className="flex items-center justify-center">
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
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
            Welcome back!
          </p>
        </div>

        {/* Form Card */}
        <Card className="border border-orange-500 shadow-xl rounded-xl transition duration-300 hover:shadow-orange-500/40 hover:border-orange-400">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type Select */}
              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                 
  <SelectContent className="bg-white text-gray-800">
  <SelectItem
    value="customer"
    className="flex items-center gap-3 pl-8 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white cursor-pointer"
  >
    Customer
  </SelectItem>
  <SelectItem
    value="rider"
    className="flex items-center gap-3 pl-8 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white cursor-pointer"
  >
    Delivery Rider
  </SelectItem>
  <SelectItem
    value="restaurant"
    className="flex items-center gap-3 pl-8 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white cursor-pointer"
  >
    Restaurant Partner
  </SelectItem>
</SelectContent>

                </Select>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button (Smaller) */}
              <Button
                type="submit"
                className="w-full py-2 text-sm bg-orange-500 hover:bg-orange-600 transition-transform duration-200 hover:scale-105"
              >
                Sign In
              </Button>
            </form>

            {/* Sign Up Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Don't have an account?
              </p>
              <div className="space-y-2">
                <Link href="/signup/customer">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent transition-colors duration-200 hover:bg-orange-500 hover:text-white hover:scale-105"
                  >
                    Sign up as Customer
                  </Button>
                </Link>
                <Link href="/signup/rider">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent transition-colors duration-200 hover:bg-orange-500 hover:text-white hover:scale-105"
                  >
                    Sign up as Rider
                  </Button>
                </Link>
                <Link href="/signup/restaurant">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent transition-colors duration-200 hover:bg-orange-500 hover:text-white hover:scale-105"
                  >
                    Sign up as Restaurant
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
