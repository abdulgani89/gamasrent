import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, errorResponse, safeErrorMessage } from '@/lib/api-helpers'
import { dashboardService } from '@/services/dashboard.service'

export async function GET(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const [stats, recentBookings, analytics] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentBookings(8),
      dashboardService.getAnalyticsSummary(),
    ])

    return NextResponse.json({ stats, recentBookings, analytics })
  } catch (err) {
    console.error('GET /api/admin/dashboard error:', err)
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}
