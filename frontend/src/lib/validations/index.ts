import { z } from 'zod'

// ─── Category ────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.partial()

// ─── RentalUnit ──────────────────────────────────────────────────────────────

export const createUnitSchema = z.object({
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  name: z.string().min(2, 'Nama minimal 2 karakter').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  description: z.string().max(2000).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  facilities: z.array(z.string()).default([]),
  rentalTerms: z.string().max(5000).optional(),
  dailyRate: z.coerce.number().positive('Tarif harian harus lebih dari 0'),
  depositAmount: z.coerce.number().min(0).default(0),
  operationalStatus: z.enum(['AVAILABLE', 'MAINTENANCE', 'RETIRED']).default('AVAILABLE'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const updateUnitSchema = createUnitSchema.partial()

// ─── Booking ─────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  unitId: z.string().min(1),
  customerName: z.string().min(2, 'Nama minimal 2 karakter').max(200),
  customerPhone: z.string().min(9, 'Nomor telepon minimal 9 digit').max(20).regex(/^\+?[0-9\s-]+$/, 'Format nomor telepon tidak valid'),
  customerEmail: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  startAt: z.string().datetime({ message: 'Format tanggal mulai tidak valid' }),
  endAt: z.string().datetime({ message: 'Format tanggal selesai tidak valid' }),
  pickupOption: z.enum(['SELF_PICKUP', 'DELIVERY']).default('SELF_PICKUP'),
  deliveryLocation: z.string().max(500).optional(),
  extraCost: z.coerce.number().min(0).default(0),
  customerNotes: z.string().max(1000).optional(),
}).refine((data) => {
  const start = new Date(data.startAt)
  const end = new Date(data.endAt)
  return end > start
}, {
  message: 'Tanggal selesai harus setelah tanggal mulai',
  path: ['endAt'],
}).refine((data) => {
  const start = new Date(data.startAt)
  return start > new Date()
}, {
  message: 'Tanggal mulai harus di masa depan',
  path: ['startAt'],
})

// ─── Booking Status Update ────────────────────────────────────────────────────

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED']),
  adminNotes: z.string().max(1000).optional(),
})

// ─── PaymentRecord ────────────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.coerce.number().positive('Jumlah pembayaran harus lebih dari 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'OTHER']).default('CASH'),
  paidAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
})

// ─── BusinessSetting ──────────────────────────────────────────────────────────

export const updateBusinessSettingSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  whatsappNumber: z.string().regex(/^\d{10,15}$/, 'Format nomor WhatsApp tidak valid (format internasional tanpa +)').optional(),
  address: z.string().max(500).optional(),
  businessHours: z.string().optional(),
  socialMedia: z.string().optional(),
  privacyPolicy: z.string().optional(),
  rentalTerms: z.string().optional(),
  holdDurationMinutes: z.coerce.number().min(5).max(1440).optional(),
  timezone: z.string().optional(),
})

// ─── Catalog Filter ───────────────────────────────────────────────────────────

export const catalogFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest']).default('newest'),
  available: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

// ─── Admin Login ──────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdateBusinessSettingInput = z.infer<typeof updateBusinessSettingSchema>
export type CatalogFilterInput = z.infer<typeof catalogFilterSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
