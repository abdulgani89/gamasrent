import Link from 'next/link'
import { CheckCircle2, Search, Calendar, MessageCircle, Shield, ArrowRight, Clock, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Panduan Cara Sewa',
  description: 'Tata cara dan panduan lengkap menyewa perlengkapan acara dan kendaraan di Gamas Rent.',
}

export default function CaraSewaPage() {
  const steps = [
    {
      step: '01',
      title: 'Pilih Unit di Katalog',
      desc: 'Jelajahi pilihan perlengkapan acara kami (Sound system, mic wireless, palu sidang, whiteboard, cooler box, galon aqua). Periksa rincian spesifikasi dan tarif harian yang tertera transparan.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Isi Formulir Reservasi',
      desc: 'Tentukan tanggal mulai dan selesai sewa. Sistem otomatis menghitung total biaya sewa dan mengecek ketersediaan unit agar jadwal tidak bertabrakan dengan penyewa lain.',
      icon: Calendar,
    },
    {
      step: '03',
      title: 'Kirim Pesanan ke WhatsApp Admin',
      desc: 'Klik tombol WhatsApp untuk langsung terhubung dengan admin Gamas Rent. Rincian pesanan dan kode booking otomatis terlampir untuk verifikasi cepat tanpa perlu ketik ulang.',
      icon: MessageCircle,
    },
    {
      step: '04',
      title: 'Serah Terima & Pengambilan Unit',
      desc: 'Ambil unit langsung di lokasi/toko kami. Bawa kartu identitas asli (KTP/KTM/SIM) sebagai jaminan selama periode sewa berlangsung.',
      icon: CheckCircle2,
    },
  ]

  const faqs = [
    {
      q: 'Dokumen apa saja yang diperlukan sebagai jaminan?',
      a: 'Penyewa wajib menitipkan salah satu kartu identitas asli yang masih berlaku, seperti KTP, KTM (Kartu Tanda Mahasiswa), atau SIM.',
    },
    {
      q: 'Bagaimana jika unit yang saya inginkan sudah dipesan orang lain?',
      a: 'Sistem Gamas Rent memiliki perlindungan otomatis anti-bentrok. Jika tanggal yang Anda inginkan sudah terisi, Anda bisa memilih tanggal lain atau berkonsultasi dengan admin via WhatsApp untuk alternatif unit serupa.',
    },
    {
      q: 'Apakah bisa diantar ke lokasi acara/kampus?',
      a: 'Saat ini kami tidak menyediakan layanan antar ke lokasi. Pengambilan dan pengembalian unit dilakukan langsung di lokasi/toko kami.',
    },
    {
      q: 'Kapan uang jaminan (deposit) dikembalikan?',
      a: 'Deposit akan dikembalikan 100% penuh segera setelah unit dikembalikan tepat waktu dan dalam kondisi baik.',
    },
  ]

  return (
    <div className="pt-[72px] min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 sm:py-20">
        <div className="container-main text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
            Mudah & Transparan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Cara Sewa di <span className="text-orange-400">Gamas Rent</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            4 langkah simpel untuk menyewa perlengkapan acara dan sound system tanpa ribet.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon
              return (
                <div
                  key={s.step}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col"
                >
                  <span className="text-4xl font-extrabold text-slate-100 absolute top-4 right-4 select-none">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5 relative z-10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 relative z-10">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed relative z-10 flex-1">
                    {s.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA Box */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Siap Menemukan Alat yang Anda Butuhkan?</h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">
                Katalog kami selalu diperbarui dengan ketersediaan unit yang akurat.
              </p>
            </div>
            <Link
              href="/katalog"
              className="px-6 py-3 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              Lihat Katalog Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 pb-20 bg-white border-t border-slate-200/80">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jawaban seputar syarat, pembayaran, dan operasional sewa
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
