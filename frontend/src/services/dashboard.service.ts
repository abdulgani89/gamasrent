import { prisma } from '@/lib/prisma'
import { BookingStatus, OperationalStatus } from '@/lib/types'

export const dashboardService = {
  async getStats() {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalActiveUnits,
      maintenanceUnits,
      pendingBookings,
      confirmedBookings,
      activeRentals,
      completedRentals,
      totalBookings,
      weeklyBookings,
      paymentSum,
      estimatedValue,
    ] = await Promise.all([
      prisma.rentalUnit.count({ where: { isActive: true, operationalStatus: OperationalStatus.AVAILABLE } }),
      prisma.rentalUnit.count({ where: { operationalStatus: OperationalStatus.MAINTENANCE } }),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { status: BookingStatus.ACTIVE } }),
      prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.paymentRecord.aggregate({
        where: { paymentStatus: 'VERIFIED' },
        _sum: { amount: true },
      }),
      prisma.booking.aggregate({
        where: { status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE, BookingStatus.COMPLETED] } },
        _sum: { totalPrice: true },
      }),
    ])

    return {
      totalActiveUnits,
      maintenanceUnits,
      pendingBookings,
      confirmedBookings,
      activeRentals,
      completedRentals,
      totalBookings,
      weeklyBookings,
      actualRevenue: Number(paymentSum._sum.amount ?? 0),
      estimatedValue: Number(estimatedValue._sum.totalPrice ?? 0),
    }
  },

  async getRecentBookings(limit = 10) {
    return prisma.booking.findMany({
      include: {
        customer: true,
        unit: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async getCalendarBookings(year: number, month: number, unitId?: string) {
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    return prisma.booking.findMany({
      where: {
        unitId: unitId || undefined,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
        OR: [
          { startAt: { gte: startOfMonth, lte: endOfMonth } },
          { endAt: { gte: startOfMonth, lte: endOfMonth } },
          { startAt: { lte: startOfMonth }, endAt: { gte: endOfMonth } },
        ],
      },
      include: {
        unit: { select: { name: true, slug: true } },
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { startAt: 'asc' },
    })
  },

  async getAnalyticsSummary() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [catalogViews, whatsappClicks, bookingsCreated, bookingsConfirmed] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: 'catalog_view', createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'whatsapp_click', createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'booking_created', createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'booking_confirmed', createdAt: { gte: thirtyDaysAgo } } }),
    ])

    const conversionRate = catalogViews > 0 ? ((whatsappClicks / catalogViews) * 100).toFixed(1) : '0'

    return {
      catalogViews,
      whatsappClicks,
      bookingsCreated,
      bookingsConfirmed,
      conversionRate,
      period: '30 hari terakhir',
    }
  },
}
