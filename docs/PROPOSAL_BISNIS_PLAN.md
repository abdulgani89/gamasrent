# 📋 PROPOSAL & BISNIS PLAN
# GAMAS RENT — Sistem Layanan Sewa Inventaris Digital
### *Biro Pengembangan Usaha & Ekonomi Kreatif — GAMAS UNNES Banyumas*

---

## HALAMAN PENGESAHAN

| | |
|---|---|
| **Nama Program** | Gamas Rent — Sistem Layanan Sewa Inventaris Digital |
| **Nama Organisasi** | GAMAS (Gerakan Mahasiswa Swadaya) UNNES Banyumas |
| **Divisi Pengusul** | Biro Pengembangan Usaha & Ekonomi Kreatif |
| **Sasaran Pengguna** | Mahasiswa, BEM, UKM, Organisasi Kampus, Warga Sekitar Kampus |
| **Status Sistem** | ✅ Siap Operasional (MVP — *Minimum Viable Product*) |
| **Teknologi** | Next.js 16 · Prisma ORM · SQLite · NextAuth.js · Tailwind CSS |
| **Tanggal Dokumen** | Oktober 2026 |

---

## DAFTAR ISI

1. [Latar Belakang](#1-latar-belakang)
2. [Visi & Misi](#2-visi--misi)
3. [Deskripsi Program](#3-deskripsi-program)
4. [Analisis Masalah & Solusi](#4-analisis-masalah--solusi)
5. [Katalog Produk & Tarif](#5-katalog-produk--tarif)
6. [Analisis Pasar (STP)](#6-analisis-pasar-stp)
7. [Strategi Bisnis (Analisis SWOT)](#7-strategi-bisnis-analisis-swot)
8. [Model Bisnis (Business Model Canvas)](#8-model-bisnis-business-model-canvas)
9. [Proyeksi Keuangan](#9-proyeksi-keuangan)
10. [Rencana Operasional & SOP](#10-rencana-operasional--sop)
11. [Rencana Pemasaran & Promosi](#11-rencana-pemasaran--promosi)
12. [Roadmap Pengembangan](#12-roadmap-pengembangan)
13. [Struktur Organisasi Tim](#13-struktur-organisasi-tim)
14. [Penutup & Rekomendasi](#14-penutup--rekomendasi)

---

## 1. LATAR BELAKANG

Kehidupan organisasi kemahasiswaan di lingkungan UNNES Banyumas ditandai dengan tingginya frekuensi kegiatan — mulai dari seminar, musyawarah besar, makrab (*malam keakraban*), pelatihan kepemimpinan, hingga event kebudayaan. Setiap kegiatan tersebut membutuhkan perlengkapan pendukung seperti **perangkat audio, mikrofon, papan tulis, palu sidang, dan cooler box**.

### Permasalahan yang Ada:

Selama ini, pengadaan perlengkapan dilakukan secara **tidak terstruktur**:
- Pinjam ke teman yang tidak pasti ketersediaannya
- Sewa ke luar kampus dengan harga mahal
- Membeli baru yang mubazir karena hanya dipakai sekali
- Tidak ada sistem pemantauan — sering terjadi **bentrok jadwal & barang hilang**

GAMAS UNNES Banyumas sebagai organisasi kemahasiswaan memiliki inventaris perlengkapan yang selama ini *idle* (tidak produktif) di luar acara internal GAMAS sendiri. Potensi ini belum dioptimalkan untuk menghasilkan nilai ekonomi bagi kas organisasi.

### Peluang:

> Dengan membangun **sistem penyewaan inventaris digital berbasis web**, GAMAS dapat mengubah aset yang selama ini pasif menjadi **sumber pendapatan berkelanjutan**, sekaligus memberikan solusi kebutuhan perlengkapan acara yang **mudah, terjangkau, dan terpercaya** bagi seluruh warga kampus.

---

## 2. VISI & MISI

### Visi
> *Menjadi platform penyewaan inventaris digital terdepan di lingkungan kemahasiswaan UNNES Banyumas yang transparan, terpercaya, dan berkelanjutan.*

### Misi
1. Menyediakan layanan sewa perlengkapan acara yang **mudah diakses, terjangkau, dan berkualitas** bagi mahasiswa
2. Mengoptimalkan **nilai ekonomi aset inventaris** GAMAS untuk menopang kemandirian finansial organisasi
3. Membangun **sistem digital yang transparan** dengan pencatatan otomatis sehingga meminimalisir konflik dan penyalahgunaan
4. Mendorong **kemandirian finansial GAMAS** sehingga tidak bergantung pada iuran anggota semata
5. Menjadi **model bisnis sosial** kemahasiswaan yang dapat direplikasi oleh organisasi lain

---

## 3. DESKRIPSI PROGRAM

**Gamas Rent** adalah platform web *full-stack* yang dirancang khusus untuk mengelola layanan sewa inventaris GAMAS UNNES Banyumas secara **digital, otomatis, dan anti-bentrok jadwal**.

### Fitur Utama Sistem:

#### Portal Publik (Untuk Penyewa)
| Fitur | Keterangan |
|---|---|
| Katalog Digital | Browse & filter semua unit sewa berdasarkan kategori, harga, dan ketersediaan |
| Cek Ketersediaan Real-Time | Langsung tahu apakah unit tersedia di tanggal yang diinginkan |
| Formulir Reservasi Mandiri | Isi data diri, pilih tanggal, submit — tanpa perlu datang ke sekretariat |
| Anti Double-Booking | Sistem otomatis blokir tanggal yang sudah dipesan |
| Integrasi WhatsApp 1-Klik | Konfirmasi & kontak admin langsung via WhatsApp dengan pesan otomatis |
| Kalkulator Tarif Otomatis | Hitung total biaya sewa secara langsung di halaman detail unit |

#### Dashboard Admin (Untuk Pengurus GAMAS)
| Fitur | Keterangan |
|---|---|
| Dashboard Analitik | Ringkasan KPI: unit aktif, reservasi pending, estimasi omset |
| Manajemen Reservasi | Konfirmasi, tolak, lacak status reservasi dengan filter & tab |
| Kalender Jadwal Visual | Lihat unit mana yang sedang disewa / kosong per hari |
| Blokir Jadwal Internal | Kunci unit untuk keperluan acara GAMAS sendiri (tarif Rp 0) |
| Manajemen Unit & Foto | Tambah, edit, nonaktifkan unit sewa beserta foto & spesifikasi |
| Pengaturan Bisnis | Ubah nomor WhatsApp, jam operasional, syarat sewa dari UI admin |

---

## 4. ANALISIS MASALAH & SOLUSI

| # | Masalah Lama | Solusi Gamas Rent |
|---|---|---|
| 1 | Cek ketersediaan via chat/tanya-tanya manual | Halaman ketersediaan **real-time** di website |
| 2 | Bentrok jadwal pinjam barang yang sama | **Anti double-booking** otomatis di sistem |
| 3 | Tidak ada rekap data penyewa & pemasukan | **Database otomatis** — semua tercatat rapi |
| 4 | Konfirmasi manual via chat panjang | **WhatsApp 1-klik** dengan pesan terformat |
| 5 | Tidak tahu status barang (dipinjam/tersedia) | **Status real-time** tiap unit di katalog |
| 6 | Penyalahgunaan barang tanpa jejak | **Riwayat reservasi** & identitas penyewa tercatat |
| 7 | Kas GAMAS bergantung pada iuran | **Pendapatan pasif** dari sewa inventaris |

---

## 5. KATALOG PRODUK & TARIF

### Kategori: Audio & Sound System

| Unit | Tarif/Hari | Deposit | Keterangan |
|---|---|---|---|
| Speaker Aktif Bluetooth Niko 75W | Rp 30.000 | Rp 25.000 | Bisa aki & AC, Bluetooth, USB, FM Radio |
| Mic Wireless Dual Advance MIC-205 (2 unit) | Rp 25.000 | Rp 20.000 | UHF, jangkauan 50m, baterai rechargeable |

### Kategori: Peralatan Sidang & Acara

| Unit | Tarif/Hari | Deposit | Keterangan |
|---|---|---|---|
| Palu Sidang & Tatakan Kayu Jati Eksklusif | Rp 40.000 | Rp 30.000 | Kayu jati solid, pouch beludru eksklusif |
| Papan Tulis Bolak-Balik 40x60 cm | Rp 5.000 | Rp 5.000 | Whiteboard + Blackboard 2-in-1 |

### Kategori: Cooler Box & Outdoor

| Unit | Tarif/Hari | Deposit | Keterangan |
|---|---|---|---|
| Cooler Box / Box Es 33 Liter | Rp 20.000 | Rp 15.000 | Insulasi maksimal, tahan banting |
| Galon Aqua 19 Liter | Rp 5.000 | Rp 5.000 | Food grade, kompatibel pompa/dispenser |

### Ringkasan Tarif

| Metrik | Nilai |
|---|---|
| Tarif terendah | Rp 5.000/hari |
| Tarif tertinggi | Rp 40.000/hari |
| Potensi pendapatan harian (semua tersewa) | Rp 125.000/hari |

---

## 6. ANALISIS PASAR (STP)

### Segmentation (Segmentasi)

| Segmen | Karakteristik | Kebutuhan Utama |
|---|---|---|
| **Primer** | Mahasiswa / Kepanitiaan Acara Kampus | Speaker, Mic, Papan Tulis murah & dekat |
| **Sekunder** | BEM, UKM, Himpunan Mahasiswa | Palu Sidang, Mic untuk Musyawarah Besar |
| **Tersier** | Warga & UMKM Sekitar Kampus | Cooler Box untuk acara/jualan |
| **Internal** | Divisi & Panitia GAMAS sendiri | Blokir jadwal (tarif Rp 0) |

### Targeting (Target Pasar)

Target utama adalah **500+ mahasiswa aktif** UNNES Banyumas dan **puluhan UKM/organisasi** yang rutin mengadakan kegiatan sepanjang tahun akademik. Berdasarkan kalender akademik, terdapat setidaknya:
- **2–3 musyawarah/sidang** per organisasi per semester → kebutuhan palu sidang & mic
- **4–6 event besar** (seminar, festival, dies natalis) per semester → speaker & cooler box
- **Makrab & LKMM** per angkatan → speaker + cooler box

### Positioning (Diferensiasi)

> *"Gamas Rent adalah solusi sewa perlengkapan acara kampus pertama yang sepenuhnya digital, anti-bentrok jadwal, dan harganya paling bersahabat di lingkungan UNNES Banyumas."*

**Keunggulan Kompetitif:**

| Aspek | Rental Luar Kampus | Pinjam ke Teman | **Gamas Rent** |
|---|---|---|---|
| Harga | Rp 50.000–200.000 | Gratis tapi tak pasti | **Terjangkau & transparan** |
| Kemudahan Booking | Harus datang langsung | Via chat manual | **24/7 online di website** |
| Kepastian Ketersediaan | Tidak tahu | Tidak pasti | **Real-time di website** |
| Rekam Jejak | Tidak ada | Tidak ada | **Tercatat otomatis** |
| Lokasi | Jauh dari kampus | Acak | **Di lingkungan GAMAS** |

---

## 7. STRATEGI BISNIS (ANALISIS SWOT)

### Strengths (Kekuatan)
- Sistem digital sudah jadi & siap pakai — tidak perlu bangun dari nol
- Harga sangat kompetitif karena tidak ada overhead sewa tempat/karyawan
- Kepercayaan & nama baik GAMAS sebagai organisasi resmi kampus
- Lokasi strategis di lingkungan kampus — dekat dengan target pasar
- Anti double-booking otomatis — mencegah konflik yang sering terjadi sebelumnya

### Weaknesses (Kelemahan)
- Jumlah unit inventaris masih terbatas (6 unit)
- Membutuhkan pengurus yang konsisten untuk operasional admin
- Belum memiliki sistem pembayaran digital (saat ini cash/transfer manual)
- Brand awareness masih harus dibangun dari nol

### Opportunities (Peluang)
- Ekosistem mahasiswa yang sangat dinamis & banyak kegiatan sepanjang tahun
- Belum ada kompetitor sejenis yang digital & berbasis kampus
- Potensi ekspansi inventaris seiring bertambahnya modal dari keuntungan
- Potensi kemitraan dengan BEM Universitas untuk event-event besar

### Threats (Ancaman)
- Musim libur semester → permintaan turun signifikan
- Risiko kerusakan/kehilangan unit inventaris
- Munculnya kompetitor serupa dari organisasi lain
- Perubahan kebijakan kampus yang membatasi kegiatan kemahasiswaan

---

## 8. MODEL BISNIS (BUSINESS MODEL CANVAS)

| Blok | Isi |
|---|---|
| **Value Proposition** | Sewa perlengkapan acara kampus: mudah, murah, real-time, anti-bentrok |
| **Customer Segments** | Mahasiswa, kepanitiaan, UKM, organisasi kemahasiswaan, warga sekitar kampus |
| **Channels** | Website · Instagram @gamasrent.id · WhatsApp · Word-of-mouth |
| **Customer Relationships** | Self-service via web + konfirmasi personal via WhatsApp admin |
| **Revenue Streams** | Pendapatan sewa harian + deposit (dikembalikan) |
| **Key Resources** | Inventaris fisik · Platform web Gamas Rent · Admin pengurus GAMAS |
| **Key Activities** | Manajemen reservasi · Perawatan unit · Promosi digital · Update katalog |
| **Key Partners** | Pengurus GAMAS · UNNES Banyumas (legitimasi) · Mitra servis peralatan |
| **Cost Structure** | Perawatan & servis unit · Operasional admin · Cadangan penggantian unit |

---

## 9. PROYEKSI KEUANGAN

### Asumsi Dasar

| Parameter | Nilai |
|---|---|
| Hari operasional per bulan | 26 hari kerja |
| Total unit aktif | 6 unit |

### Proyeksi Pendapatan Bulanan

#### Skenario Konservatif (Utilisasi 30% = ~8 hari/bulan per unit)

| Unit | Tarif/Hari | Hari Tersewa | Pendapatan |
|---|---|---|---|
| Speaker Aktif Niko | Rp 30.000 | 8 hari | Rp 240.000 |
| Mic Wireless Dual | Rp 25.000 | 8 hari | Rp 200.000 |
| Palu Sidang Kayu Jati | Rp 40.000 | 8 hari | Rp 320.000 |
| Papan Tulis 40x60 | Rp 5.000 | 8 hari | Rp 40.000 |
| Cooler Box 33 Liter | Rp 20.000 | 8 hari | Rp 160.000 |
| Galon Aqua 19 Liter | Rp 5.000 | 8 hari | Rp 40.000 |
| **TOTAL** | | | **Rp 1.000.000/bulan** |

#### Ringkasan 3 Skenario

| Skenario | Utilisasi | Pendapatan/Bulan | Biaya/Bulan | **Laba Bersih/Bulan** |
|---|---|---|---|---|
| Konservatif | 30% | Rp 1.000.000 | Rp 190.000 | **Rp 810.000** |
| Moderat | 50% | Rp 1.625.000 | Rp 230.000 | **Rp 1.395.000** |
| Optimis (10 unit) | 70% | Rp 4.550.000 | Rp 320.000 | **Rp 4.230.000** |

> Pendapatan 100% masuk ke kas GAMAS untuk menambah inventaris, mendanai kegiatan internal, atau alokasi kesejahteraan anggota.

---

## 10. RENCANA OPERASIONAL & SOP

### Jam Operasional
- **Senin – Jumat:** 08.00 – 20.00 WIB
- **Sabtu – Minggu:** 08.00 – 18.00 WIB

### Alur Peminjaman

```
Penyewa buka website Gamas Rent
    ↓
Pilih unit → Cek ketersediaan tanggal
    ↓
Isi formulir reservasi online
    ↓
Klik "Konfirmasi via WhatsApp" → pesan otomatis ke admin
    ↓
Admin terima notif → Review di Dashboard → Konfirmasi / Tolak
    ↓
Penyewa datang ke sekretariat → Serahkan identitas asli
    ↓
Bayar tarif sewa + deposit
    ↓
Terima unit (teruji, siap pakai)
    ↓
Gunakan → Kembalikan tepat waktu
    ↓
Admin cek kondisi → Kembalikan deposit → Status "COMPLETED"
```

### Ketentuan Penyewaan
- Wajib menyerahkan identitas asli (KTP/KTM/SIM) sebagai jaminan
- Deposit dikembalikan saat unit dikembalikan dalam kondisi baik
- Kerusakan akibat kelalaian penyewa menjadi tanggung jawab penyewa
- Hold reservasi berlaku **30 menit** — lewat batas, slot otomatis dibuka kembali

---

## 11. RENCANA PEMASARAN & PROMOSI

### Digital Marketing

| Platform | Konten | Frekuensi |
|---|---|---|
| Instagram @gamasrent.id | Foto unit, info tarif, testimoni penyewa | 3x/minggu |
| WhatsApp Story | Promosi unit tersedia hari ini | Harian |
| WhatsApp Broadcast | Pengumuman promo ke UKM/BEM | 2x/bulan |
| TikTok (opsional) | Video cara booking, unboxing unit | 1x/minggu |

### Offline Marketing
- Sosialisasi ke BEM & UKM — presentasi di rapat koordinasi
- Poster & banner di papan pengumuman sekretariat
- Word-of-mouth dari penyewa pertama

### Strategi Launching
1. **Soft Launch** — buka ke anggota GAMAS & relasi, uji sistem
2. **Promo diskon 20%** untuk 20 reservasi pertama
3. **Hard Launch** — umumkan ke seluruh mahasiswa via media sosial
4. **Partnership** — tawarkan paket kerjasama ke BEM untuk event besar

---

## 12. ROADMAP PENGEMBANGAN

### Fase 0 — Oktober 2026 ✅ SELESAI
- [x] Platform web Gamas Rent selesai dibangun
- [x] Database & inventaris 6 unit terinput
- [x] Dashboard admin aktif & anti-bentrok jadwal berjalan
- [x] Blokir jadwal internal aktif

### Fase 1 — November–Desember 2026
- [ ] Soft launch ke anggota GAMAS & relasi
- [ ] Buat akun Instagram @gamasrent.id
- [ ] Sosialisasi ke 10 UKM/Organisasi target
- [ ] Tambah foto nyata semua unit
- [ ] Evaluasi 30 hari pertama operasional

### Fase 2 — Januari–April 2027
- [ ] Hard launch ke seluruh mahasiswa
- [ ] Integrasi pembayaran digital (QRIS)
- [ ] Tambah unit inventaris (+3 unit baru dari keuntungan)
- [ ] Laporan keuangan otomatis di dashboard

### Fase 3 — Mei–Oktober 2027
- [ ] Ekspansi inventaris (target 15+ unit)
- [ ] Aplikasi mobile (PWA)
- [ ] Sistem rating & ulasan penyewa
- [ ] Ekspansi ke luar kampus (warga & UMKM sekitar)

---

## 13. STRUKTUR ORGANISASI TIM

| Jabatan | Tugas Utama | Jumlah |
|---|---|---|
| **Koordinator Gamas Rent** | Pengambil keputusan, evaluasi bulanan, hubungan eksternal | 1 orang |
| **Admin Operasional** | Kelola reservasi harian, konfirmasi WhatsApp, serah-terima unit | 2 orang (shift) |
| **Penanggung Jawab Inventaris** | Pengecekan kondisi unit, servis berkala, pencatatan stok | 1 orang |
| **Tim Pemasaran Digital** | Kelola media sosial, buat konten, promosi | 1–2 orang |
| **Bendahara** | Rekap pemasukan, pengelolaan deposit, laporan keuangan | 1 orang |

> **Total tim minimal:** 5–6 orang pengurus aktif

---

## 14. PENUTUP & REKOMENDASI

### Kesimpulan

Program **Gamas Rent** bukan sekadar sistem sewa barang biasa — ini adalah **ekosistem kemandirian finansial** berbasis teknologi untuk GAMAS UNNES Banyumas. Dengan platform yang sudah siap operasional hari ini, GAMAS memiliki keunggulan *first-mover advantage* yang signifikan di lingkungan kemahasiswaan.

### Keunggulan Utama:
1. **Sudah Jadi** — tidak perlu anggaran pengembangan sistem, langsung bisa dijalankan
2. **Transparan** — semua transaksi tercatat digital, tidak ada celah manipulasi
3. **Scalable** — bisa ditambah unit & fitur seiring berkembangnya bisnis
4. **Sustainable** — model bisnis berulang (*recurring revenue*) dari sewa inventaris

### Rekomendasi Tindak Lanjut:
1. Segera lakukan soft launch dalam 2 minggu ke depan
2. Dokumentasikan SOP dan sosialisasikan ke seluruh pengurus
3. Buka rekening khusus Gamas Rent terpisah dari kas umum GAMAS
4. Tetapkan target minimal 20 transaksi di bulan pertama
5. Evaluasi rutin setiap bulan dan laporkan ke rapat pleno

---

> *"Organisasi yang kuat bukan hanya yang aktif berkegiatan, tetapi yang mampu mengelola asetnya secara cerdas untuk keberlanjutan jangka panjang."*

---

**Dokumen ini dibuat untuk keperluan internal GAMAS UNNES Banyumas.**  
**Versi: 1.0 | Oktober 2026**
