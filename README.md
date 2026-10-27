# 🚀 Gamas Rent — Platform Rental Full-Stack Next.js (MVP Siap Pakai)

Platform penyewaan perlengkapan acara (*Sound System, Mic Wireless, Palu Sidang, Papan Tulis Kecil, Cooler Box*) dan kendaraan dengan sistem katalog cerdas, pengecekan ketersediaan real-time, pencegahan bentrok jadwal (*conflict prevention*), integrasi pesan WhatsApp otomatis, serta dashboard admin lengkap.

---

## ⚡ Panduan Cepat Menjalankan Aplikasi

Aplikasi berada di folder `frontend/`. Buka terminal **PowerShell** dan jalankan:

```powershell
# 1. Masuk ke folder frontend
cd frontend

# 2. Instal dependensi
npm install --legacy-peer-deps

# 3. Sinkronkan database SQLite lokal (zero-config, tanpa Docker/server external)
npx prisma db push

# 4. Masukkan data awal demo
npm run seed

# 5. Jalankan server aplikasi
npm run dev
```

Buka di browser:
- 🌐 **Website Publik**: [http://localhost:3000](http://localhost:3000)
- 🛡️ **Dashboard Admin**: [http://localhost:3000/admin-panel](http://localhost:3000/admin-panel) (Login: `admin@gamasrent.com` / `adminpassword123`)

Dokumentasi lengkap arsitektur, database, API, dan pengujian dapat dilihat di [frontend/README.md](file:///c:/Users/Muhamad%20Abdul%20Gani/GamasRent/frontend/README.md).
