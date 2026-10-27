import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format angka ke format Rupiah
 * @example formatRupiah(150000) => "Rp150.000"
 */
export function formatRupiah(amount: number | string | { toString(): string } | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp0'
  const num = typeof amount === 'number' ? amount : parseFloat(amount.toString())
  if (isNaN(num)) return 'Rp0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format tanggal ke DD/MM/YYYY
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format tanggal dan waktu ke DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Hitung durasi sewa dalam hari
 * Menggunakan setengah terbuka [startAt, endAt)
 */
export function calculateDuration(startAt: Date, endAt: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = endAt.getTime() - startAt.getTime()
  return Math.max(1, Math.ceil(diff / msPerDay))
}

/**
 * Generate reference code untuk booking
 */
export function generateReferenceCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GR-${timestamp}-${random}`
}

/**
 * Slugify string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format nomor WhatsApp
 */
export function formatWhatsApp(number: string): string {
  // Remove all non-digits
  return number.replace(/\D/g, '')
}

/**
 * Build WhatsApp URL
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = formatWhatsApp(number)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
