import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Cek apakah user sedang mencoba akses halaman admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Cek apakah dia punya cookie 'userId' (Tiket Masuk)
    const userId = request.cookies.get('userId')?.value

    // 3. Kalau TIDAK punya tiket, tendang ke halaman login
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 4. Kalau punya tiket, silakan lanjut
  return NextResponse.next()
}

// Tentukan halaman mana saja yang dijaga satpam
export const config = {
  matcher: ['/admin/:path*'], // Semua yang berawalan /admin kena cegat
}