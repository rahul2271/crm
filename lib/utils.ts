import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) { return clsx(inputs) }

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}
export function formatNumber(n: number) { return new Intl.NumberFormat('en-IN').format(n) }
export function formatPercent(n: number) { return `${n.toFixed(1)}%` }
export function formatDate(d: Date | string) { return format(new Date(d), 'dd MMM yyyy') }
export function todayString() { return format(new Date(), 'yyyy-MM-dd') }
export function conversionRate(converted: number, total: number) {
  return total === 0 ? 0 : Math.round((converted / total) * 1000) / 10
}

export const AGE_GROUPS = ['0-18', '18-35', '35-60', '60+'] as const

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry',
]
