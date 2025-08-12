"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Wallet, MapPin, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("currentOrder") || "null")
    if (!savedOrder) {
      router.push("/cart")
      return
    }
    setOrderData(savedOrder)
  }, [router])

  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      time: "25-35 min",
      price: 2.99,
      description: "Regular delivery",
    },
    {
      id: "express",
      name: "Express Delivery",
      time: "15-20 min",
      price: 5.99,
      description: "Priority delivery",
    },
    {
      id: "scheduled",
      name: "Scheduled Delivery",
      time: "Choose time",
      price: 1.99,
      description: "Deliver at your preferred time",
    },
  ]

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: <span className="text-lg">💵</span>,
    },
  ]

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate order ID
    const orderId = "ORD" + Date.now()

    // Store order in localStorage (in real app, send to backend)
    const finalOrder = {
      ...orderData,
      orderId,
      paymentMethod,
      deliveryOption,
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    }

    localStorage.setItem(`order_${orderId}`, JSON.stringify(finalOrder))
    localStorage.removeItem("cart") // Clear cart
    localStorage.removeItem("currentOrder")

    setIsProcessing(false)
    router.push(`/order/${orderId}`)
  }

  if (!orderData) {
    return <div>Loading...</div>
  }

  const selectedDeliveryOption = deliveryOptions.find((option) => option.id === deliveryOption)
  const totalWithDelivery = orderData.total - orderData.deliveryFee + selectedDeliveryOption.price

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/cart" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-xl font-semibold">Checkout</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium">123 Main Street, Downtown</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apartment 4B, Near Central Park</p>
                </div>
                <Link href="/location">
                  <Button variant="outline" className="w-full bg-transparent">
                    Change Address
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Delivery Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                  {deliveryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description} • {option.time}
                            </p>
                          </div>
                          <span className="font-semibold">${option.price}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                        {method.icon}
                        <span>{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery ({selectedDeliveryOption.name})</span>
                    <span>${selectedDeliveryOption.price.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>${orderData.taxes.toFixed(2)}</span>
                  </div>

                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${orderData.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">${totalWithDelivery.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Place Order • $${totalWithDelivery.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDeliveryOption.time}</p>
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
