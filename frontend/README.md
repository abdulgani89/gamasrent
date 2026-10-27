# 🚀 Gamas Rent — Platform Rental Full-Stack Next.js (MVP Siap Pakai)

Platform penyewaan perlengkapan acara (*Sound System, Mic Wireless, Palu Sidang, Papan Tulis Kecil, Cooler Box*) dan kendaraan dengan sistem katalog cerdas, pengecekan ketersediaan real-time, pencegahan bentrok jadwal (*conflict prevention*), integrasi pesan WhatsApp otomatis, serta dashboard admin lengkap.

---

## 📋 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Tech Stack & Arsitektur](#-tech-stack--arsitektur)
3. [Struktur Folder](#-struktur-folder)
4. [Model Database & Relasi](#-model-database--relasi)
5. [Daftar Endpoint API](#-daftar-endpoint-api)
6. [Cara Menjalankan dari Nol](#-cara-menjalankan-dari-nol)
7. [Akun Administrator Demo](#-akun-administrator-demo)
8. [Pengaturan Nomor WhatsApp](#-pengaturan-nomor-whatsapp)
9. [Menjalankan Pengujian (Testing)](#-menjalankan-pengujian-testing)
10. [Panduan Deployment ke Produksi](#-panduan-deployment-ke-produksi)
11. [Daftar Environment Variables](#-daftar-environment-variables)
12. [Checklist Sebelum Digunakan Pelanggan Nyata](#-checklist-sebelum-digunakan-pelanggan-nyata)

---

## ✨ Fitur Utama

### 🛒 Sisi Publik (Calon Pelanggan)
- **Beranda Interaktif**: Hero section dinamis, pencarian cepat berdasarkan kategori dan tanggal, sorotan unit rekomendasi (*Featured*), alur cara sewa, dan keunggulan layanan.
- **Katalog Unit Lengkap**: Filter pencarian real-time berdasarkan kata kunci, kategori, rentang tarif sewa per hari, dan pengurutan (termurah/termahal/terbaru).
- **Detail Unit Komprehensif**: Galeri foto, spesifikasi teknis lengkap, daftar fasilitas/kelengkapan, syarat sewa, dan kalkulator tarif otomatis.
- **Formulir Reservasi Mandiri**: Validasi nomor telepon dan rentang tanggal sewa dengan perlindungan terhadap bentrok jadwal (*double-booking prevention*).
- **Integrasi WhatsApp 1-Klik**: Pesan reservasi diformat secara otomatis dengan kode unik booking, rincian biaya, dan tanggal pemakaian langsung ke WhatsApp admin.
- **Halaman Informasi**: Panduan Lengkap Cara Sewa (`/cara-sewa`), Profil & Nilai Layanan (`/tentang-kami`), serta Kontak Toko & Lokasi (`/kontak`).

### 🛡️ Sisi Admin Panel (`/admin-panel`)
- **Autentikasi Aman**: Login admin terproteksi NextAuth.js JWT dengan pembatasan hak akses via middleware.
- **Dashboard Overview**: Metrik ringkasan KPI (Unit Siap Sewa, Menunggu Verifikasi, Sedang Berjalan, Estimasi Nilai Sewa), funnel aktivitas pengunjung, dan tabel reservasi terbaru.
- **Manajemen Unit**: Tambah unit rental baru dengan foto, tarif, spesifikasi, dan toggle status operasional (`AVAILABLE`, `MAINTENANCE`, `RETIRED`).
- **Manajemen Reservasi**: Filter status tab (`PENDING`, `CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED/REJECTED`), input catatan admin, dan tombol cepat hubungi penyewa via WhatsApp.
- **Kalender Jadwal Sewa**: Visualisasi kalender bulanan interaktif untuk melihat unit mana yang sedang disewa atau kosong pada hari tertentu.
- **Pengaturan Bisnis**: Ubah nama bisnis, alamat toko, syarat umum, durasi hold reservasi, dan nomor WhatsApp resmi langsung dari UI admin.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components + Client Components)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Checking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan Lucide React Icons
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
  - *Pengembangan Lokal*: SQLite (`prisma/dev.db`) — **100% Zero-Config & berjalan seketika tanpa perlu instal server/Docker!**
  - *Produksi*: PostgreSQL (Kompatibel penuh dengan Supabase / Neon / AWS RDS)
- **Autentikasi**: [NextAuth.js v5](https://authjs.dev/) (Credentials Provider dengan bcryptjs)
- **Validasi Data**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Pengujian**: [Vitest](https://vitest.dev/) (24 Automated Unit & Logic Tests)

---

## 📂 Struktur Folder

```
GamasRent/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma        # Skema database SQLite & entitas relasi
│   │   └── seed.ts              # Script demo data unit (Sound, Mic, Palu, Whiteboard, Cooler)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/        # Rute publik (Beranda, Katalog, Unit, Cara Sewa, Kontak)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── katalog/page.tsx
│   │   │   │   ├── unit/[slug]/page.tsx
│   │   │   │   ├── cara-sewa/page.tsx
│   │   │   │   ├── tentang-kami/page.tsx
│   │   │   │   └── kontak/page.tsx
│   │   │   ├── admin-panel/     # Portal Dashboard Admin
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx     # Overview KPI & Reservasi Terbaru
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── units/page.tsx
│   │   │   │   ├── bookings/page.tsx
│   │   │   │   ├── calendar/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   └── api/             # REST API Handlers
│   │   │       ├── bookings/route.ts
│   │   │       ├── units/route.ts
│   │   │       ├── admin/
│   │   │       └── auth/[...nextauth]/route.ts
│   │   ├── components/
│   │   │   ├── admin/           # Shell, UnitManager, BookingManager, Calendar, Settings
│   │   │   ├── booking/         # BookingForm dengan WhatsApp generator
│   │   │   ├── catalog/         # UnitCard, CatalogFilter, HeroSearchForm
│   │   │   └── layout/          # Navbar, Footer
│   │   ├── lib/
│   │   │   ├── prisma.ts        # Prisma client singleton
│   │   │   ├── types.ts         # Enums & parsing helpers
│   │   │   ├── auth.ts          # NextAuth konfigurasi
│   │   │   ├── utils.ts         # formatRupiah, calculateDuration, wa.me generator
│   │   │   └── validations/     # Zod input schemas
│   │   ├── repositories/        # Abstraksi query database
│   │   ├── services/            # Logika bisnis transaksi, conflict check & dashboard
│   │   └── middleware.ts        # Route guard admin
│   ├── .env                     # Konfigurasi environment lokal
│   └── package.json
```

---

## 🗄️ Model Database & Relasi

1. **Category**: Kategori unit (`Audio & Sound System`, `Peralatan Sidang & Acara`, `Cooler Box & Outdoor`, dll.).
2. **RentalUnit**: Informasi unit rental, spesifikasi teknis, fasilitas kelengkapan, tarif harian, uang deposit, dan status operasional (`AVAILABLE`, `MAINTENANCE`, `RETIRED`).
3. **UnitImage**: Galeri foto unit dengan urutan tampilan (`sortOrder`).
4. **Customer**: Data penyewa (Nama, No Telepon/WhatsApp unik, Email).
5. **Booking**: Transaksi reservasi dengan kode unik (`GR-XXXXXX`), rentang tanggal `[startAt, endAt)`, opsi ambil (`SELF_PICKUP` / `DELIVERY`), snapshot harga, status (`PENDING`, `CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `REJECTED`), dan waktu hold sementara.
6. **BookingStatusHistory**: Catatan audit log setiap kali status reservasi diubah beserta catatan admin.
7. **PaymentRecord**: Catatan pembayaran sewa (DP / Lunas / Tunai / Transfer).
8. **User**: Akun admin & hak akses peran (`ADMIN`, `SUPER_ADMIN`).
9. **BusinessSetting**: Profil usaha, nomor WhatsApp operasional, alamat toko, dan jam buka.
10. **AnalyticsEvent**: Tracking funnel konversi (kunjungan katalog, klik WhatsApp, booking dibuat, sewa selesai).

---

## 🔌 Daftar Endpoint API

| Metode | Endpoint | Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/units` | Publik | Daftar unit dengan filter pencarian, kategori, harga & pagination |
| `GET` | `/api/units/[slug]` | Publik | Detail lengkap spesifikasi unit |
| `GET` | `/api/units/[slug]/availability` | Publik | Cek ketersediaan unit pada tanggal tertentu |
| `POST` | `/api/bookings` | Publik | Buat reservasi baru (dengan pencegahan bentrok jadwal) |
| `GET` | `/api/categories` | Publik | Daftar kategori rental aktif |
| `GET` | `/api/business-settings` | Publik | Pengaturan publik nama bisnis & nomor WhatsApp |
| `GET` | `/api/admin/dashboard` | Admin | Ringkasan metrik KPI & grafik analitik |
| `GET` | `/api/admin/bookings` | Admin | Daftar reservasi dengan filter status & pencarian |
| `PATCH`| `/api/admin/bookings/[id]/status`| Admin | Update status reservasi (dengan validasi transisi status) |
| `GET` | `/api/admin/units` | Admin | Daftar semua unit termasuk unit nonaktif |
| `POST` | `/api/admin/units` | Admin | Tambah unit rental baru |
| `PATCH`| `/api/admin/units/[id]` | Admin | Edit informasi & status operasional unit |
| `GET` | `/api/admin/calendar` | Admin | Data reservasi bulanan untuk kalender visual |
| `GET` | `/api/admin/settings` | Admin | Ambil pengaturan bisnis |
| `PATCH`| `/api/admin/settings` | Admin | Simpan perubahan nomor WhatsApp & profil bisnis |

---

## ⚡ Cara Menjalankan dari Nol

Buka terminal **PowerShell** dan jalankan perintah berikut secara berurutan:

```powershell
# 1. Pindah ke direktori frontend
cd "c:\Users\Muhamad Abdul Gani\GamasRent\frontend"

# 2. Instal seluruh dependensi proyek
npm install --legacy-peer-deps

# 3. Sinkronkan database SQLite lokal
npx prisma db push

# 4. Masukkan data awal demo (Unit Sound, Mic, Palu, Whiteboard, Cooler Box & Akun Admin)
npm run seed

# 5. Jalankan server pengujian otomasi (Opsional, pastikan 24 tes lulus)
npm test

# 6. Jalankan aplikasi mode development
npm run dev
```

Buka browser Anda di:
- **Website Publik**: [http://localhost:3000](http://localhost:3000)
- **Portal Login Admin**: [http://localhost:3000/admin-panel/login](http://localhost:3000/admin-panel/login)

---

## 👤 Akun Administrator Demo

Gunakan akun default berikut untuk masuk ke dashboard admin:
- **URL Login**: [http://localhost:3000/admin-panel/login](http://localhost:3000/admin-panel/login)
- **Email**: `admin@gamasrent.com`
- **Password**: `adminpassword123`

*(Tersedia tombol "Gunakan Demo" pada halaman login untuk pengisian otomatis)*

---

## 📱 Pengaturan Nomor WhatsApp

Untuk mengganti nomor WhatsApp tujuan order pelanggan:
1. Masuk ke **Admin Panel** (`/admin-panel`).
2. Klik menu **Pengaturan Bisnis** (`/admin-panel/settings`).
3. Ubah kolom **Nomor WhatsApp Admin** (gunakan format internasional diawali 62, contoh: `6281234567890`).
4. Klik **Simpan Perubahan**. Seluruh tombol WhatsApp di website publik akan otomatis mengarah ke nomor baru!

---

## 🧪 Menjalankan Pengujian (Testing)

Aplikasi dilengkapi 24 automated unit & logic tests yang memverifikasi:
- Pencegahan bentrok reservasi ganda (*double-booking detection*).
- Aturan transisi status booking yang sah (*PENDING → CONFIRMED → ACTIVE → COMPLETED*).
- Kalkulasi durasi hari dan format Rupiah.
- Validasi skema Zod pada formulir pemesanan.

Jalankan pengujian dengan perintah:
```powershell
npm test
```

---

## 🌐 Panduan Deployment ke Produksi

### Opsi A: Deployment ke Vercel + Supabase/Neon PostgreSQL (Direkomendasikan)
1. Buat database PostgreSQL gratis di [Supabase](https://supabase.com/) atau [Neon](https://neon.tech/).
2. Di file `prisma/schema.prisma`, ganti `provider = "sqlite"` menjadi `provider = "postgresql"`.
3. Set Environment Variable di dashboard Vercel:
   - `DATABASE_URL`: URI koneksi PostgreSQL produksi Anda.
   - `AUTH_SECRET`: String acak aman 32+ karakter (generate via `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Domain produksi Anda (contoh: `https://gamasrent.com`).
   - `NEXT_PUBLIC_APP_URL`: Domain produksi Anda.
   - `WHATSAPP_NUMBER`: Nomor WhatsApp operasional Anda.
4. Jalankan migrasi dan seed di produksi:
   ```bash
   npx prisma db push
   npm run seed
   ```

---

## 🔐 Daftar Environment Variables

| Variable | Default (Lokal) | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `"file:./dev.db"` | Koneksi SQLite lokal / PostgreSQL produksi |
| `AUTH_SECRET` | `"gamas-rent-dev-secret-key-32chars-min-secure"` | Kunci enkripsi sesi NextAuth |
| `NEXTAUTH_URL` | `"http://localhost:3000"` | Base URL aplikasi |
| `NEXT_PUBLIC_APP_URL` | `"http://localhost:3000"` | Base URL publik |
| `WHATSAPP_NUMBER` | `"6281234567890"` | Nomor WhatsApp default admin |
| `NODE_ENV` | `"development"` | Mode runtime Node.js |

---

## ✅ Checklist Sebelum Digunakan Pelanggan Nyata

- [ ] Ganti kata sandi admin default (`adminpassword123`) di menu pengaturan / database produksi.
- [ ] Sesuaikan nomor WhatsApp admin resmi di menu Pengaturan Bisnis.
- [ ] Periksa dan sesuaikan alamat toko serta jam buka fisik di menu Pengaturan Bisnis.
- [ ] Atur tarif sewa aktual dan uang deposit untuk masing-masing unit rental.
- [ ] Unggah foto resolusi tinggi asli dari unit milik Gamas Rent.
- [ ] Lakukan uji coba 1 kali transaksi booking nyata dan pastikan chat WhatsApp masuk ke nomor admin.
