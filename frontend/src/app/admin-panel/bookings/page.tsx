import { prisma } from '@/lib/prisma'
import BookingManager from '@/components/admin/BookingManager'


interface AdminBookingsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const { status, search } = await searchParams

  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      unit: true,
      paymentRecords: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Format dates and numbers to serialize safely to client
  const serialized = bookings.map((b) => ({
    ...b,
    startAt: b.startAt.toISOString(),
    endAt: b.endAt.toISOString(),
    createdAt: b.createdAt.toISOString(),
    holdExpiresAt: b.holdExpiresAt?.toISOString() || null,
    dailyRateSnapshot: Number(b.dailyRateSnapshot),
    extraCost: Number(b.extraCost),
    totalPrice: Number(b.totalPrice),
    unit: {
      ...b.unit,
      dailyRate: Number(b.unit.dailyRate),
    },
  }))

  return (
    <BookingManager
      initialBookings={serialized as any}
      defaultStatus={status || ''}
      defaultSearch={search || ''}
    />
  )
}
