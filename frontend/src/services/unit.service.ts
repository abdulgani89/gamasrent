import { prisma } from '@/lib/prisma'
import { type CreateUnitInput, type UpdateUnitInput } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { OperationalStatus } from '@/lib/types'
import { Prisma } from '@prisma/client'

export const unitService = {
  async createUnit(input: CreateUnitInput, images?: { imageUrl: string; altText?: string; sortOrder?: number }[]) {
    const slug = input.slug || slugify(input.name)

    const unit = await prisma.rentalUnit.create({
      data: {
        categoryId: input.categoryId,
        name: input.name,
        slug,
        description: input.description,
        specifications: input.specifications ? JSON.stringify(input.specifications) : null,
        facilities: JSON.stringify(input.facilities || []),
        rentalTerms: input.rentalTerms,
        dailyRate: Number(input.dailyRate),
        depositAmount: Number(input.depositAmount ?? 0),
        operationalStatus: input.operationalStatus || OperationalStatus.AVAILABLE,
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        images: images
          ? {
              create: images.map((img, idx) => ({
                imageUrl: img.imageUrl,
                altText: img.altText,
                sortOrder: img.sortOrder ?? idx,
              })),
            }
          : undefined,
      },
      include: { category: true, images: true },
    })

    return unit
  },

  async updateUnit(id: string, input: UpdateUnitInput) {
    const data: Prisma.RentalUnitUpdateInput = {}

    if (input.name !== undefined) data.name = input.name
    if (input.slug !== undefined) data.slug = input.slug
    if (input.description !== undefined) data.description = input.description
    if (input.categoryId !== undefined) data.category = { connect: { id: input.categoryId } }
    if (input.specifications !== undefined) data.specifications = JSON.stringify(input.specifications)
    if (input.facilities !== undefined) data.facilities = JSON.stringify(input.facilities)
    if (input.rentalTerms !== undefined) data.rentalTerms = input.rentalTerms
    if (input.dailyRate !== undefined) data.dailyRate = Number(input.dailyRate)
    if (input.depositAmount !== undefined) data.depositAmount = Number(input.depositAmount)
    if (input.operationalStatus !== undefined) data.operationalStatus = input.operationalStatus
    if (input.isActive !== undefined) data.isActive = input.isActive
    if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured

    return prisma.rentalUnit.update({
      where: { id },
      data,
      include: { category: true, images: true },
    })
  },

  async addImage(unitId: string, imageUrl: string, altText?: string) {
    const lastImage = await prisma.unitImage.findFirst({
      where: { unitId },
      orderBy: { sortOrder: 'desc' },
    })
    const sortOrder = (lastImage?.sortOrder ?? -1) + 1

    return prisma.unitImage.create({
      data: { unitId, imageUrl, altText, sortOrder },
    })
  },

  async deleteImage(imageId: string) {
    return prisma.unitImage.delete({ where: { id: imageId } })
  },

  async reorderImages(unitId: string, imageIds: string[]) {
    await prisma.$transaction(
      imageIds.map((id, idx) =>
        prisma.unitImage.update({ where: { id }, data: { sortOrder: idx } })
      )
    )
  },

  /**
   * Archive unit instead of deleting (preserves transaction history)
   */
  async archiveUnit(id: string) {
    return prisma.rentalUnit.update({
      where: { id },
      data: { isActive: false, operationalStatus: OperationalStatus.RETIRED },
    })
  },
}
