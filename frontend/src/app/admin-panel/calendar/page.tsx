import { prisma } from '@/lib/prisma'
import { dashboardService } from '@/services/dashboard.service'
import CalendarSchedule from '@/components/admin/CalendarSchedule'


export default async function AdminCalendarPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [units, bookings] = await Promise.all([
    prisma.rentalUnit.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    dashboardService.getCalendarBookings(year, month),
  ])

  const serializedBookings = bookings.map((b) => ({
    ...b,
    startAt: b.startAt.toISOString(),
    endAt: b.endAt.toISOString(),
    totalPrice: Number(b.totalPrice),
  }))

  return (
    <CalendarSchedule
      units={units}
      initialBookings={serializedBookings as any}
      initialYear={year}
      initialMonth={month}
    />
  )
}
