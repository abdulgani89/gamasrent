import { prisma } from '@/lib/prisma'
import { type Category } from '@prisma/client'

export type CategoryWithUnitCount = Category & {
  _count: { units: number }
}

export const categoryRepository = {
  async findAll(includeInactive = false) {
    return prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        _count: { select: { units: { where: { isActive: true } } } },
      },
      orderBy: { name: 'asc' },
    })
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { units: true } } },
    })
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    })
  },

  async create(data: { name: string; slug: string; description?: string; isActive?: boolean }) {
    return prisma.category.create({ data })
  },

  async update(id: string, data: Partial<{ name: string; slug: string; description: string; isActive: boolean }>) {
    return prisma.category.update({ where: { id }, data })
  },

  async slugExists(slug: string, excludeId?: string) {
    const cat = await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    })
    return !!cat
  },
}
