"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Calendar, Car, Check, Edit, LogOut, Mail, MapPin, Phone, Settings, Star, User } from "lucide-react"
import DynamicNavbar from "@/components/dynamic-navbar"

const userData = {
  id: "user123",
  name: "ajay advik",
  email: "alex.johnson@example.com",
  phone: "(555) 123-4567",
  avatar: "/perlogo.jpg?height=128&width=128",
  university: "State University",
  major: "Computer Science",
  graduationYear: "2026",
  bio: "Computer Science student passionate about technology and sustainability. Love attending campus events and meeting new people.",
  address: "123 Campus Drive, University Heights",
  joinDate: "January 2023",
  ridesOffered: 12,
  ridesTaken: 8,
  rating: 4.8,
  verified: true,
  carModel: "Honda Civic",
  carYear: "2020",
  carColor: "Blue",
  licensePlate: "ABC123",
  drivingLicense: "DL12345678",
  paymentMethods: [
    {
      id: "pm1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ],
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showRideHistory: true,
    },
  },
}

// Mock ride history
const rideHistory = [
  {
    id: "ride1",
    eventName: "Spring Music Festival",
    date: "April 15, 2025",
    role: "driver",
    passengers: 3,
    earnings: 15.0,
    status: "completed",
  },
  {
    id: "ride2",
    eventName: "Basketball Championship",
    date: "April 20, 2025",
    role: "driver",
    passengers: 3,
    earnings: 12.0,
    status: "completed",
  },
  {
    id: "ride3",
    eventName: "Career Fair",
    date: "April 22, 2025",
    role: "driver",
    passengers: 2,
    earnings: 8.0,
    status: "upcoming",
  },
]

export default function DriverProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(userData)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleProfileUpdate = () => {
    setIsEditing(false)
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="driver" userName={profile.name} userAvatar={profile.avatar} />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Driver Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50"
          >
            <Alert className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 w-72">
              <Check className="h-4 w-4 mr-2" />
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                      <AvatarImage src={profile.avatar || "/perlogo.jpg"} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold">{profile.name}</h2>
                    <div className="flex items-center mt-1">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified Driver
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(profile.rating) ? "fill-current" : "text-gray-300 dark:text-gray-600"}`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{profile.rating}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-3" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-3" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-3" />
                      <span>{profile.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-3" />
                      <span>Member since {profile.joinDate}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Car className="h-4 w-4 mr-3" />
                      <span>
                        {profile.carYear} {profile.carColor} {profile.carModel}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {profile.ridesOffered}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Rides Offered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">₹ 3,450</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="rides">Ride History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>View and update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="university">University</Label>
                              <Input
                                id="university"
                                value={profile.university}
                                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="major">Major</Label>
                              <Input
                                id="major"
                                value={profile.major}
                                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="graduation">Graduation Year</Label>
                              <Input
                                id="graduation"
                                value={profile.graduationYear}
                                onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={profile.address}
                              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              rows={4}
                              value={profile.bio}
                              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">About Me</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{profile.bio}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-medium">Education</h3>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">University</div>
                                  <div>{profile.university}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Major</div>
                                  <div>{profile.major}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Graduation Year</div>
                                  <div>{profile.graduationYear}</div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium">Driver Statistics</h3>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Rides Offered</div>
                                  <div>{profile.ridesOffered}</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</div>
                                  <div>₹ 3,450</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                                  <div className="flex items-center">
                                    {profile.rating}
                                    <Star className="h-4 w-4 ml-1 text-yellow-500 fill-current" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    {isEditing && (
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Save Changes
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="vehicle">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vehicle Information</CardTitle>
                      <CardDescription>View and update your vehicle details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="carModel">Car Model</Label>
                              <Input
                                id="carModel"
                                value={profile.carModel}
                                onChange={(e) => setProfile({ ...profile, carModel: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="carYear">Car Year</Label>
                              <Input
                                id="carYear"
                                value={profile.carYear}
                                onChange={(e) => setProfile({ ...profile, carYear: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="carColor">Car Color</Label>
                              <Input
                                id="carColor"
                                value={profile.carColor}
                                onChange={(e) => setProfile({ ...profile, carColor: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="licensePlate">License Plate</Label>
                              <Input
                                id="licensePlate"
                                value={profile.licensePlate}
                                onChange={(e) => setProfile({ ...profile, licensePlate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="drivingLicense">Driving License Number</Label>
                            <Input
                              id="drivingLicense"
                              value={profile.drivingLicense}
                              onChange={(e) => setProfile({ ...profile, drivingLicense: e.target.value })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-medium">Vehicle Details</h3>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Car Model</div>
                                  <div>{profile.carModel}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Year</div>
                                  <div>{profile.carYear}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Color</div>
                                  <div>{profile.carColor}</div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium">License Information</h3>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">License Plate</div>
                                  <div>{profile.licensePlate}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Driving License</div>
                                  <div>{profile.drivingLicense}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Verification Status</div>
                                  <div className="flex items-center">
                                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                      <Check className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    {isEditing && (
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Save Changes
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="rides">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ride History</CardTitle>
                      <CardDescription>View your past and upcoming rides</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rideHistory.map((ride) => (
                          <div
                            key={ride.id}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{ride.eventName}</h4>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{ride.date}</div>
                              </div>
                              <Badge
                                className={
                                  ride.status === "completed"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                }
                              >
                                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                              <Car className="h-4 w-4 mr-1 text-violet-500" />
                              <span className="text-violet-600 dark:text-violet-400 font-medium">Driver</span>
                              <span className="mx-2">•</span>
                              <span>{ride.passengers} passengers</span>
                              <span className="mx-2">•</span>
                              <span className="text-green-600 dark:text-green-400">
                                ₹{ride.earnings.toFixed(2)} earned
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notifications</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="email-notifications" className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Email Notifications
                              </Label>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span
                                  className={`${
                                    profile.preferences.notifications.email
                                      ? "translate-x-6 bg-green-500"
                                      : "translate-x-1 bg-white"
                                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="push-notifications" className="flex items-center">
                                <Bell className="h-4 w-4 mr-2" />
                                Push Notifications
                              </Label>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span
                                  className={`${
                                    profile.preferences.notifications.push
                                      ? "translate-x-6 bg-green-500"
                                      : "translate-x-1 bg-white"
                                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sms-notifications" className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                SMS Notifications
                              </Label>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span
                                  className={`${
                                    profile.preferences.notifications.sms
                                      ? "translate-x-6 bg-green-500"
                                      : "translate-x-1 bg-white"
                                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">Privacy</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-profile" className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Show Profile to Other Users
                              </Label>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span
                                  className={`${
                                    profile.preferences.privacy.showProfile
                                      ? "translate-x-6 bg-green-500"
                                      : "translate-x-1 bg-white"
                                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-ride-history" className="flex items-center">
                                <Car className="h-4 w-4 mr-2" />
                                Show Ride History
                              </Label>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span
                                  className={`${
                                    profile.preferences.privacy.showRideHistory
                                      ? "translate-x-6 bg-green-500"
                                      : "translate-x-1 bg-white"
                                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">Account</h3>
                          <div className="space-y-4">
                            <Button variant="outline" className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Change Password
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => (window.location.href = "/dashboard/driver/logout")}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Log Out
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
