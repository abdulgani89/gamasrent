import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, safeErrorMessage } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { updateBusinessSettingSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    let settings = await prisma.businessSetting.findFirst()
    if (!settings) {
      settings = await prisma.businessSetting.create({ data: { businessName: 'Gamas Rent' } })
    }
    return NextResponse.json(settings)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const parsed = updateBusinessSettingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: parsed.error.flatten() }, { status: 400 })
    }

    let settings = await prisma.businessSetting.findFirst()
    if (!settings) {
      settings = await prisma.businessSetting.create({ data: { businessName: 'Gamas Rent', ...parsed.data } })
    } else {
      settings = await prisma.businessSetting.update({
        where: { id: settings.id },
        data: parsed.data,
      })
    }

    return NextResponse.json(settings)
  } catch (err) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}
