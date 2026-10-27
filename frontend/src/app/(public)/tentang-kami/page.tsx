import Link from 'next/link'
import { Shield, Sparkles, HeartHandshake, CheckCircle2, ArrowRight, Users, Award, Target } from 'lucide-react'

export const metadata = {
  title: 'Tentang Kami',
  description: 'Mengenal Gamas Rent — Mitra penyewaan alat acara, sound system, dan kendaraan terpercaya.',
}

export default function TentangKamiPage() {
  const values = [
    {
      title: 'Transparansi Penuh',
      desc: 'Semua harga, deposit, dan spesifikasi unit dicantumkan jelas tanpa biaya tersembunyi.',
      icon: Shield,
    },
    {
      title: 'Kondisi Unit Terawat',
      desc: 'Setiap sound system, mic wireless, whiteboard, cooler box, dan kendaraan diuji fungsi sebelum diserahkan.',
      icon: CheckCircle2,
    },
    {
      title: 'Pemesanan Cepat via WhatsApp',
      desc: 'Integrasi langsung ke admin tanpa proses pendaftaran rumit untuk kecepatan operasional acara Anda.',
      icon: Sparkles,
    },
    {
      title: 'Fokus Solutif',
      desc: 'Membantu mahasiswa, organisasi, UMKM, dan perorangan menyukseskan acara tanpa harus membeli aset mahal.',
      icon: HeartHandshake,
    },
  ]

  return (
    <div className="pt-[72px] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 sm:py-20">
        <div className="container-main text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Mengenal Lebih Dekat <span className="text-orange-400">Gamas Rent</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Solusi praktis penyewaan sound system, peralatan sidang, papan tulis, galon, dan cooler box terpercaya.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container-main max-w-4xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Solusi Efisien untuk Setiap Acara dan Kebutuhan Praktis
            </h2>
            <p>
              <strong>Gamas Rent</strong> lahir dari kebutuhan nyata di lapangan: banyak panitia acara, organisasi kemahasiswaan, komunitas, dan perorangan yang membutuhkan perlengkapan penting—seperti speaker aktif portable, mic wireless UHF, palu sidang untuk musyawarah, papan tulis presentasi, hingga cooler box es—namun terkendala tingginya biaya pembelian alat baru untuk acara yang hanya berlangsung 1-3 hari.
            </p>
            <p>
              Kami hadir untuk mempermudah akses sewa dengan sistem katalog digital yang jelas, pengecekan jadwal bebas bentrok, serta integrasi pemesanan WhatsApp instan ke admin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-center">
                <Target className="w-6 h-6 text-orange-600 mx-auto mb-1.5" />
                <h4 className="font-bold text-slate-900 text-sm">Misi Kami</h4>
                <p className="text-xs text-slate-600 mt-1">Menyediakan sewa alat berkualitas tinggi dengan proses termudah.</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                <Award className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                <h4 className="font-bold text-slate-900 text-sm">Standar Mutu</h4>
                <p className="text-xs text-slate-600 mt-1">Pengecekan baterai, fisik, dan kebersihan sebelum serah terima.</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <Users className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <h4 className="font-bold text-slate-900 text-sm">Pelayanan Ramah</h4>
                <p className="text-xs text-slate-600 mt-1">Konsultasi cepat via WhatsApp untuk rekomendasi alat yang tepat.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 pb-20 bg-white border-t border-slate-200/80">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Nilai Layanan Kami</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Alasan pelanggan memilih menyewa di Gamas Rent
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all"
            >
              Lihat Pilihan Alat Rental <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
