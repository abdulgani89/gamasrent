import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Gamas Rent — Rental Kendaraan & Perlengkapan Terpercaya',
    template: '%s | Gamas Rent',
  },
  description: 'Sewa kendaraan dan perlengkapan dengan mudah, cepat, dan terpercaya di Gamas Rent. Pilihan unit lengkap, harga transparan, dan proses pemesanan yang mudah.',
  keywords: ['rental kendaraan', 'sewa motor', 'sewa mobil', 'rental perlengkapan', 'Gamas Rent'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Gamas Rent',
    title: 'Gamas Rent — Rental Kendaraan & Perlengkapan Terpercaya',
    description: 'Sewa kendaraan dan perlengkapan dengan mudah, cepat, dan terpercaya.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
