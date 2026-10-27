'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1f2e] text-gray-300">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/logo-gamas.jpg"
                  alt="Logo GAMAS UNNES Banyumas"
                  fill
                  className="object-contain rounded-full ring-2 ring-amber-500/40"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-white">
                  Gamas<span className="text-red-500">rent</span>
                </span>
                <span className="text-[10px] text-amber-500 font-medium tracking-wide">
                  Layanan Sewa Inventaris
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-2">
              Layanan sewa inventaris resmi dari unit kegiatan mahasiswa
              <span className="text-amber-400 font-medium"> GAMAS </span>
              (Gabungan Mahasiswa Satria) Universitas Negeri Semarang — Banyumas.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/6288223004545"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp"
                className="w-9 h-9 rounded-lg bg-green-600 hover:bg-green-500 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://instagram.com/gamasatriabms"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-instagram"
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 flex items-center justify-center transition-all"
                aria-label="Instagram @gamasatriabms"
              >
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-pink-400">@gamasatriabms</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/katalog', label: 'Katalog Unit' },
                { href: '/cara-sewa', label: 'Cara Sewa' },
                { href: '/tentang-kami', label: 'Tentang Kami' },
                { href: '/kontak', label: 'Kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informasi</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
                { href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
                { href: '/cara-sewa', label: 'Proses Pemesanan' },
                { href: '/cara-sewa#pembatalan', label: 'Kebijakan Pembatalan' },
                { href: '/kontak#faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <a
                  href="https://wa.me/6288223004545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  +62 882-2300-4545
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/cprLBLfb1scPafYW7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Gang Pete Selatan 1, Sekaran,<br />
                  Kontrakan Pak Sulistiyono No 16
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Senin–Sabtu: 08.00–20.00 WIB<br />
                  Minggu: 09.00–17.00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} <span className="text-amber-500 font-medium">Gamasrent</span> — GAMAS UNNES Banyumas. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kebijakan-privasi" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="text-gray-700">·</span>
            <Link href="/syarat-ketentuan" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
