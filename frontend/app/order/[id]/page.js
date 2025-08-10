"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Phone, MessageCircle, CheckCircle, Truck, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function OrderTrackingPage() {
  const params = useParams()
  const [orderData, setOrderData] = useState(null)
  const [currentStatus, setCurrentStatus] = useState(0)

  const orderStatuses = [
    {
      id: 0,
      name: "Order Confirmed",
      description: "Your order has been confirmed",
      icon: <CheckCircle className="h-5 w-5" />,
      time: "2 min ago",
    },
    {
      id: 1,
      name: "Preparing Food",
      description: "Restaurant is preparing your order",
      icon: <Package className="h-5 w-5" />,
      time: "5 min ago",
    },
    {
      id: 2,
      name: "Out for Delivery",
      description: "Your order is on the way",
      icon: <Truck className="h-5 w-5" />,
      time: "Expected in 15 min",
    },
    {
      id: 3,
      name: "Delivered",
      description: "Order delivered successfully",
      icon: <Home className="h-5 w-5" />,
      time: "",
    },
  ]

  const riderInfo = {
    name: "Alex Johnson",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    vehicle: "Motorcycle",
    image: "/placeholder.svg?height=60&width=60",
  }

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem(`order_${params.id}`) || "null")
    if (savedOrder) {
      setOrderData(savedOrder)
    }

    // Simulate order progress
    const progressInterval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (prev < 3) {
          return prev + 1
        }
        clearInterval(progressInterval)
        return prev
      })
    }, 10000) // Progress every 10 seconds

    return () => clearInterval(progressInterval)
  }, [params.id])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The order you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = ((currentStatus + 1) / orderStatuses.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold">Order #{orderData.orderId}</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Status</CardTitle>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {orderStatuses[currentStatus].name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              {orderStatuses.map((status, index) => (
                <div key={status.id} className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStatus ? "bg-orange-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    {status.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        index <= currentStatus ? "text-gray-900 dark:text-white" : "text-gray-400"
                      }`}
                    >
                      {status.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{status.description}</p>
                    {status.time && <p className="text-xs text-gray-500 dark:text-gray-500">{status.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Partner */}
          {currentStatus >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Delivery Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Image
                    src={riderInfo.image || "/placeholder.svg"}
                    alt={riderInfo.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{riderInfo.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>★ {riderInfo.rating}</span>
                      <span>•</span>
                      <span>{riderInfo.vehicle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Delivery Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">123 Main Street, Downtown</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Apartment 4B, Near Central Park</p>
                {orderData.deliveryInstructions && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Instructions: </span>
                      {orderData.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${orderData.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & Fees</span>
                <span>${orderData.taxes.toFixed(2)}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${orderData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Paid</span>
                <span className="text-orange-500">${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400">Having issues with your order? We're here to help!</p>
              <div className="flex space-x-4 justify-center">
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
