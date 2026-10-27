import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { unitRepository } from '@/repositories/unit.repository'
import { unitService } from '@/services/unit.service'
import { updateUnitSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const { id } = await params
    const unit = await unitRepository.findById(id)
    if (!unit) return NextResponse.json({ error: 'Unit tidak ditemukan' }, { status: 404 })
    return NextResponse.json(unit)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateUnitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: parsed.error.flatten() }, { status: 400 })
    }

    // Check slug uniqueness if being changed
    if (parsed.data.slug) {
      const slugTaken = await unitRepository.slugExists(parsed.data.slug, id)
      if (slugTaken) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 })
      }
    }

    const unit = await unitService.updateUnit(id, parsed.data)
    return NextResponse.json(unit)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const { id } = await params
    await unitService.archiveUnit(id)
    return NextResponse.json({ message: 'Unit berhasil diarsipkan' })
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}
