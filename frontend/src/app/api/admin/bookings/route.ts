import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { bookingService } from '@/services/booking.service'
import { BookingStatus } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') as BookingStatus | undefined,
      search: searchParams.get('search') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const result = await bookingService.getBookings(filters)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error, session } = await verifyAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const { unitId, eventName, picName, picPhone, startAt, endAt, notes } = body

    if (!unitId || !eventName || !picName || !startAt || !endAt) {
      return NextResponse.json(
        { error: 'Unit, nama acara, nama PIC, tanggal mulai, dan tanggal selesai wajib diisi' },
        { status: 400 }
      )
    }

    const booking = await bookingService.createInternalBooking({
      unitId,
      eventName,
      picName,
      picPhone,
      startAt,
      endAt,
      notes,
      adminId: session?.user?.id,
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 400 })
  }
}

