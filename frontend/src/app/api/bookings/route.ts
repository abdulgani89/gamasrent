import { NextRequest, NextResponse } from 'next/server'
import { bookingService } from '@/services/booking.service'
import { createBookingSchema } from '@/lib/validations'
import { safeErrorMessage } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Data reservasi tidak valid', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const booking = (await bookingService.createBooking(parsed.data)) as any

    return NextResponse.json(
      {
        referenceCode: booking.referenceCode,
        bookingId: booking.id,
        status: booking.status,
        unitName: booking.unit.name,
        customerName: booking.customer.name,
        startAt: booking.startAt,
        endAt: booking.endAt,
        duration: booking.duration,
        dailyRate: Number(booking.dailyRateSnapshot),
        extraCost: Number(booking.extraCost),
        totalPrice: Number(booking.totalPrice),
        pickupOption: booking.pickupOption,
        deliveryLocation: booking.deliveryLocation,
        holdExpiresAt: booking.holdExpiresAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    const message = safeErrorMessage(error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
