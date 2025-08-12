"use client"

import { useState } from "react"
import { MapPin, Search, ArrowLeft, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LocationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const router = useRouter()

  const recentAddresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Downtown, City",
      type: "home",
    },
    {
      id: 2,
      name: "Office",
      address: "456 Business Ave, Corporate District",
      type: "work",
    },
    {
      id: 3,
      name: "Mom's Place",
      address: "789 Family Lane, Suburbs",
      type: "other",
    },
  ]

  const suggestedLocations = [
    "Downtown Plaza, Main Street",
    "Central Mall, Shopping District",
    "University Campus, College Road",
    "Airport Terminal, Aviation Way",
    "Beach Resort, Coastal Highway",
  ]

  const detectCurrentLocation = () => {
    setIsDetecting(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding
          setTimeout(() => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "Current Location - 123 Main Street, Downtown",
            })
            setIsDetecting(false)
          }, 2000)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsDetecting(false)
          alert("Unable to detect location. Please enter manually.")
        },
      )
    } else {
      setIsDetecting(false)
      alert("Geolocation is not supported by this browser.")
    }
  }

  const selectLocation = (address) => {
    // Store selected location
    localStorage.setItem(
      "selectedLocation",
      JSON.stringify({
        address: address,
        timestamp: new Date().toISOString(),
      }),
    )

    // Redirect back to home
    router.push("/")
  }

  const filteredSuggestions = suggestedLocations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
            </div>
            <h1 className="text-xl font-semibold">Select Location</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Current Location Detection */}
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={detectCurrentLocation}
              disabled={isDetecting}
              className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>{isDetecting ? "Detecting location..." : "Use Current Location"}</span>
            </Button>

            {currentLocation && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">{currentLocation.address}</span>
                </div>
                <Button
                  onClick={() => selectLocation(currentLocation.address)}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  Confirm This Location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-4 space-y-2">
                {filteredSuggestions.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => selectLocation(location)}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex items-center space-x-3"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{location}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Addresses */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <h3 className="font-semibold">Recent Addresses</h3>
            </div>

            <div className="space-y-3">
              {recentAddresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => selectLocation(address.address)}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        {address.type === "home" && "🏠"}
                        {address.type === "work" && "🏢"}
                        {address.type === "other" && "📍"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{address.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{address.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Enter Address Manually</h3>
            <div className="space-y-3">
              <Input placeholder="House/Flat/Office No." />
              <Input placeholder="Area/Sector/Locality" />
              <Input placeholder="Landmark (Optional)" />
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => selectLocation("Manual Address Entry")}
              >
                Save Address
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
