import { NextRequest, NextResponse } from 'next/server'
import { unitRepository } from '@/repositories/unit.repository'
import { catalogFilterSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const parsed = catalogFilterSchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Parameter filter tidak valid', details: parsed.error.flatten() }, { status: 400 })
    }

    const result = await unitRepository.findForCatalog(parsed.data)

    // Track analytics
    await prisma.analyticsEvent.create({
      data: { eventType: 'catalog_view', metadata: JSON.stringify({ filters: params }) },
    }).catch(() => {}) // non-blocking

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/units error:', error)
    return NextResponse.json({ error: 'Gagal memuat daftar unit' }, { status: 500 })
  }
}
