import { prisma } from '@/lib/prisma'
import UnitManager from '@/components/admin/UnitManager'


export default async function AdminUnitsPage() {
  const [units, categories] = await Promise.all([
    prisma.rentalUnit.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <UnitManager
      initialUnits={units as any}
      categories={categories}
    />
  )
}
