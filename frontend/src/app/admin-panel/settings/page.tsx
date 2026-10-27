import { prisma } from '@/lib/prisma'
import SettingsManager from '@/components/admin/SettingsManager'


export default async function AdminSettingsPage() {
  let settings = await prisma.businessSetting.findFirst()

  if (!settings) {
    settings = await prisma.businessSetting.create({
      data: {
        businessName: 'Gamas Rent',
        whatsappNumber: '6288223004545',
        holdDurationMinutes: 30,
      },
    })
  }

  return <SettingsManager initialSettings={settings as any} />
}
