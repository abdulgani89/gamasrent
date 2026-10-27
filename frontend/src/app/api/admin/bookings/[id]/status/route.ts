import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { bookingService } from '@/services/booking.service'
import { updateBookingStatusSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await verifyAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateBookingStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: parsed.error.flatten() }, { status: 400 })
    }

    const adminId = (session?.user as Record<string, unknown>)?.id as string || 'admin'
    const booking = await bookingService.updateStatus(id, parsed.data, adminId)
    return NextResponse.json(booking)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 400 })
  }
}
