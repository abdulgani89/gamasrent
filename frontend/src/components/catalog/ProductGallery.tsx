'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageItem {
  id: string
  imageUrl: string
  altText?: string | null
}

interface ProductGalleryProps {
  images: ImageItem[]
  unitName: string
}

export default function ProductGallery({ images, unitName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const activeImage = images[selectedIndex] || images[0]

  // Handle ESC key to close lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
        setIsZoomed(false)
      } else if (e.key === 'ArrowRight' && isLightboxOpen && images.length > 1) {
        setSelectedIndex((prev) => (prev + 1) % images.length)
      } else if (e.key === 'ArrowLeft' && isLightboxOpen && images.length > 1) {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }

    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, images.length])

  if (!images || images.length === 0) {
    return (
      <div className="card overflow-hidden h-80 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-gray-300 text-6xl">📦</span>
      </div>
    )
  }

  return (
    <>
      <div className="card overflow-hidden border border-gray-200/80 bg-white shadow-sm">
        {/* Main Image Frame */}
        <div
          onClick={() => {
            setIsLightboxOpen(true)
            setIsZoomed(false)
          }}
          className="relative h-80 sm:h-96 md:h-[420px] bg-gray-100 cursor-zoom-in group overflow-hidden select-none"
          title="Klik untuk melihat foto penuh tanpa terpotong"
        >
          <Image
            src={activeImage.imageUrl}
            alt={activeImage.altText || unitName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {/* Hint badge */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-sm text-white text-xs font-medium opacity-90 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
            <span>Klik untuk lihat foto penuh</span>
          </div>
        </div>

        {/* Thumbnail row if multiple images */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 bg-gray-50 border-t border-gray-100">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-18 sm:h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                  selectedIndex === idx
                    ? 'border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                    : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText || `${unitName} - ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal (Full-View, 100% Uncropped) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between p-4 sm:p-6 text-white z-20 bg-gradient-to-b from-black/60 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md">
                {unitName}
              </h3>
              {images.length > 1 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Foto {selectedIndex + 1} dari {images.length}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                title={isZoomed ? 'Perkecil' : 'Perbesar'}
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">{isZoomed ? 'Zoom Out' : 'Zoom In'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center: Full Uncropped Image */}
          <div
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className={`relative transition-all duration-300 flex items-center justify-center ${
                isZoomed
                  ? 'w-[140vw] h-[140vh] sm:w-[120vw] sm:h-[120vh] max-w-none max-h-none'
                  : 'w-full h-full max-w-5xl max-h-[82vh]'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed(!isZoomed)
              }}
            >
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.altText || unitName}
                fill
                className="object-contain drop-shadow-2xl select-none"
                priority
                sizes="100vw"
              />
            </div>
          </div>

          {/* Navigation Controls (If multiple images) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm z-30"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev + 1) % images.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm z-30"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Bottom Bar: Instructions */}
          <div
            className="p-3 text-center text-xs text-gray-400 z-20 bg-gradient-to-t from-black/60 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Klik gambar untuk zoom • Tekan ESC atau klik di luar untuk menutup</span>
          </div>
        </div>
      )}
    </>
  )
}
