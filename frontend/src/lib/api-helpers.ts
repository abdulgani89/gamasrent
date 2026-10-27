import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Verify admin authentication for API routes
 */
export async function verifyAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 }), session: null }
  }
  return { error: null, session }
}

/**
 * Create a standardized error response
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Safe error message (no stack traces in production)
 */
export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}
