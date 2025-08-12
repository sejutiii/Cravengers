"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Clock, Truck, Plus, Minus, ShoppingCart, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Sample restaurant data
  const restaurant = {
    id: params.id,
    name: "Mario's Pizza Palace",
    image: "/placeholder.svg?height=300&width=600",
    rating: 4.5,
    reviews: 1250,
    deliveryTime: "25-35 min",
    deliveryFee: "$2.99",
    cuisine: "Italian, Pizza",
    address: "123 Pizza Street, Downtown",
    description: "Authentic Italian pizzas made with fresh ingredients and traditional recipes.",
    discount: "20% OFF on orders above $25",
  }

  const categories = [
    { id: "all", name: "All Items" },
    { id: "pizza", name: "Pizza" },
    { id: "pasta", name: "Pasta" },
    { id: "appetizers", name: "Appetizers" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
  ]

  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella cheese, basil leaves",
      price: 12.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "pizza",
      popular: true,
      vegetarian: true,
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Pepperoni, mozzarella cheese, tomato sauce",
      price: 15.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "pizza",
      popular: true,
    },
    {
      id: 3,
      name: "Chicken Alfredo Pasta",
      description: "Grilled chicken, creamy alfredo sauce, parmesan",
      price: 14.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "pasta",
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan, caesar dressing",
      price: 8.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "appetizers",
      vegetarian: true,
    },
    {
      id: 5,
      name: "Garlic Bread",
      description: "Fresh baked bread with garlic butter and herbs",
      price: 5.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "appetizers",
      vegetarian: true,
    },
    {
      id: 6,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 6.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "desserts",
      vegetarian: true,
    },
    {
      id: 7,
      name: "Coca Cola",
      description: "Refreshing soft drink",
      price: 2.99,
      image: "/placeholder.svg?height=150&width=150",
      category: "beverages",
    },
  ]

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(savedCart)
  }, [])

  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      const newCart = cart.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
      )
      updateCart(newCart)
    } else {
      const newCart = [...cart, { ...item, quantity: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }]
      updateCart(newCart)
    }
  }

  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId)

    if (existingItem && existingItem.quantity > 1) {
      const newCart = cart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
      )
      updateCart(newCart)
    } else {
      const newCart = cart.filter((cartItem) => cartItem.id !== itemId)
      updateCart(newCart)
    }
  }

  const getItemQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="relative">
        <Image
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          width={600}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90">{restaurant.cuisine}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Restaurant Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-gray-600 dark:text-gray-400">({restaurant.reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span>{restaurant.deliveryFee}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{restaurant.description}</p>

            {restaurant.discount && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {restaurant.discount}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Menu */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex space-x-1">
                          {item.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                          {item.vegetarian && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              🌱
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-orange-500">${item.price}</span>
                        <div className="flex items-center space-x-2">
                          {getItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-semibold min-w-[20px] text-center">{getItemQuantity(item.id)}</span>
                              <Button
                                size="icon"
                                className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Link href="/cart">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg font-semibold shadow-lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              View Cart ({getTotalItems()} items) • ${getTotalPrice().toFixed(2)}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
