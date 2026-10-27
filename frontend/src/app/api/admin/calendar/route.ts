import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { dashboardService } from '@/services/dashboard.service'

export async function GET(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))
    const unitId = searchParams.get('unitId') || undefined

    const bookings = await dashboardService.getCalendarBookings(year, month, unitId)
    return NextResponse.json(bookings)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}
