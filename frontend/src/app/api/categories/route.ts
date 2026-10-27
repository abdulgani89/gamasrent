import { NextRequest, NextResponse } from 'next/server'
import { categoryRepository } from '@/repositories/category.repository'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await categoryRepository.findAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('GET /api/categories error:', error)
    return NextResponse.json({ error: 'Gagal memuat kategori' }, { status: 500 })
  }
}
