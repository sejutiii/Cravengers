"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(savedCart)
  }, [])

  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId)
      return
    }

    const newCart = cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    updateCart(newCart)
  }

  const removeItem = (itemId) => {
    const newCart = cart.filter((item) => item.id !== itemId)
    updateCart(newCart)
  }

  const applyPromoCode = () => {
    // Sample promo codes
    const promoCodes = {
      SAVE10: { discount: 10, type: "percentage" },
      FLAT5: { discount: 5, type: "fixed" },
      NEWUSER: { discount: 15, type: "percentage" },
    }

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()],
      })
    } else {
      alert("Invalid promo code")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getDeliveryFee = () => {
    return 2.99 // Fixed delivery fee
  }

  const getTaxes = () => {
    return getSubtotal() * 0.08 // 8% tax
  }

  const getDiscount = () => {
    if (!appliedPromo) return 0

    if (appliedPromo.type === "percentage") {
      return getSubtotal() * (appliedPromo.discount / 100)
    } else {
      return appliedPromo.discount
    }
  }

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTaxes() - getDiscount()
  }

  const proceedToCheckout = () => {
    // Store order details
    const orderData = {
      items: cart,
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      taxes: getTaxes(),
      discount: getDiscount(),
      total: getTotal(),
      promoCode: appliedPromo,
      deliveryInstructions,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("currentOrder", JSON.stringify(orderData))
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-xl font-semibold">Cart</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some delicious items to get started</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">Browse Restaurants</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Link>
            <h1 className="text-xl font-semibold">Cart ({cart.length} items)</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Delivery Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Delivering to</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">123 Main Street, Downtown</p>
              </div>
              <Link href="/location" className="ml-auto">
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.restaurantName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold min-w-[20px] text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-lg font-bold text-orange-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Delivery Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special instructions for the delivery person..."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!appliedPromo ? (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={applyPromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">{appliedPromo.code} Applied</p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        -
                        {appliedPromo.type === "percentage" ? `${appliedPromo.discount}%` : `$${appliedPromo.discount}`}{" "}
                        discount
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removePromoCode} className="text-red-500">
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bill Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bill Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${getDeliveryFee().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>${getTaxes().toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">${getTotal().toFixed(2)}</span>
                </div>

                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">25-35 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
