import { prisma } from '@/lib/prisma'
import { type CatalogFilterInput } from '@/lib/validations'
import { OperationalStatus, BookingStatus } from '@/lib/types'
import { Prisma } from '@prisma/client'

export const unitRepository = {
  async findForCatalog(filter: CatalogFilterInput) {
    const { search, category, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = filter

    const where: Prisma.RentalUnitWhereInput = {
      isActive: true,
      operationalStatus: OperationalStatus.AVAILABLE,
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (category) {
      where.category = { slug: category }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.dailyRate = {}
      if (minPrice !== undefined) where.dailyRate.gte = minPrice
      if (maxPrice !== undefined) where.dailyRate.lte = maxPrice
    }

    let orderBy: Prisma.RentalUnitOrderByWithRelationInput = { createdAt: 'desc' }
    if (sortBy === 'price_asc') orderBy = { dailyRate: 'asc' }
    else if (sortBy === 'price_desc') orderBy = { dailyRate: 'desc' }
    else if (sortBy === 'name_asc') orderBy = { name: 'asc' }
    else if (sortBy === 'name_desc') orderBy = { name: 'desc' }

    const skip = (page - 1) * limit

    const [units, total] = await Promise.all([
      prisma.rentalUnit.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.rentalUnit.count({ where }),
    ])

    return { units, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async findBySlug(slug: string) {
    return prisma.rentalUnit.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    })
  },

  async findById(id: string) {
    return prisma.rentalUnit.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    })
  },

  async findFeatured(limit = 6) {
    return prisma.rentalUnit.findMany({
      where: { isActive: true, isFeatured: true, operationalStatus: OperationalStatus.AVAILABLE },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      take: limit,
    })
  },

  async findAllAdmin() {
    return prisma.rentalUnit.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(data: Prisma.RentalUnitCreateInput) {
    return prisma.rentalUnit.create({ data, include: { category: true, images: true } })
  },

  async update(id: string, data: Prisma.RentalUnitUpdateInput) {
    return prisma.rentalUnit.update({ where: { id }, data })
  },

  async slugExists(slug: string, excludeId?: string) {
    const unit = await prisma.rentalUnit.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    })
    return !!unit
  },

  async getConflictingBookings(unitId: string, startAt: Date, endAt: Date, excludeBookingId?: string) {
    return prisma.booking.findMany({
      where: {
        unitId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE],
        },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    })
  },

  async getConflictingBookingsIncludingPending(unitId: string, startAt: Date, endAt: Date, excludeBookingId?: string) {
    const now = new Date()
    return prisma.booking.findMany({
      where: {
        unitId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
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
  },
}
