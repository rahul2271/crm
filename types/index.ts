// // import type { Types } from 'mongoose'

// // export type UserRole = 'admin' | 'telecaller'
// // export type AgeGroup = '0-18' | '18-35' | '35-60' | '60+'
// // export type ConsultationType = 'online' | 'hospital'

// // /**
// //  * One row = one unique combination of:
// //  *   disease + city + consultationType (+ ageGroup)
// //  *
// //  * Example: 10 diabetes leads split as:
// //  *   Row 1 → Diabetes | Mumbai | Online  | 6 leads | 3 converted | ₹9,000
// //  *   Row 2 → Diabetes | Pune   | Hospital | 4 leads | 2 converted | ₹8,000
// //  */
// // export interface IDiseaseEntry {
// //   disease: string
// //   ageGroup: AgeGroup
// //   city: string
// //   state: string
// //   consultationType: ConsultationType
// //   leadsCount: number
// //   convertedCount: number
// //   revenueGenerated: number   // total ₹ revenue from this row's conversions
// // }

// // export interface IDailyEntry {
// //   _id: Types.ObjectId
// //   telecallerId: Types.ObjectId
// //   date: string             // 'YYYY-MM-DD'
// //   totalLeadsGiven: number  // leads assigned to this telecaller today
// //   entries: IDiseaseEntry[]
// //   notes?: string
// //   createdAt: Date
// //   updatedAt: Date
// // }

// // export interface IUser {
// //   _id: Types.ObjectId
// //   name: string
// //   email: string
// //   password: string
// //   role: UserRole
// //   phone?: string
// //   isActive: boolean
// //   createdAt: Date
// //   updatedAt: Date
// // }

// // export interface IDisease {
// //   _id: Types.ObjectId
// //   name: string
// //   category: string
// //   isActive: boolean
// // }




// import type { Types } from 'mongoose'

// export type UserRole = 'admin' | 'telecaller'
// export type AgeGroup = '0-18' | '18-35' | '35-60' | '60+'
// export type ConsultationType = 'online' | 'hospital' | 'whatsapp' | 'call'

// export const CONSULT_OPTIONS: { value: ConsultationType; label: string; icon: string; color: string }[] = [
//   { value: 'online',    label: 'Online Lead',    icon: '💻', color: 'bg-blue-100 text-blue-700'   },
//   { value: 'hospital',  label: 'Hospital Visit', icon: '🏥', color: 'bg-orange-100 text-orange-700' },
//   { value: 'whatsapp',  label: 'WhatsApp',       icon: '💬', color: 'bg-green-100 text-green-700'  },
//   { value: 'call',      label: 'Phone Call',     icon: '📞', color: 'bg-purple-100 text-purple-700' },
// ]

// export interface IDiseaseEntry {
//   disease: string
//   ageGroup: AgeGroup
//   city: string
//   state: string
//   consultationType: ConsultationType
//   leadsCount: number
//   convertedCount: number
//   revenueGenerated: number
// }

// export interface IDailyEntry {
//   _id: Types.ObjectId
//   telecallerId: Types.ObjectId
//   date: string
//   totalLeadsGiven: number
//   entries: IDiseaseEntry[]
//   notes?: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IUser {
//   _id: Types.ObjectId
//   name: string
//   email: string
//   password: string
//   role: UserRole
//   phone?: string
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IDisease {
//   _id: Types.ObjectId
//   name: string
//   category: string
//   isActive: boolean
// }


// import type { Types } from 'mongoose'

// export type UserRole = 'admin' | 'telecaller'
// export type AgeGroup = '0-18' | '18-35' | '35-60' | '60+'
// export type ConsultationType = 'online' | 'hospital'

// /**
//  * One row = one unique combination of:
//  *   disease + city + consultationType (+ ageGroup)
//  *
//  * Example: 10 diabetes leads split as:
//  *   Row 1 → Diabetes | Mumbai | Online  | 6 leads | 3 converted | ₹9,000
//  *   Row 2 → Diabetes | Pune   | Hospital | 4 leads | 2 converted | ₹8,000
//  */
// export interface IDiseaseEntry {
//   disease: string
//   ageGroup: AgeGroup
//   city: string
//   state: string
//   consultationType: ConsultationType
//   leadsCount: number
//   convertedCount: number
//   revenueGenerated: number   // total ₹ revenue from this row's conversions
// }

// export interface IDailyEntry {
//   _id: Types.ObjectId
//   telecallerId: Types.ObjectId
//   date: string             // 'YYYY-MM-DD'
//   totalLeadsGiven: number  // leads assigned to this telecaller today
//   entries: IDiseaseEntry[]
//   notes?: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IUser {
//   _id: Types.ObjectId
//   name: string
//   email: string
//   password: string
//   role: UserRole
//   phone?: string
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IDisease {
//   _id: Types.ObjectId
//   name: string
//   category: string
//   isActive: boolean
// }




import type { Types } from 'mongoose'

export type UserRole = 'admin' | 'telecaller'
export type AgeGroup = '0-18' | '18-35' | '35-60' | '60+'
export type ConsultationType = 'online' | 'hospital' | 'whatsapp' | 'call' | 'website_booking'

export const CONSULT_OPTIONS: { value: ConsultationType; label: string; icon: string; color: string }[] = [
  { value: 'online',           label: 'Online Lead',      icon: '💻', color: 'bg-blue-100 text-blue-700'    },
  { value: 'hospital',         label: 'Hospital Visit',   icon: '🏥', color: 'bg-orange-100 text-orange-700' },
  { value: 'whatsapp',         label: 'WhatsApp',         icon: '💬', color: 'bg-green-100 text-green-700'   },
  { value: 'call',             label: 'Phone Call',       icon: '📞', color: 'bg-purple-100 text-purple-700' },
  { value: 'website_booking',  label: 'Website Booking',  icon: '🌐', color: 'bg-pink-100 text-pink-700'    },
]

export interface IDiseaseEntry {
  disease: string
  ageGroup: AgeGroup
  city: string
  state: string
  consultationType: ConsultationType
  leadsCount: number
  convertedCount: number
  revenueGenerated: number
}

export interface IDailyEntry {
  _id: Types.ObjectId
  telecallerId: Types.ObjectId
  date: string
  totalLeadsGiven: number
  entries: IDiseaseEntry[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IDisease {
  _id: Types.ObjectId
  name: string
  category: string
  isActive: boolean
}