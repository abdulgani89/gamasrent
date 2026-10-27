import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding database Gamas Rent...')

  // ─── Categories ──────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'audio-sound-system' },
      update: {},
      create: {
        name: 'Audio & Sound System',
        slug: 'audio-sound-system',
        description: 'Perangkat tata suara profesional untuk seminar, rapat, pengajian, pesta, dan acara indoor/outdoor',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'peralatan-sidang-acara' },
      update: {},
      create: {
        name: 'Peralatan Sidang & Acara',
        slug: 'peralatan-sidang-acara',
        description: 'Perlengkapan persidangan resmi, musyawarah mahasiswa/organisasi, presentasi, dan event',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'outdoor-cooler-box' },
      update: {},
      create: {
        name: 'Cooler Box & Outdoor',
        slug: 'outdoor-cooler-box',
        description: 'Cooler box penahan es, kotak pendingin minuman makanan, dan perlengkapan kegiatan luar ruangan',
        isActive: true,
      },
    }),
  ])

  console.log(`✅ ${categories.length} kategori berhasil dibuat/diverifikasi`)

  // ─── Demo Units (Real items requested by User) ──────────────────────────
  const demoUnits = [
    {
      categorySlug: 'audio-sound-system',
      name: 'Speaker Aktif Bluetooth Niko',
      slug: 'speaker-aktif-bluetooth-niko',
      description: 'Speaker aktif Bluetooth Niko ringkas dan bertenaga dengan daya 75 Watt serta 2-Way Audio Crossover. Sangat multiguna dan fleksibel karena dapat dihidupkan menggunakan aki mobil/motor maupun listrik AC, menjadikannya pilihan ideal untuk acara outdoor yang minim stopkontak.\n\nDilengkapi konektivitas serbaguna (Bluetooth, Flashdisk USB, Micro SD, AUX, hingga TV), port mic built-in yang siap untuk pemandu acara (MC) & hiburan karaoke, pengaturan kenop audio (Volume, Treble, Bass), remote control jarak jauh, serta fitur radio FM.',
      specifications: {
        'Merek': 'Niko (2-Way Audio Crossover)',
        'Daya Listrik': '75 Watt (Efisien & Bertenaga)',
        'Frekuensi & Sensitivitas': '45Hz – 20.000Hz | 92dB',
        'Koneksi': 'Wireless Bluetooth, AUX, USB, HDMI, Optical, NFC',
        'Dimensi': '10 x 10 x 10 cm (Ringkas & Portabel)',
        'Sumber Daya': 'Listrik AC & Aki Mobil/Motor (DC 12V)',
        'Kontrol Audio': 'Volume, Treble, Bass + Remote Control',
      },
      facilities: [
        'Multiguna & Fleksibel (Bisa Aki Mobil/Motor untuk Outdoor)',
        'Konektivitas Lengkap (Bluetooth, USB, Micro SD, AUX, TV)',
        'Built-in Mic Input (Siap untuk MC & Karaoke)',
        'Audio Control (Kenop Volume, Treble, Bass)',
        'Remote Control Jarak Jauh',
        'Fitur Ekstra FM Radio',
        'Kabel Power & Audio Lengkap',
      ],
      rentalTerms: 'Wajib menyerahkan kartu identitas (KTP/KTM asli) sebagai jaminan. Kerusakan akibat kelalaian operasional menjadi tanggung jawab penyewa.',
      dailyRate: 30000,
      depositAmount: 25000,
      isFeatured: true,
      imageUrl: '/speaker-niko-gl10.jpg',
    },
    {
      categorySlug: 'audio-sound-system',
      name: 'Mic Wireless Dual Advance MIC-205',
      slug: 'mic-wireless-dual-advance-mic-205',
      description: 'Paket 2 unit mikrofon genggam nirkabel (wireless) Advance Digitals MIC-205 dengan frekuensi UHF berjangkauan luas dan konektivitas stabil hingga 20–50 meter. Sangat praktis untuk acara yang dipandu lebih dari satu MC atau pembicara, tanpa ribet kabel.\n\nDilengkapi teknologi anti-noise dengan pola tangkapan Cardioid untuk meredam kebisingan latar belakang serta menjaga vokal tetap jernih dan fokus. Menggunakan baterai isi ulang (rechargeable 600 mAh) yang tahan 4–8 jam pemakaian tanpa repot ganti baterai AA. Unit disewakan dalam kondisi bersih, baterai terisi penuh (siap pakai), dan sudah melalui uji kualitas suara.',
      specifications: {
        'Merek & Model': 'Advance Digitals (MIC-205)',
        'Tipe Koneksi': 'UHF Nirkabel (Wireless)',
        'Jangkauan Sinyal': '20 – 50 Meter Stabil',
        'Respons Frekuensi': '20Hz – 20KHz',
        'Sensitivitas': '-92 dBm',
        'Pola Tangkapan': 'Cardioid Anti-Noise',
        'Kapasitas Baterai': 'Rechargeable 600 mAh (Tahan 4–8 Jam)',
        'Konektor Output': 'Jack Audio 6.5mm Universal',
      },
      facilities: [
        '2x Unit Mikrofon Genggam (Handheld)',
        '1x Receiver Nirkabel Advance',
        '2x Ring Mic Silikon Anti-Roll',
        'Baterai Cas 600 mAh (Sudah Terisi Penuh)',
        'Kabel Charger USB untuk Receiver/Mic',
        'Kabel Jack Audio 6.5mm ke Speaker/Mixer',
        'Dus & Kemasan Pelindung Unit',
      ],
      rentalTerms: 'Wajib jaminan kartu identitas asli (KTP/KTM/SIM). Unit diserahkan dalam kondisi siap pakai & baterai penuh. Harap kembalikan unit dalam kondisi lengkap beserta ring mic dan receiver.',
      dailyRate: 25000,
      depositAmount: 20000,
      isFeatured: true,
      imageUrl: '/mic-advance-205.jpg',
    },
    {
      categorySlug: 'peralatan-sidang-acara',
      name: 'Palu Sidang & Tatakan Kayu Jati Eksklusif [DEMO]',
      slug: 'palu-sidang-tatakan-kayu-jati-demo',
      description: 'Palu sidang persidangan resmi dan musyawarah besar terbuat dari kayu jati solid pernis halus. Menghasilkan suara ketukan tegas dan mantap untuk pembukaan dan pengesahan sidang.',
      specifications: {
        'Bahan Material': 'Kayu Jati Solid Grade A',
        'Finishing': 'Natural Glossy Varnish',
        'Kelengkapan': 'Palu Sidang + Tatakan Bulat Kayu Jati',
        'Ukuran Panjang': 'Palu 27 cm, Diameter Tatakan 14 cm',
      },
      facilities: [
        'Palu Sidang Kayu Jati',
        'Tatakan Ketuk Kayu Jati Solid',
        'Pouch Beludru Eksklusif Penyimpanan',
      ],
      rentalTerms: 'Wajib KTP/KTM asli. Tidak boleh digunakan untuk membenturkan benda keras selain tatakan kayu jati.',
      dailyRate: 40000,
      depositAmount: 30000,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    },
    {
      categorySlug: 'peralatan-sidang-acara',
      name: 'Papan Tulis Bolak-Balik 40x60 cm',
      slug: 'papan-tulis-bolak-balik-40x60-cm',
      description: 'Papan tulis multifungsi 2-in-1 bolak-balik ukuran 40x60 cm. Satu sisi berfungsi sebagai Whiteboard (untuk spidol), dan sisi baliknya berfungsi sebagai Blackboard (untuk kapur). Terbuat dari material plywood dengan bingkai list aluminium hitam tebal 9mm, pelindung sudut plastik pengaman, dan 2 ring gantungan di bagian atas.',
      specifications: {
        'Ukuran': '40 x 60 cm (Ringkas dan portabel)',
        'Bahan': 'Plywood & Aluminium List (Tebal 9mm)',
        'Tipe': 'Dua Sisi (Whiteboard untuk Spidol & Blackboard untuk Kapur)',
        'Fitur Desain': 'Pelindung Sudut Plastik Aman & 2 Ring Gantungan Atas',
      },
      facilities: [
        'Papan Tulis 2-in-1 (Sisi Whiteboard & Blackboard)',
        '2 Ring Gantungan Atas Terpasang',
        'Pelindung Sudut Plastik Pengaman',
        'Bingkai Aluminium List 9mm Kokoh',
      ],
      rentalTerms: 'Gunakan hanya spidol whiteboard non-permanen untuk sisi whiteboard dan kapur tulis untuk sisi blackboard. Wajib jaminan identitas asli (KTP/KTM).',
      dailyRate: 5000,
      depositAmount: 5000,
      isFeatured: true,
      imageUrl: '/papan-tulis-40x60.jpg',
    },
    {
      categorySlug: 'outdoor-cooler-box',
      name: 'Cooler Box / Box Es 33 Liter',
      slug: 'cooler-box-es-33-liter',
      description: 'Cooler Box / Box Es kapasitas 33 Liter yang tangguh dan serbaguna untuk menjaga kesegaran minuman dan makanan selama acara Anda.\n\nFitur & Keunggulan:\n• Kapasitas Ideal (33 Liter): Ruang penyimpanannya lega. Sangat muat untuk menampung puluhan botol air mineral, minuman kaleng/cup, teh, beserta tumpukan es batu di dalamnya.\n• Insulasi Maksimal & Awet Dingin: Terbuat dari bahan plastik ekstra tebal dengan kualitas terjamin. Mampu menahan suhu dingin lebih lama sehingga es tidak cepat mencair walau cuaca di luar sedang panas.\n• Tangguh & Tahan Banting: Material plastiknya kokoh dan kuat, aman untuk dibawa mobilitas ke berbagai venue acara, mulai dari lapangan kampus, gedung, hingga area camping / makrab.\n• Serbaguna: Cocok untuk penyimpanan es batu, pendingin minuman kemasan, atau menjaga kesegaran bahan makanan selama acara berlangsung.',
      specifications: {
        'Kapasitas': '33 Liter',
        'Panjang': '50 cm',
        'Lebar': '32 cm',
        'Tinggi': '39 cm',
        'Material': 'Plastik Tebal (Isolasi Suhu)',
      },
      facilities: [
        'Box Es Kapasitas 33 Liter',
        'Material Plastik Ekstra Tebal & Kokoh',
        'Tutup Rapat Penahan Suhu Dingin',
        'Cocok untuk Acara Kampus, Gedung & Outdoor / Makrab',
      ],
      rentalTerms: 'Wajib mengembalikan dalam keadaan bersih dan dikeringkan setelah pemakaian. Wajib jaminan identitas resmi (KTP/KTM).',
      dailyRate: 20000,
      depositAmount: 15000,
      isFeatured: true,
      imageUrl: '/cooler-box-33l.png',
    },
    {
      categorySlug: 'outdoor-cooler-box',
      name: 'Galon Aqua 19 Liter',
      slug: 'galon-aqua-19-liter',
      description: 'Galon air mineral Aqua ukuran standar 19 Liter untuk memenuhi kebutuhan hidrasi dan konsumsi di berbagai kegiatan acara, rapat panitia, seminar, maupun kegiatan outdoor.\n\nFitur & Keunggulan:\n• Kapasitas Besar (19 Liter): Cukup untuk memenuhi kebutuhan air minum puluhan orang. Cocok untuk diletakkan di backstage panitia atau area registrasi peserta.\n• Lebih Hemat Anggaran: Sangat menekan budget konsumsi acara karena kamu hanya perlu membeli air refill atau isi ulang, tanpa perlu menumpuk sampah botol plastik.\n• Fleksibel & Standar Universal: Ukurannya standar, sehingga sangat mudah dipasangkan dengan pompa galon manual, pompa elektrik, maupun mesin dispenser.\n• Ramah Lingkungan: Membantu mewujudkan event yang zero-waste dengan mengurangi penggunaan plastik sekali pakai.',
      specifications: {
        'Kapasitas': '19 Liter',
        'Material': 'Plastik Polikarbonat (Food Grade & Kokoh)',
        'Kesesuaian': 'Cocok untuk Semua Jenis Dispenser & Pompa Galon',
        'Kondisi': 'Bersih, Higienis & Siap Pakai',
      },
      facilities: [
        'Galon Aqua 19 Liter (Kondisi Bersih)',
        'Kompatibel Pompa Manual / Elektrik / Dispenser',
        'Standar Food Grade Aman untuk Konsumsi',
        'Solusi Hemat & Ramah Lingkungan',
      ],
      rentalTerms: 'Kondisi galon bersih dan tidak bocor/pecah saat diserahkan. Wajib mengembalikan galon dalam kondisi utuh dan bersih. Wajib jaminan identitas resmi (KTP/KTM).',
      dailyRate: 5000,
      depositAmount: 5000,
      isFeatured: true,
      imageUrl: '/galon-aqua-19l.png',
    },
  ]

  for (const item of demoUnits) {
    const category = categories.find((c) => c.slug === item.categorySlug)
    if (!category) continue

    const unit = await prisma.rentalUnit.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        specifications: JSON.stringify(item.specifications),
        facilities: JSON.stringify(item.facilities),
        rentalTerms: item.rentalTerms,
        dailyRate: item.dailyRate,
        depositAmount: item.depositAmount,
        operationalStatus: 'AVAILABLE',
        isActive: true,
        isFeatured: item.isFeatured,
      },
      create: {
        categoryId: category.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        specifications: JSON.stringify(item.specifications),
        facilities: JSON.stringify(item.facilities),
        rentalTerms: item.rentalTerms,
        dailyRate: item.dailyRate,
        depositAmount: item.depositAmount,
        operationalStatus: 'AVAILABLE',
        isActive: true,
        isFeatured: item.isFeatured,
      },
    })

    // Upsert main image
    await prisma.unitImage.deleteMany({ where: { unitId: unit.id } })
    await prisma.unitImage.create({
      data: {
        unitId: unit.id,
        imageUrl: item.imageUrl,
        altText: item.name,
        sortOrder: 0,
      },
    })
  }

  console.log(`✅ ${demoUnits.length} unit demo berhasil dibuat/diperbarui`)

  // ─── Business Settings ───────────────────────────────────────────────────
  const setting = await prisma.businessSetting.upsert({
    where: { id: 'default-setting' },
    update: {},
    create: {
      id: 'default-setting',
      businessName: 'Gamas Rent',
      whatsappNumber: '6281234567890',
      address: 'Jl. Kampus Terpadu No. 45, Sleman, D.I. Yogyakarta',
      businessHours: JSON.stringify({
        senin_jumat: '08:00 - 20:00 WIB',
        sabtu_minggu: '08:00 - 18:00 WIB',
      }),
      socialMedia: JSON.stringify({
        instagram: '@gamasrent.id',
        whatsapp: '081234567890',
      }),
      privacyPolicy: 'Data diri penyewa disimpan secara aman dan hanya digunakan untuk verifikasi reservasi rental.',
      rentalTerms: 'Penyewa wajib membawa identitas diri yang berlaku (KTP/KTM/SIM). Pembayaran deposit dikembalikan saat unit selesai disewa dalam kondisi baik.',
      holdDurationMinutes: 30,
      timezone: 'Asia/Jakarta',
    },
  })

  console.log(`✅ Pengaturan bisnis default: ${setting.businessName}`)

  // ─── Admin Account ───────────────────────────────────────────────────────
  const adminEmail = 'gamas@gmail.com'
  const defaultPassword = 'gamassatria123'
  const passwordHash = await bcrypt.hash(defaultPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: 'Super Admin Gamas Rent',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  console.log(`✅ Akun admin siap:`)
  console.log(`   Email:    ${admin.email}`)
  console.log(`   Password: ${defaultPassword}`)
  console.log('   ⚠️  PERINGATAN: Ganti password default ini sebelum deployment produksi!')

  console.log('🎉 Seeding database selesai dengan sukses!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
