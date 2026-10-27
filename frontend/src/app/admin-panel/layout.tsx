import { auth } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // If unauthenticated (e.g. on login page), render plain children without shell
  if (!session) {
    return <>{children}</>
  }

  return <AdminShell session={session}>{children}</AdminShell>
}
