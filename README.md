# 🌊 Megantara (Batik Mega Mendung - 3D Culture Exploration)

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-black?style=for-the-badge&logo=framer)
![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<p align="center">
  <b>Megantara</b> adalah platform edukasi budaya Indonesia interaktif berbasis <b>Spatial 3D WebGL</b> dengan filosofi estetika luhur motif awan <b>Batik Mega Mendung</b> (Gradasi Biru Tradisional). Menghadirkan panggung inspeksi pusaka 3D, peta spasial diorama 5 kepulauan Nusantara, 6 sahabat maskot kebudayaan, serta 10 mini games edukasi budaya dengan audio prosedural realtime.
</p>

</div>

---

## 🌟 Fitur Utama Platform

### 1. 🏛️ Panggung Pusaka 3D Interaktif (Beranda)
- **Rotasi 360° Real-time**: Inspeksi artefak dan instrumen budaya Nusantara langsung di peramban dengan kontrol drag sentuh/mouse yang mulus.
- **4 Tab Pusaka Budaya**:
  - **Gamelan Ageng** (*Jawa Tengah & DI Yogyakarta*): Ansambel perunggu laras Pelog & Slendro warisan adiluhur Keraton.
  - **Angklung Bambu** (*Jawa Barat*): Instrumen musik bambu bernada ganda warisan mahakarya dunia UNESCO.
  - **Rumah Gadang** (*Sumatera Barat*): Arsitektur vernakular Minangkabau dengan atap gonjong menjulang menyerupai tanduk kerbau.
  - **Pustaka Adat** (*Nusantara*): Manuskrip dan babad sejarah yang merekam kearifan peradaban Nusantara.
- **Pencahayaan & Material PBR**: Didukung pencahayaan ambient directional realistis, bayangan lembut (`PCFSoftShadowMap`), dan material PBR fisik Three.js.

---

### 2. 🗺️ Peta Nusantara 3D & 5 Kepulauan (`/Nusantara`)
- **Dual-Mode Exploration**:
  - **Mode Diorama 3D**: Menampilkan 5 kepulauan besar dalam bentuk kartu diorama spasial 3D dengan visual miniatur pulau, indikator status, dan shortcut ekspedisi langsung.
  - **Mode Samudra / Spasial**: Peta maritim kepulauan Indonesia berlatar kontur gelombang Mega Mendung, diperkaya dengan **Maritime Compass Rose** antik dan penanda garis khatulistiwa (**0° Equator Line**).
- **Interactive Mascot Map Pins**: Pin karakter budaya pada koordinat peta tiap kepulauan yang membuka jendela dialog interaktif berisi cerita budaya, salam adat, dan fakta menarik (*fun fact*).
- **Transisi Sinematik Awan Mega Mendung**: Tirai animasi awan bergradasi biru 5 lapis khas Cirebon yang mengalir lembut saat navigasi antar wilayah (`CloudTransition`).

---

### 3. 🎭 6 Sahabat Maskot Budaya 3D
Karakter 3D resmi Megantara yang mengenakan busana dan atribut adat autentik khas tiap daerah nusantara:
1. **Rimau Minang** (*Sumatera*) — Penjaga Gonjong & Pendekar Silek, mengenakan mahkota *Tanjak* kehormatan Minangkabau.
2. **Gatot Cilik** (*Jawa*) — Kesatria Laras Slendro & Pelog, berbusana zirah pusaka *Kotang Antakusuma*.
3. **Barong Cilik** (*Bali*) — Pelindung Kebajikan & Tari Suci, dihiasi semerbak bunga kamboja lambang kesucian doa.
4. **Otan Dayak** (*Kalimantan*) — Sahabat Hutan & Egrang Tradisi, bermahkota bulu burung Enggang lambang kemuliaan suku Dayak.
5. **Phini Anoa** (*Sulawesi*) — Nahkoda Samudra & Penjelajah Toraja, bermahkota *Songkok Recca* anyaman serat lontar Bugis.
6. **Cendera** (*Papua*) — Bidadari Surga & Penabuh Tifa, mencerminkan keceriaan dan kemilau burung Cenderawasih (*Bird of Paradise*).

---

### 4. 🎮 10 Mini Games Budaya Tradisional (2 Game per Kepulauan)

#### 🏝️ Sumatera
- **Pembangun Rumah Gadang (`/Sumatera/game1`)**:
  - Permainan edukasi arsitektur tradisional Minangkabau berbasis drag-and-drop interaktif.
  - Tantangan menyusun 3 elemen struktural: **Tiang Utama**, **Dinding Ukiran**, dan **Atap Gonjong**.
  - Dilengkapi sistem *snapping* koordinat presisi, timer, panduan visual garis bantu, serta perayaan penyelesaian.
- **Racik Rendang Minang (`/Sumatera/game2`)**:
  - Simulasi memasak kuliner terlezat dunia warisan Minangkabau.
  - Pemain memasukkan bahan sesuai urutan autentik: **Santan Kelapa**, **Rempah Pilihan**, lalu **Daging Sapi**.
  - Interaksi mengaduk kuali secara dinamis dengan mouse/sentuhan sambil menjaga kestabilan panas agar masakan matang sempurna tanpa gosong.

#### 🏝️ Jawa
- **Gamelan Saron Jawi (`/Jawa/game1`)**:
  - Permainan ritme ketukan 5 bilah perunggu gamelan laras Slendro dengan tempo 100 BPM dan 50 not bertahap.
  - Audio prosedural realistis dibangkitkan langsung oleh **Web Audio API** tanpa sampel audio eksternal yang berat.
  - Dilengkapi kontrol 5 tombol (`A`, `S`, `D`, `F`, `G`), hit zone, indikator akurasi (*SEMPURNA*, *BAGUS*, *MELESET*), combo streak multiplier, dan 8 nyawa.
- **Angklung Jawi (`/Jawa/game2`)**:
  - Simulasi instrumen bambu diatonis 8 nada lengkap (`1`–`8` / DO–DO tinggi) dengan visual animasi resonansi getar bilah bambu.
  - Panduan melodi falling notes dan umpan balik realtime.
  - Menyediakan 3 repertoar lagu daerah legendaris: **Gundul-Gundul Pacul**, **Cublak-Cublak Suweng**, dan **Suwe Ora Jamu**.

#### 🏝️ Kalimantan
- **Tantangan Egrang (`/Kalimantan/game1`)**:
  - Simulasi ketangkasan permainan tradisional egrang bambu 3D dengan batas waktu bertahan 30 detik.
  - Kontrol langkah kaki kiri dan kanan secara bergantian (`A`/`D` atau tombol sentuh layar).
  - Dilengkapi indikator kemiringan sudut badan (tilt meter) dengan toleransi maksimal 5 kali oleng sebelum jatuh.
- **Memori Patung Dayak (`/Kalimantan/game2`)**:
  - Permainan ingatan visual sekuensial (*pattern recall*) berbasis 4 simbol totem keramat Dayak Kenyah: **Enggang**, **Belawing**, **Naga**, dan **Tameng**.
  - Terdiri atas 5 level bertingkat dengan panjang urutan 3 hingga 7 simbol, batas waktu 75 detik, dan 3 nyawa.

#### 🏝️ Sulawesi
- **Jelajah Kata Bahari (`/Sulawesi/game1`)**:
  - Game pencocokan edukasi bahasa daerah untuk mengenalkan 6 kosakata luhur Bugis-Makassar: *Siri'* (harga diri/martabat), *Tabe'* (sopan santun permisi), *Marendeng* (damai sentosa), *Ewako* (semangat pantang menyerah), *Iye'* (kesantunan persetujuan), dan *Pesse* (solidaritas kepedulian).
- **Jejak Warisan Toraja & Bahari (`/Sulawesi/game2`)**:
  - Memory card matching game warisan budaya Sulawesi: **Rumah Tongkonan**, **Perahu Phinisi**, **Senjata Badik**, **Baju Bodo**, **Songkok Recca**, dan **Kapurung**.
  - Menampilkan animasi kartu membalik (flip 3D) dan pop-up pengetahuan budaya saat pasangan berhasil ditemukan.

#### 🏝️ Papua
- **Kayu Malele (`/Papua/game1`)**:
  - Permainan tradisional lempar kayu ketangkasan 3D khas Papua dengan simulasi fisika lontaran.
  - Mekanisme kontrol swipe/drag sentuh dan tombol bidik untuk mengukur sudut dan daya lempar.
  - Kalkulasi jarak lemparan (meter) dan penilaian skor akurasi.
- **The Art of Papeda (`/Papua/game2`)**:
  - Simulasi memasak makanan pokok sagu khas kepulauan timur Indonesia.
  - Kontrol penuangan air mendidih bertahap (tahan tombol *Space* atau tombol tuang), dilanjutkan gerakan memutar (drag) untuk mengaduk adonan sagu hingga mencapai tekstur kenyal bening sempurna tanpa menggumpal.

---

## 🎮 Panduan Kontrol Seluruh Permainan

| Permainan & Wilayah | Rute Akses | Kontrol Keyboard / Mouse / Sentuh | Mekanisme Utama |
|---|---|---|---|
| **Gamelan Saron** (Jawa) | `/Jawa/game1` | `A`, `S`, `D`, `F`, `G` / Klik Tombol | Ketuk bilah perunggu tepat saat not jatuh di hit zone target |
| **Angklung Jawi** (Jawa) | `/Jawa/game2` | Angka `1`–`8` / Klik Tabung Bambu | Mainkan melodi sesuai lagu daerah (Gundul Pacul, Cublak Suweng, Suwe Ora Jamu) |
| **Rumah Gadang** (Sumatera) | `/Sumatera/game1` | Mouse Drag & Drop / Touch Move | Seret 3 komponen (Tiang, Dinding, Atap) ke siluet konstruksi yang tepat |
| **Racik Rendang** (Sumatera) | `/Sumatera/game2` | Klik Bahan & Drag Aduk Kuali | Masukkan santan, rempah, daging berurutan; aduk merata dan jaga meter gosong |
| **Tantangan Egrang** (Kalimantan) | `/Kalimantan/game1` | `A` & `D` / Panah `←` `→` / Tombol Kaki | Melangkah kaki kiri-kanan bergantian, jaga keseimbangan selama 30 detik |
| **Memori Dayak** (Kalimantan) | `/Kalimantan/game2` | Klik / Sentuh Simbol Totem | Amati pola kilau 4 totem Dayak dan ulangi urutan simbol secara tepat |
| **Jelajah Kata** (Sulawesi) | `/Sulawesi/game1` | Klik / Pilih Kartu Pasangan | Hubungkan 6 kosakata Bugis-Makassar dengan arti filosofis yang tepat |
| **Jejak Warisan** (Sulawesi) | `/Sulawesi/game2` | Klik / Sentuh Kartu Terbalik | Buka pasangan kartu bergambar warisan budaya (Phinisi, Tongkonan, dll.) |
| **Kayu Malele** (Papua) | `/Papua/game1` | Klik & Tarik / Swipe Melempar | Tentukan arah dan tenaga lontaran kayu untuk mencapai jarak maksimal |
| **The Art of Papeda** (Papua) | `/Papua/game2` | Tahan `Space` & Gerakan Memutar | Tuang air panas mendidih secukupnya, putar pengaduk hingga adonan bening |

---

## ⚡ Arsitektur & Optimasi WebGL

Platform Megantara dirancang dengan standar performa web modern untuk memastikan kelancaran di berbagai spesifikasi gawai:
- **Zero Backend / Serverless Client-Side**: Seluruh komputasi visual, simulasi fisika, dan engine audio dijalankan langsung di sisi peramban klien.
- **Penyimpanan Lokal Inklusif**: Data partisipasi pengunjung dan saran budaya pada footer disimpan pada `localStorage` peramban tanpa memerlukan registrasi/login akun.
- **Pembersihan Memori Proaktif (Memory Cleanup)**: Setiap komponen 3D mengimplementasikan fungsi rekursif `dispose()` untuk seluruh geometri, material, dan tekstur GPU saat berpindah halaman guna mencegah memory leak.
- **Adaptive Render Scale**: Membatasi device pixel ratio peramban maksimal `1.5` agar konsumsi daya GPU laptop dan perangkat mobile tetap hemat dan stabil pada 60 FPS.
- **Code-Splitting & Dynamic Imports**: Komponen berat di bawah fold (seperti *NusantaraExpeditionGrid*, *MascotCarousel*, dan *FeatureHighlights*) dimuat secara asynchronous dengan placeholder skeleton loading.
- **Audio Prosedural Sintetis**: Pemanfaatan Web Audio API oscillator untuk membangkitkan frekuensi nada gamelan Slendro dan resonansi bambu Angklung, menghemat puluhan megabyte aset audio statis.

---

## ⚙️ Pipeline Optimasi Aset Statis

Seluruh model 3D dan aset visual dioptimalkan menggunakan teknik kompresi tingkat lanjut:

| Kategori Aset | Ukuran Awal | Ukuran Setelah Optimasi | Penghematan |
|---|---|---|---|
| **Total Direktori `public/`** | ± 182 MB | **± 34 MB** | **~81.3%** |
| **Model 3D GLB (17 file)** | ± 138 MB | **± 27 MB** | **~80.4%** |
| **Gambar & Tekstur PNG/JPG** | ± 34 MB | **± 4,4 MB (WebP)** | **~87.1%** |
| **Peta Kepulauan (SVG Raster)** | 6,65 MB | **± 0,4 MB (WebP)** | **~94.0%** |

Perintah optimasi pipeline aset:
```bash
# Kompresi model GLB: DRACO/quantize mesh + WebP textures + simplifikasi geometri selektif
npx --yes @gltf-transform/cli optimize <input.glb> <output.glb> \
  --compress quantize --texture-compress webp --texture-size 1024 \
  --palette false --instance false --join false --flatten false \
  --simplify true --simplify-ratio 0.3 --simplify-error 0.0005

# Konversi gambar dan peta ke WebP kualitas tinggi (sharp engine)
npx --yes sharp-cli -i input.png -o output.webp --format webp --quality 82
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics Engine**: [Three.js r182](https://threejs.org/)
- **React 3D Ecosystem**: [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://drei.docs.pmnd.rs/)
- **Animation Suite**: [Framer Motion v12](https://www.framer.com/motion/)
- **Audio Synthesis**: Native Web Audio API (Dynamic Envelope & Polyphonic Oscillators)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Local Storage**: HTML5 LocalStorage API

---

## 📁 Struktur Direktori

```text
Megantara/
├── app/                                  # Next.js App Router (Halaman & Rute Aplikasi)
│   ├── layout.tsx                        # Root layout & penyedia transisi global
│   ├── page.tsx                          # Entry point beranda dengan loading screen
│   ├── HeroPage.tsx                      # Landing page beranda dengan panggung pusaka 3D
│   ├── globals.css                       # Desain tema, palet Mega Mendung, & styling Tailwind
│   ├── Nusantara/                        # Peta interaktif 5 kepulauan (Diorama & Ocean Mode)
│   │   └── page.tsx
│   ├── Sumatera/                         # Onboarding budaya Sumatera
│   │   ├── page.tsx
│   │   ├── game1/                        # Game 1: Pembangun Rumah Gadang (Drag & Drop)
│   │   └── game2/                        # Game 2: Racik Rendang Minang (Simulasi Masak)
│   ├── Jawa/                             # Onboarding budaya Jawa
│   │   ├── page.tsx
│   │   ├── game1/                        # Game 1: Gamelan Saron Jawi (Rhythm Slendro)
│   │   └── game2/                        # Game 2: Angklung Jawi (Melodi 8 Nada Diatonis)
│   ├── Kalimantan/                       # Onboarding budaya Kalimantan
│   │   ├── page.tsx
│   │   ├── game1/                        # Game 1: Tantangan Egrang (Keseimbangan 3D)
│   │   └── game2/                        # Game 2: Memori Patung Dayak (Pattern Recall)
│   ├── Sulawesi/                         # Onboarding budaya Sulawesi
│   │   ├── page.tsx
│   │   ├── game1/                        # Game 1: Jelajah Kata Bahari (Kosakata Bugis)
│   │   └── game2/                        # Game 2: Jejak Warisan Budaya (Memory Card)
│   └── Papua/                            # Onboarding budaya Papua
│       ├── page.tsx
│       ├── game1/                        # Game 1: Kayu Malele (Lempar Kayu Fisika 3D)
│       └── game2/                        # Game 2: The Art of Papeda (Simulasi Masak Sagu)
├── components/                           # Komponen antarmuka modular
│   ├── CloudTransition.tsx               # Animasi tirai awan bergradasi Batik Mega Mendung
│   ├── Footer.tsx                        # Footer dengan kotak saran budaya & tautan cepat
│   ├── LayoutWrapper.tsx                 # Pembungkus tata letak antarmuka
│   ├── LoadingScreen.tsx                 # Layar pemuatan awal beranda
│   ├── Navbar.tsx                        # Navigasi utama dengan dropdown wilayah
│   ├── TransitionContext.tsx             # Context controller transisi rute
│   ├── HeroPage/                         # Sub-komponen beranda
│   │   ├── CulturalRelic3D.tsx           # Panggung 3D interaktif 4 pusaka Nusantara
│   │   ├── FeatureHighlights.tsx         # Sorotan keunggulan teknologi & budaya
│   │   ├── LogoLoop.tsx                  # Carousel berjalan mitra pendidikan & kebudayaan
│   │   ├── MascotCarousel.tsx            # Pameran 6 sahabat maskot budaya 3D
│   │   └── NusantaraExpeditionGrid.tsx   # Grid kartu 3D ekspedisi 5 kepulauan
│   └── Nusantara/                        # Sub-komponen peta Nusantara
│       ├── IslandDiorama3D.tsx           # Kartu diorama pulau 3D
│       ├── MaritimeCompass.tsx           # Kompas bahari antik & garis khatulistiwa
│       ├── MascotDetailModal.tsx         # Modal pop-up detail karakter maskot
│       ├── MascotMapPin.tsx              # Pin koordinat maskot pada peta pulau
│       ├── MascotsData.ts                # Basis data identitas & cerita 6 maskot
│       └── MegaMendungClouds.tsx         # Komponen visual awan terapung Mega Mendung
├── public/                               # Aset statis terkompresi (Model 3D, WebP, Ikon)
│   ├── gamelanan.glb                     # Model 3D Gamelan Slendro
│   ├── RumahGadang.glb                   # Model 3D Rumah Gadang Minangkabau
│   ├── Buku.glb                          # Model 3D Pustaka Adat
│   ├── model/angklung.glb                # Model 3D Angklung Bambu
│   ├── mascots/                          # Aset visual 6 karakter maskot budaya (WebP)
│   └── pulau/                            # Peta grafis pulau-pulau Nusantara (WebP)
├── package.json                          # Manifest dependensi & skrip proyek
└── README.md                             # Dokumentasi komprehensif proyek
```

---

## 🚀 Cara Menjalankan Project

### 1. Prasyarat
- **Node.js** versi 18.18 atau lebih baru.
- Manajer paket **npm**, **pnpm**, atau **yarn**.

### 2. Kloning Repository
```bash
git clone https://github.com/Reizo-Rajendra/Megantara.git
cd Megantara
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka peramban dan akses alamat [http://localhost:3000](http://localhost:3000) untuk mulai menjelajahi platform Megantara.

### 5. Build Produksi
```bash
npm run build
npm run start
```

---

## 📄 Lisensi

Didistribusikan di bawah **Lisensi MIT**. Lihat file `LICENSE` untuk informasi selengkapnya.

---

<div align="center">
  Didedikasikan untuk pelestarian dan pengenalan adiluhur warisan peradaban Nusantara.<br/>
  <b>Megantara</b> &bull; Dikembangkan dengan penuh integritas oleh <b>Reizo Rajendra & Teofilus</b>
</div>
