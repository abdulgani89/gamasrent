import { describe, it, expect, vi } from 'vitest'
import { BookingStatus } from '@/lib/types'

describe('Booking Business Logic', () => {
  describe('Status Transitions Rules', () => {
    const VALID_TRANSITIONS: Record<string, string[]> = {
      PENDING: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
      CONFIRMED: [BookingStatus.ACTIVE, BookingStatus.CANCELLED],
      ACTIVE: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
      COMPLETED: [],
      CANCELLED: [],
      REJECTED: [],
    }

    it('should allow PENDING to advance to CONFIRMED, REJECTED, or CANCELLED', () => {
      const allowed = VALID_TRANSITIONS['PENDING']
      expect(allowed).toContain(BookingStatus.CONFIRMED)
      expect(allowed).toContain(BookingStatus.REJECTED)
      expect(allowed).toContain(BookingStatus.CANCELLED)
      expect(allowed).not.toContain(BookingStatus.COMPLETED)
    })

    it('should allow CONFIRMED to advance to ACTIVE or CANCELLED', () => {
      const allowed = VALID_TRANSITIONS['CONFIRMED']
      expect(allowed).toContain(BookingStatus.ACTIVE)
      expect(allowed).toContain(BookingStatus.CANCELLED)
      expect(allowed).not.toContain(BookingStatus.COMPLETED)
    })

    it('should allow ACTIVE to advance to COMPLETED', () => {
      const allowed = VALID_TRANSITIONS['ACTIVE']
      expect(allowed).toContain(BookingStatus.COMPLETED)
    })

    it('should not allow transitions from COMPLETED or CANCELLED', () => {
      expect(VALID_TRANSITIONS['COMPLETED']).toEqual([])
      expect(VALID_TRANSITIONS['CANCELLED']).toEqual([])
      expect(VALID_TRANSITIONS['REJECTED']).toEqual([])
    })
  })

  describe('Date Overlap Conflict Detection Logic', () => {
    // Overlap condition: (existingStart < newEnd) && (existingEnd > newStart)
    const hasOverlap = (
      existingStart: Date,
      existingEnd: Date,
      newStart: Date,
      newEnd: Date
    ) => {
      return existingStart < newEnd && existingEnd > newStart
    }

    it('should detect direct overlapping date ranges', () => {
      const existing = {
        start: new Date('2026-10-15T08:00:00Z'),
        end: new Date('2026-10-18T08:00:00Z'),
      }
      const conflictingBooking = {
        start: new Date('2026-10-16T08:00:00Z'),
        end: new Date('2026-10-17T08:00:00Z'),
      }

      expect(hasOverlap(existing.start, existing.end, conflictingBooking.start, conflictingBooking.end)).toBe(true)
    })

    it('should detect partial overlap at the end', () => {
      const existing = {
        start: new Date('2026-10-15T08:00:00Z'),
        end: new Date('2026-10-18T08:00:00Z'),
      }
      const newBooking = {
        start: new Date('2026-10-17T08:00:00Z'),
        end: new Date('2026-10-20T08:00:00Z'),
      }

      expect(hasOverlap(existing.start, existing.end, newBooking.start, newBooking.end)).toBe(true)
    })

    it('should allow adjacent non-overlapping bookings (end equals start)', () => {
      const existing = {
        start: new Date('2026-10-15T08:00:00Z'),
        end: new Date('2026-10-18T08:00:00Z'),
      }
      const nextBooking = {
        start: new Date('2026-10-18T08:00:00Z'),
        end: new Date('2026-10-20T08:00:00Z'),
      }

      expect(hasOverlap(existing.start, existing.end, nextBooking.start, nextBooking.end)).toBe(false)
    })

    it('should allow completely separate date ranges', () => {
      const existing = {
        start: new Date('2026-10-15T08:00:00Z'),
        end: new Date('2026-10-18T08:00:00Z'),
      }
      const futureBooking = {
        start: new Date('2026-10-25T08:00:00Z'),
        end: new Date('2026-10-28T08:00:00Z'),
      }

      expect(hasOverlap(existing.start, existing.end, futureBooking.start, futureBooking.end)).toBe(false)
    })
  })

  describe('Internal GAMAS Schedule Blocking Rules', () => {
    it('should identify internal GAMAS bookings by code, customer name, or zero price', () => {
      const isInternal = (refCode: string, customerName: string, totalPrice: number) =>
        refCode.startsWith('GR-INT-') || customerName.startsWith('[Internal GAMAS]') || totalPrice === 0

      expect(isInternal('GR-INT-XYZ', '[Internal GAMAS] Fajar', 0)).toBe(true)
      expect(isInternal('GR-12345678', 'Ahmad Pelanggan', 50000)).toBe(false)
    })

    it('should strictly conflict with customer booking when dates overlap', () => {
      const internalEvent = {
        start: new Date('2026-11-01T08:00:00Z'),
        end: new Date('2026-11-03T18:00:00Z'),
      }
      const customerRequest = {
        start: new Date('2026-11-02T10:00:00Z'),
        end: new Date('2026-11-04T10:00:00Z'),
      }

      // Overlap formula: (startA < endB) && (endA > startB)
      const isConflict =
        internalEvent.start < customerRequest.end && internalEvent.end > customerRequest.start

      expect(isConflict).toBe(true)
    })
  })
})
