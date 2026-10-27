import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { unitRepository } from '@/repositories/unit.repository'
import { unitService } from '@/services/unit.service'
import { createUnitSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const units = await unitRepository.findAllAdmin()
    return NextResponse.json(units)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const parsed = createUnitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data unit tidak valid', details: parsed.error.flatten() }, { status: 400 })
    }

    // Check slug uniqueness
    const slug = parsed.data.slug || slugify(parsed.data.name)
    const slugTaken = await unitRepository.slugExists(slug)
    if (slugTaken) {
      return NextResponse.json({ error: 'Slug sudah digunakan, gunakan nama yang berbeda' }, { status: 400 })
    }

    const unit = await unitService.createUnit({ ...parsed.data, slug }, body.images)
    return NextResponse.json(unit, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}
