import { describe, it, expect } from 'vitest'
import {
  formatRupiah,
  formatDate,
  calculateDuration,
  generateReferenceCode,
  slugify,
  buildWhatsAppUrl,
  formatWhatsApp,
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatRupiah', () => {
    it('should format numbers to Indonesian Rupiah currency format', () => {
      const formatted = formatRupiah(150000)
      // Normalizes non-breaking space if any
      expect(formatted.replace(/\s/g, ' ')).toMatch(/Rp\s?150\.000/)
    })

    it('should handle string numbers', () => {
      const formatted = formatRupiah('50000')
      expect(formatted.replace(/\s/g, ' ')).toMatch(/Rp\s?50\.000/)
    })

    it('should return Rp0 for null or undefined', () => {
      expect(formatRupiah(null)).toBe('Rp0')
      expect(formatRupiah(undefined)).toBe('Rp0')
    })
  })

  describe('calculateDuration', () => {
    it('should calculate duration in days correctly', () => {
      const start = new Date('2026-10-15T08:00:00Z')
      const end = new Date('2026-10-17T08:00:00Z')
      expect(calculateDuration(start, end)).toBe(2)
    })

    it('should return minimum 1 day for same-day booking', () => {
      const start = new Date('2026-10-15T08:00:00Z')
      const end = new Date('2026-10-15T18:00:00Z')
      expect(calculateDuration(start, end)).toBe(1)
    })
  })

  describe('generateReferenceCode', () => {
    it('should generate code starting with GR- and have adequate length', () => {
      const code = generateReferenceCode()
      expect(code.startsWith('GR-')).toBe(true)
      expect(code.length).toBeGreaterThanOrEqual(10)
    })

    it('should generate unique reference codes', () => {
      const code1 = generateReferenceCode()
      const code2 = generateReferenceCode()
      expect(code1).not.toBe(code2)
    })
  })

  describe('slugify', () => {
    it('should generate clean URL slugs', () => {
      expect(slugify('Speaker Aktif 12" Bluetooth')).toBe('speaker-aktif-12-bluetooth')
      expect(slugify('Papan Tulis Kecil (Whiteboard)')).toBe('papan-tulis-kecil-whiteboard')
    })
  })

  describe('WhatsApp Helpers', () => {
    it('should clean non-digits in phone number', () => {
      expect(formatWhatsApp('+62 882-2300-4545')).toBe('6288223004545')
    })

    it('should construct valid wa.me link with encoded message', () => {
      const url = buildWhatsAppUrl('628823004545', 'Halo Gamas Rent')
      expect(url).toBe('https://wa.me/628823004545?text=Halo%20Gamas%20Rent')
    })
  })
})
