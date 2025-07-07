export interface Delegate {
  _id: string
  title: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber: string
  nationality: string
  organization: string
  position: string
  delegateType: string
  attendanceMode: "physical" | "virtual"
  status: "approved" | "pending" | "rejected"
  profilePicture?: string
  eventYear: number
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
    email: string
  }
  accommodationDetails?: {
    hotelName: string
    checkIn: string
    checkOut: string
    roomPreference: string
  }
  socialMedia?: {
    linkedin?: string
    twitter?: string
  }
  bio?: string
  languagesSpoken: string[]
  preferredLanguage: string
  hasCheckedIn: boolean
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationPayload {
  title: string
  body: string
  sound?: string
  data?: Record<string, any>
}
