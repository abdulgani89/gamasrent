import { prisma } from '@/lib/prisma'
import { generateReferenceCode, calculateDuration } from '@/lib/utils'
import { unitRepository } from '@/repositories/unit.repository'
import { type CreateBookingInput, type UpdateBookingStatusInput } from '@/lib/validations'
import { BookingStatus, PickupOption } from '@/lib/types'
import { Prisma } from '@prisma/client'

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.ACTIVE, BookingStatus.CANCELLED],
  ACTIVE: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
}

export const bookingService = {
  /**
   * Create a new booking with conflict check
   */
  async createBooking(input: CreateBookingInput) {
    const startAt = new Date(input.startAt)
    const endAt = new Date(input.endAt)

    // Use a transaction for atomic conflict check + create
    return await prisma.$transaction(async (tx) => {
      // 1. Check unit exists and is available
      const unit = await tx.rentalUnit.findUnique({
        where: { id: input.unitId, isActive: true },
      })
      if (!unit) throw new Error('Unit tidak ditemukan atau tidak aktif')
      if (unit.operationalStatus !== 'AVAILABLE') {
        throw new Error(`Unit sedang ${unit.operationalStatus === 'MAINTENANCE' ? 'dalam maintenance' : 'tidak tersedia'}`)
      }

      // 2. Check for conflicts (CONFIRMED, ACTIVE, or active PENDING)
      const now = new Date()
      const conflicts = await tx.booking.findMany({
        where: {
          unitId: input.unitId,
          OR: [
            {
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
              startAt: { lt: endAt },
              endAt: { gt: startAt },
            },
            {
              status: BookingStatus.PENDING,
              holdExpiresAt: { gt: now },
              startAt: { lt: endAt },
              endAt: { gt: startAt },
            },
          ],
        },
      })
      if (conflicts.length > 0) {
        throw new Error('Unit tidak tersedia pada tanggal yang dipilih. Silakan pilih tanggal lain.')
      }

      // 3. Find or create customer
      let customer = await tx.customer.findFirst({
        where: { phone: input.customerPhone },
      })
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail || undefined,
          },
        })
      } else {
        // Update name if changed
        await tx.customer.update({
          where: { id: customer.id },
          data: { name: input.customerName },
        })
      }

      // 4. Get hold duration from settings
      const settings = await tx.businessSetting.findFirst()
      const holdMinutes = settings?.holdDurationMinutes ?? 30
      const holdExpiresAt = new Date(Date.now() + holdMinutes * 60 * 1000)

      // 5. Calculate price
      const duration = calculateDuration(startAt, endAt)
      const dailyRate = Number(unit.dailyRate)
      const extraCost = input.extraCost ?? 0
      const totalPrice = duration * dailyRate + extraCost

      // 6. Create booking
      const referenceCode = generateReferenceCode()
      const booking = await tx.booking.create({
        data: {
          referenceCode,
          customerId: customer.id,
          unitId: input.unitId,
          startAt,
          endAt,
          pickupOption: input.pickupOption || PickupOption.SELF_PICKUP,
          deliveryLocation: input.deliveryLocation,
          dailyRateSnapshot: dailyRate,
          duration,
          extraCost,
          totalPrice,
          holdExpiresAt,
          customerNotes: input.customerNotes,
          status: BookingStatus.PENDING,
        },
        include: {
          unit: { include: { category: true } },
          customer: true,
        },
      })

      // 7. Record status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: undefined,
          toStatus: BookingStatus.PENDING,
          note: 'Booking dibuat oleh pelanggan',
        },
      })

      // 8. Track analytics
      await tx.analyticsEvent.create({
        data: {
          eventType: 'booking_created',
          unitId: input.unitId,
          metadata: JSON.stringify({ referenceCode, duration, totalPrice }),
        },
      })

      return booking
    })
  },

  /**
   * Create an internal GAMAS booking / schedule block
   */
  async createInternalBooking(input: {
    unitId: string
    eventName: string
    picName: string
    picPhone?: string
    startAt: string | Date
    endAt: string | Date
    notes?: string
    adminId?: string
  }) {
    const startAt = new Date(input.startAt)
    const endAt = new Date(input.endAt)

    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
      throw new Error('Format tanggal tidak valid')
    }

    if (endAt <= startAt) {
      throw new Error('Tanggal selesai harus setelah tanggal mulai')
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Verify unit exists
      const unit = await tx.rentalUnit.findUnique({
        where: { id: input.unitId, isActive: true },
      })
      if (!unit) throw new Error('Unit tidak ditemukan atau tidak aktif')

      // 2. Check for conflicts with other confirmed, active, or pending bookings
      const now = new Date()
      const conflicts = await tx.booking.findMany({
        where: {
          unitId: input.unitId,
          OR: [
            {
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
              startAt: { lt: endAt },
              endAt: { gt: startAt },
            },
            {
              status: BookingStatus.PENDING,
              holdExpiresAt: { gt: now },
              startAt: { lt: endAt },
              endAt: { gt: startAt },
            },
          ],
        },
        include: { customer: true },
      })

      if (conflicts.length > 0) {
        const c = conflicts[0]
        throw new Error(
          `Unit sudah memiliki jadwal pada tanggal tersebut (${c.customer.name} - Ref: ${c.referenceCode}). Silakan pilih jadwal lain.`
        )
      }

      // 3. Find or create internal customer
      const phone = input.picPhone?.replace(/\D/g, '') || '628000000000'
      const customerName = `[Internal GAMAS] ${input.picName}`
      let customer = await tx.customer.findFirst({
        where: { phone },
      })

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerName,
            phone,
          },
        })
      } else {
        await tx.customer.update({
          where: { id: customer.id },
          data: { name: customerName },
        })
      }

      const duration = calculateDuration(startAt, endAt)
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      const referenceCode = `GR-INT-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`

      // 4. Create internal booking with Rp 0 price
      const booking = await tx.booking.create({
        data: {
          referenceCode,
          customerId: customer.id,
          unitId: input.unitId,
          startAt,
          endAt,
          pickupOption: PickupOption.SELF_PICKUP,
          dailyRateSnapshot: 0,
          duration,
          extraCost: 0,
          totalPrice: 0,
          holdExpiresAt: null,
          customerNotes: `Acara: ${input.eventName}\nPIC: ${input.picName}`,
          adminNotes: input.notes
            ? `[KEGIATAN INTERNAL GAMAS]\nAcara: ${input.eventName}\nPIC: ${input.picName}\nCatatan: ${input.notes}`
            : `[KEGIATAN INTERNAL GAMAS]\nAcara: ${input.eventName}\nPIC: ${input.picName}`,
          status: BookingStatus.CONFIRMED,
        },
        include: {
          unit: true,
          customer: true,
        },
      })

      // 5. Record status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: undefined,
          toStatus: BookingStatus.CONFIRMED,
          note: `Jadwal unit diblokir untuk Acara Internal GAMAS: ${input.eventName} (PIC: ${input.picName})`,
          changedBy: input.adminId,
        },
      })

      return booking
    })
  },

  /**
   * Update booking status with validation
   */
  async updateStatus(bookingId: string, input: UpdateBookingStatusInput, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { unit: true },
      })
      if (!booking) throw new Error('Booking tidak ditemukan')

      // Validate transition
      const currentStatus = booking.status
      const newStatus = input.status
      const allowedTransitions = VALID_TRANSITIONS[currentStatus] || []

      if (!allowedTransitions.includes(newStatus)) {
        throw new Error(
          `Perubahan status tidak valid dari ${currentStatus} ke ${newStatus}. Status yang diperbolehkan: ${allowedTransitions.join(', ') || 'tidak ada'}`
        )
      }

      // Check conflict if confirming
      if (newStatus === BookingStatus.CONFIRMED) {
        const conflicts = await tx.booking.findMany({
          where: {
            unitId: booking.unitId,
            id: { not: bookingId },
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
            startAt: { lt: booking.endAt },
            endAt: { gt: booking.startAt },
          },
        })
        if (conflicts.length > 0) {
          throw new Error('Tidak dapat mengonfirmasi. Terdapat booking lain yang sudah terkonfirmasi pada tanggal yang bertabrakan.')
        }
      }

      // Update booking
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: newStatus,
          adminNotes: input.adminNotes ? `${booking.adminNotes ? booking.adminNotes + '\n' : ''}${input.adminNotes}` : undefined,
          // Clear hold expiration if confirmed
          holdExpiresAt: newStatus === BookingStatus.CONFIRMED ? null : booking.holdExpiresAt,
        },
        include: {
          customer: true,
          unit: true,
          paymentRecords: true,
        },
      })

      // Record history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: currentStatus,
          toStatus: newStatus,
          note: input.adminNotes,
          changedBy: adminId,
        },
      })

      // Track analytics
      if (newStatus === BookingStatus.CONFIRMED) {
        await tx.analyticsEvent.create({
          data: { eventType: 'booking_confirmed', unitId: booking.unitId, metadata: JSON.stringify({ bookingId }) },
        })
      } else if (newStatus === BookingStatus.COMPLETED) {
        await tx.analyticsEvent.create({
          data: { eventType: 'rental_completed', unitId: booking.unitId, metadata: JSON.stringify({ bookingId }) },
        })
      }

      return updated
    })
  },

  /**
   * Get bookings list for admin
   */
  async getBookings(filters: {
    status?: string
    search?: string
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }) {
    const { status, search, startDate, endDate, page = 1, limit = 20 } = filters
    const where: Prisma.BookingWhereInput = {}

    if (status) where.status = status as BookingStatus
    if (search) {
      where.OR = [
        { referenceCode: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ]
    }
    if (startDate) where.startAt = { gte: startDate }
    if (endDate) where.endAt = { lte: endDate }

    const skip = (page - 1) * limit
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: true,
          unit: { include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } } },
          paymentRecords: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    return { bookings, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  /**
   * Check availability for a unit and date range
   */
  async checkAvailability(unitId: string, startAt: Date, endAt: Date) {
    const unit = await prisma.rentalUnit.findUnique({
      where: { id: unitId, isActive: true },
    })
    if (!unit) return { available: false, reason: 'Unit tidak ditemukan' }
    if (unit.operationalStatus !== 'AVAILABLE') {
      return { available: false, reason: 'Unit sedang tidak tersedia' }
    }

    const now = new Date()
    const conflicts = await prisma.booking.findMany({
      where: {
        unitId,
        OR: [
          {
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
          {
            status: BookingStatus.PENDING,
            holdExpiresAt: { gt: now },
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
        ],
      },
      select: { startAt: true, endAt: true, status: true },
    })

    if (conflicts.length > 0) {
      return { available: false, reason: 'Unit tidak tersedia pada tanggal yang dipilih', conflicts }
    }

    return { available: true, reason: null }
  },
}
