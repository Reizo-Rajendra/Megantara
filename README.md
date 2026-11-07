# 🌊 Megantara (Batik Mega Mendung - 3D Culture Exploration)

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<p align="center">
  <b>Megantara</b> adalah platform edukasi budaya Indonesia interaktif berbasis 3D WebGL dengan estetika luhur motif awan <b>Batik Mega Mendung</b> (Gradasi Biru Tradisional). Menghadirkan eksplorasi diorama kepulauan Nusantara, maskot 3D kebudayaan, serta mini games rhythm musik tradisional yang responsif dan presisi.
</p>

</div>

---

## 🌟 Fitur Utama

### 1. 🗺️ Diorama Peta 3D Nusantara & 5 Kepulauan
- **Navigasi Spasial 3D**: Jelajahi 5 kepulauan besar Indonesia:
  - **Sumatera**: Rumah Gadang Minangkabau, Tari Saman, & rempah rendang.
  - **Jawa**: Harmoni Gamelan Ageng, Wayang Purwa, & Simfoni Angklung.
  - **Kalimantan**: Rumah Betang Dayak Kenyah, Tari Burung Enggang, & Egrang.
  - **Sulawesi**: Perahu Phinisi kebanggaan bahari & Rumah Tongkonan Toraja.
  - **Papua**: Seni ukir Asmat, Rumah Honai, & ritme Tifa sagu.
- **Transisi Sinematik Awan Mega Mendung**: Animasi tirai awan bergradasi biru lapis 5 khas Cirebon yang mengalir mulus antar navigasi wilayah.

### 2. 🎵 Mini Games Musik Tradisional (Interaktif & Realtime Audio)
- **Gamelan Saron Jawi (`/jawa/game`)**:
  - Simulasi bilah perunggu gamelan laras Slendro & Pelog dengan visual bilah realistis, efek getar ketukan, serta audio synthesized Web Audio API.
  - Pilihan gending: *Gundul Gundul Pacul*, *Cublak Cublak Suweng*, dan *Suwe Ora Jamu*.
  - Mode permainan: **Tantangan Ketukan Rhythm** (dengan falling notes, hit zone, combo, akurasi *Tepat/Apik/Meleset*) dan **Mode Bebas**.
  - Kontrol ganda: Keyboard QWERTY (`1`–`7` / `A`–`J`) & Touch/Klik responsif.
- **Angklung Jawi (`/jawa/game2`)**:
  - Visual bambu bertingkat khas Angklung Jawa Barat dengan animasi getar (shake) dan resonansi tabung bambu otentik.
  - Tombol kontrol visual, label tangga nada (1-Do s/d 7-Si), panduan nada jatuh, dan umpan balik skor realtime.

### 3. 🎭 Maskot Budaya 3D Interaktif
- Maskot ikonik kebudayaan yang mengenakan pakaian dan atribut adat khas tiap kepulauan dalam rendering 3D modern dan proporsional.

### 4. ⚡ Performa Tinggi & Responsif
- **Optimasi WebGL**: Rendering Three.js dengan adaptive pixel ratio, auto-pause saat window tidak aktif, dan canvas cleanup untuk mencegah memory leak.
- **Responsif di Semua Ukuran Layar**: Layout fluid yang nyaman dimainkan di laptop 13", 14", 15.6", monitor ultrawide, maupun tablet.
- **Desain Bersih & Elegan**: Tipografi serif warisan (*Cinzel* / *Plus Jakarta Sans*), bebas dari efek neon berlebih, mengedepankan warna biru alam Mega Mendung (`#0b192c`, `#1e3e62`, `#0090e7`).

---

## 🎮 Kontrol Permainan Musik

| Instrumen | Kontrol Keyboard | Catatan |
|---|---|---|
| **Gamelan Saron** | `1`, `2`, `3`, `4`, `5`, `6`, `7` (atau `A`, `S`, `D`, `F`, `G`, `H`, `J`) | Tekan saat not melintas tepat di lingkaran target |
| **Angklung Jawi** | `1`, `2`, `3`, `4`, `5`, `6`, `7` | Goyangkan bambu sesuai birama lagu |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Audio Engine**: Web Audio API (Osilator Sintesis & Gain Envelope Dinamis)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Cara Menjalankan Project

### 1. Prasyarat
- Pastikan telah terinstall **Node.js** versi 18 atau lebih baru.
- npm atau pnpm/yarn.

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
Buka browser dan akses [http://localhost:3000](http://localhost:3000) untuk mulai menjelajah.

### 5. Build Produksi
```bash
npm run build
npm run start
```

---

## 📁 Struktur Direktori

```text
Megantara/
├── app/                  # Next.js App Router (Halaman & Rute)
│   ├── jawa/             # Halaman Kebudayaan Jawa & Mini Games (Saron & Angklung)
│   ├── kalimantan/       # Halaman Kebudayaan Kalimantan & Permainan Egrang
│   ├── sumatera/         # Halaman Kebudayaan Sumatera & Jejak Gadang
│   ├── sulawesi/         # Halaman Kebudayaan Sulawesi & Phinisi Bahari
│   ├── papua/            # Halaman Kebudayaan Papua & Tifa Asmat
│   ├── layout.tsx        # Root layout platform
│   └── page.tsx          # Beranda Megantara dengan Diorama 3D
├── components/           # Komponen UI Reusable
│   ├── 3d/               # Model & Scene 3D Three.js
│   ├── games/            # Mesin Mini Game Musik (SaronGame, AngklungGame)
│   └── ui/               # Header Mega Mendung, Navigasi, Modal, Dialog
├── public/               # Asset statis, gambar maskot 3D, audio, & ikon
└── package.json          # Manifest dependensi & skrip npm
```

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">
  Dibuat dengan ❤️ dan dedikasi untuk pelestarian warisan budaya Nusantara.<br/>
  <b>Megantara</b> &bull; Inisiatif oleh <b>Reizo Rajendra</b>
</div>
