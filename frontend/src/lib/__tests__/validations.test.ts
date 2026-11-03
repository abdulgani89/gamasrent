import { describe, it, expect } from 'vitest'
import {
  createBookingSchema,
  createUnitSchema,
  catalogFilterSchema,
} from '@/lib/validations'

describe('Zod Validation Schemas', () => {
  describe('createBookingSchema', () => {
    it('should accept valid booking input', () => {
      const validData = {
        unitId: 'unit-123',
        customerName: 'Budi Santoso',
        customerPhone: '081234567890',
        customerEmail: 'budi@example.com',
        startAt: new Date(Date.now() + 86400000).toISOString(),
        endAt: new Date(Date.now() + 172800000).toISOString(),
        pickupOption: 'SELF_PICKUP',
      }

      const result = createBookingSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone number', () => {
      const invalidData = {
        unitId: 'unit-123',
        customerName: 'Budi Santoso',
        customerPhone: '123', // less than 9 digits
        startAt: new Date(Date.now() + 86400000).toISOString(),
        endAt: new Date(Date.now() + 172800000).toISOString(),
      }

      const result = createBookingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid datetime format', () => {
      const invalidData = {
        unitId: 'unit-123',
        customerName: 'Budi Santoso',
        customerPhone: '081234567890',
        startAt: 'invalid-date',
        endAt: 'invalid-date',
      }

      const result = createBookingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('createUnitSchema', () => {
    it('should accept valid unit data', () => {
      const validUnit = {
        categoryId: 'cat-1',
        name: 'Mic Wireless Dual Handheld',
        slug: 'mic-wireless-dual-handheld',
        dailyRate: 75000,
        depositAmount: 50000,
        description: 'Mic wireless 2 unit',
        facilities: ['Baterai AA', 'Receiver UHF'],
        specifications: { 'Frekuensi': 'UHF' },
      }

      const result = createUnitSchema.safeParse(validUnit)
      expect(result.success).toBe(true)
    })

    it('should reject non-positive daily rate', () => {
      const invalidUnit = {
        categoryId: 'cat-1',
        name: 'Palu Sidang',
        slug: 'palu-sidang',
        dailyRate: -10000,
      }

      const result = createUnitSchema.safeParse(invalidUnit)
      expect(result.success).toBe(false)
    })
  })

  describe('catalogFilterSchema', () => {
    it('should provide sensible defaults', () => {
      const result = catalogFilterSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(12)
        expect(result.data.sortBy).toBe('newest')
      }
    })
  })
})
