'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/cara-sewa', label: 'Cara Sewa' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isTransparent = pathname === '/' && !scrolled && !isOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/80'
      )}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo-gamas.jpg"
                alt="Logo GAMAS UNNES Banyumas"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className={cn(
                'text-xl font-extrabold tracking-tight transition-colors duration-200',
                isTransparent ? 'text-white' : 'text-gray-900'
              )}>
                Gamas<span className="text-red-600">rent</span>
              </span>
              <span className={cn(
                'text-[10px] font-medium tracking-wide transition-colors duration-200',
                isTransparent ? 'text-white/70' : 'text-amber-600'
              )}>
                Layanan Sewa Inventaris
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? isTransparent
                      ? 'text-amber-300 bg-white/10'
                      : 'text-red-600 bg-red-50'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/katalog"
              id="navbar-cta-unit"
              className="btn-primary text-sm py-2.5 px-5"
            >
              Cari Unit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="navbar-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 px-4">
                <Link href="/katalog" className="btn-primary w-full text-sm py-2.5">
                  Cari Unit
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
