"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Truck, Package, DollarSign, User, LogOut } from "lucide-react"

export default function RiderDashboard() {
  const router = useRouter()

  // Mock user data from localStorage
  const [riderName, setRiderName] = useState<string>("rider")
  const [orders, setOrders] = useState<Array<{ id: number, customer: string, address: string, status: string }>>([])
  const [earnings, setEarnings] = useState<number>(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user?.type !== "rider" || !user.isLoggedIn) {
        router.push("/login")
      } else {
        setRiderName(user.name || user.email)
        // TODO: Fetch orders & earnings from API, here mocked:
        setOrders([
          { id: 101, customer: "Alice", address: "123 Main St", status: "Picked Up" },
          { id: 102, customer: "Bob", address: "456 Oak Ave", status: "On The Way" },
          { id: 103, customer: "Charlie", address: "789 Pine Rd", status: "Delivered" },
        ])
        setEarnings(150.75)
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-orange-500">Welcome, {riderName}</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-[5px]"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <Card className="bg-white dark:bg-gray-800 rounded-[5px] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <DollarSign className="h-6 w-6" />
              Earnings
            </CardTitle>
            <CardDescription>Current total earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-900 dark:text-white">${earnings.toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Current Orders */}
        <Card className="col-span-2 bg-white dark:bg-gray-800 rounded-[5px] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <Truck className="h-6 w-6" />
              Current Orders
            </CardTitle>
            <CardDescription>Orders assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No orders assigned currently.</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <li key={order.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer} — {order.address}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Picked Up"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Bottom navigation buttons */}
      <nav className="max-w-7xl mx-auto mt-8 flex gap-4 justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-[5px]"
          onClick={() => router.push("/rider/profile")}
        >
          <User className="h-5 w-5" />
          Profile
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-[5px]"
          onClick={() => router.push("/rider/deliveries")}
        >
          <Package className="h-5 w-5" />
          Past Deliveries
        </Button>
      </nav>
    </div>
  )
}
