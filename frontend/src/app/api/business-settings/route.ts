import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.businessSetting.findFirst()
    if (!settings) {
      // Create default settings if not exist
      settings = await prisma.businessSetting.create({
        data: { businessName: 'Gamas Rent' },
      })
    }
    // Return safe public fields only
    return NextResponse.json({
      businessName: settings.businessName,
      logoUrl: settings.logoUrl,
      whatsappNumber: settings.whatsappNumber,
      address: settings.address,
      businessHours: settings.businessHours,
      socialMedia: settings.socialMedia,
      timezone: settings.timezone,
    })
  } catch (error) {
    console.error('GET /api/business-settings error:', error)
    return NextResponse.json({ error: 'Gagal memuat pengaturan bisnis' }, { status: 500 })
  }
}
