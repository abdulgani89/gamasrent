import { NextRequest, NextResponse } from 'next/server'
import { unitRepository } from '@/repositories/unit.repository'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const unit = await unitRepository.findBySlug(slug)

    if (!unit) {
      return NextResponse.json({ error: 'Unit tidak ditemukan' }, { status: 404 })
    }

    // Track analytics
    await prisma.analyticsEvent.create({
      data: { eventType: 'unit_view', unitId: unit.id },
    }).catch(() => {})

    return NextResponse.json(unit)
  } catch (error) {
    console.error('GET /api/units/[slug] error:', error)
    return NextResponse.json({ error: 'Gagal memuat detail unit' }, { status: 500 })
  }
}
