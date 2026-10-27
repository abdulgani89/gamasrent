import { NextRequest, NextResponse } from 'next/server'
import { bookingService } from '@/services/booking.service'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const startAt = searchParams.get('startAt')
    const endAt = searchParams.get('endAt')

    const unit = await prisma.rentalUnit.findUnique({
      where: { slug, isActive: true },
      select: { id: true, name: true, operationalStatus: true },
    })

    if (!unit) {
      return NextResponse.json({ error: 'Unit tidak ditemukan' }, { status: 404 })
    }

    if (!startAt || !endAt) {
      return NextResponse.json({
        unitId: unit.id,
        available: unit.operationalStatus === 'AVAILABLE',
        operationalStatus: unit.operationalStatus,
      })
    }

    const start = new Date(startAt)
    const end = new Date(endAt)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Format tanggal tidak valid' }, { status: 400 })
    }

    if (end <= start) {
      return NextResponse.json({ error: 'Tanggal selesai harus setelah tanggal mulai' }, { status: 400 })
    }

    // Track analytics
    await prisma.analyticsEvent.create({
      data: { eventType: 'availability_check', unitId: unit.id, metadata: JSON.stringify({ startAt, endAt }) },
    }).catch(() => {})

    const result = await bookingService.checkAvailability(unit.id, start, end)
    return NextResponse.json({ unitId: unit.id, ...result })
  } catch (error) {
    console.error('GET /api/units/[slug]/availability error:', error)
    return NextResponse.json({ error: 'Gagal memeriksa ketersediaan' }, { status: 500 })
  }
}
