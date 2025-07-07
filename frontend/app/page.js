"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, ShoppingCart, User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const [location, setLocation] = useState("Detecting location...")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Simulate location detection
    setTimeout(() => {
      setLocation("123 Main Street, Downtown")
    }, 2000)

    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
  }, [])

  const categories = [
    { name: "Pizza", icon: "🍕", color: "bg-red-100 dark:bg-red-900" },
    { name: "Burger", icon: "🍔", color: "bg-yellow-100 dark:bg-yellow-900" },
    { name: "Chinese", icon: "🥡", color: "bg-green-100 dark:bg-green-900" },
    { name: "Desserts", icon: "🍰", color: "bg-pink-100 dark:bg-pink-900" },
    { name: "Healthy", icon: "🥗", color: "bg-emerald-100 dark:bg-emerald-900" },
    { name: "Indian", icon: "🍛", color: "bg-orange-100 dark:bg-orange-900" },
  ]

  const restaurants = [
    {
      id: 1,
      name: "Mario's Pizza Palace",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.5,
      deliveryTime: "25-35 min",
      deliveryFee: "$2.99",
      cuisine: "Italian, Pizza",
      discount: "20% OFF",
    },
    {
      id: 2,
      name: "Burger Kingdom",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.3,
      deliveryTime: "20-30 min",
      deliveryFee: "$1.99",
      cuisine: "American, Burgers",
    },
    {
      id: 3,
      name: "Dragon Wok",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      deliveryTime: "30-40 min",
      deliveryFee: "$3.49",
      cuisine: "Chinese, Asian",
      discount: "Free Delivery",
    },
    {
      id: 4,
      name: "Spice Garden",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.4,
      deliveryTime: "35-45 min",
      deliveryFee: "$2.49",
      cuisine: "Indian, Curry",
    },
  ]

  const handleRestaurantClick = (restaurantId) => {
    // In a real app, this would navigate to the restaurant page
    alert(`Opening restaurant ${restaurantId}. In the full app, this would navigate to /restaurant/${restaurantId}`)
  }

  const handleLocationClick = () => {
    alert("In the full app, this would open the location selection page")
  }

  const handleLoginClick = () => {
    alert("In the full app, this would navigate to the login page")
  }

  const handleCartClick = () => {
    alert("In the full app, this would navigate to the cart page")
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-orange-500">Cravangers</h1>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 flex-1 max-w-md mx-8">
                <MapPin className="h-5 w-5 text-orange-500" />
                <button onClick={handleLocationClick} className="text-sm hover:text-orange-500 truncate">
                  {location}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={handleLoginClick}>
                  <User className="h-5 w-5" />
                </Button>

                <button onClick={handleCartClick} className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-orange-500 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Craving something delicious?</h2>
              <p className="text-orange-100">Order from your favorite restaurants</p>
            </div>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="pl-12 h-14 text-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="py-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <p className="font-medium text-sm">{category.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Restaurants */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Popular Restaurants</h3>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  className="text-left w-full"
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <Image
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {restaurant.discount && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">{restaurant.discount}</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg mb-1">{restaurant.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{restaurant.cuisine}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">★</span>
                          <span>{restaurant.rating}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">{restaurant.deliveryTime}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Delivery: {restaurant.deliveryFee}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Navigation */}
        <section className="py-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Explore Cravangers Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleLoginClick}>
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Login / Signup</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access your account or create new one</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleLocationClick}>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set your delivery location</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRestaurantClick(1)}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-4 block">🍕</span>
                  <h4 className="font-semibold mb-2">Browse Menu</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Explore restaurant menus</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCartClick}>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Cart & Checkout</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review and place your order</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-orange-500 mb-4">Cravangers</h3>
                <p className="text-gray-400">Your favorite food delivery app. Fast, reliable, and delicious.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button className="hover:text-white">About Us</button>
                  </li>
                  <li>
                    <button className="hover:text-white">Careers</button>
                  </li>
                  <li>
                    <button className="hover:text-white">Contact</button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button className="hover:text-white">Help Center</button>
                  </li>
                  <li>
                    <button className="hover:text-white">Safety</button>
                  </li>
                  <li>
                    <button className="hover:text-white">Terms</button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Partner with us</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button className="hover:text-white">Restaurant Partner</button>
                  </li>
                  <li>
                    <button className="hover:text-white">Delivery Partner</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Cravangers. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
