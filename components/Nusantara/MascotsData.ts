export interface CulturalMascot {
  id: string;
  name: string;
  region: string;
  island: string;
  title: string;
  tagline: string;
  image: string;
  fallbackEmoji: string;
  themeColor: string;
  bgGradient: string;
  greeting: string;
  funFact: string;
  targetLink: string;
  mapCoords: { left: string; top: string };
}

export const CULTURAL_MASCOTS: CulturalMascot[] = [
  {
    id: "sumatera",
    name: "Rimau Minang",
    region: "Sumatera Barat & Andalas",
    island: "Sumatera",
    title: "Penjaga Gonjong & Pendekar Silek",
    tagline: "Pemberani nan Santun",
    image: "/mascots/mascot-sumatera.png",
    fallbackEmoji: "🐯",
    themeColor: "#D97706",
    bgGradient: "from-amber-600/30 to-orange-700/20",
    greeting: "Salamaik Datang! Aku Rimau, mari jelajahi megahnya Rumah Gadang & sedapnya Rendang!",
    funFact: "Tanjak di kepalaku melambangkan kehormatan dan kebijaksanaan pemimpin Minangkabau.",
    targetLink: "/Sumatera",
    mapCoords: { left: "12%", top: "28%" },
  },
  {
    id: "jawa",
    name: "Gatot Cilik",
    region: "Jawa Tengah & DI Yogyakarta",
    island: "Jawa",
    title: "Kesatria Laras Slendro & Pelog",
    tagline: "Otot Kawat, Balung Wesi",
    image: "/mascots/mascot-jawa.png",
    fallbackEmoji: "🦸",
    themeColor: "#2563EB",
    bgGradient: "from-blue-600/30 to-indigo-800/20",
    greeting: "Sugeng Rawuh! Aku Gatot Cilik, mari menabuh Gamelan & mendengarkan tembang Jawa!",
    funFact: "Sayap kecil di punggungku terinspirasi dari Kotang Antakusuma pusaka Gatotkaca yang sakti.",
    targetLink: "/Jawa",
    mapCoords: { left: "36%", top: "78%" },
  },
  {
    id: "bali",
    name: "Barong Cilik",
    region: "Bali & Kepulauan Nusa Tenggara",
    island: "Bali",
    title: "Pelindung Kebajikan & Tari Suci",
    tagline: "Dharma Selalu Menang",
    image: "/mascots/mascot-bali.png",
    fallbackEmoji: "🦁",
    themeColor: "#DC2626",
    bgGradient: "from-red-600/30 to-amber-700/20",
    greeting: "Om Swastyastu! Aku Barong Cilik, mari belajar tarian sakral & keindahan tradisi Pura!",
    funFact: "Bunga kamboja di telingaku adalah lambang kesucian doa dan keharmonisan semesta.",
    targetLink: "/Jawa",
    mapCoords: { left: "50%", top: "84%" },
  },
  {
    id: "kalimantan",
    name: "Otan Dayak",
    region: "Kalimantan (Borneo)",
    island: "Kalimantan",
    title: "Sahabat Hutan & Egrang Tradisi",
    tagline: "Penjaga Paru-paru Dunia",
    image: "/mascots/mascot-kalimantan.png",
    fallbackEmoji: "🦧",
    themeColor: "#059669",
    bgGradient: "from-emerald-600/30 to-teal-800/20",
    greeting: "Adik-adik! Aku Otan, mari berlatih Egrang bambu & berkunjung ke Rumah Betang Dayak!",
    funFact: "Mahkota bulu burung enggang di kepalaku melambangkan kesetiaan dan kemuliaan suku Dayak.",
    targetLink: "/Kalimantan",
    mapCoords: { left: "37%", top: "24%" },
  },
  {
    id: "sulawesi",
    name: "Phini Anoa",
    region: "Sulawesi (Celebes)",
    island: "Sulawesi",
    title: "Nahkoda Samudra & Penjelajah Toraja",
    tagline: "Tangguh Menembus Gelombang",
    image: "/mascots/mascot-sulawesi.png",
    fallbackEmoji: "🐂",
    themeColor: "#0284C7",
    bgGradient: "from-cyan-600/30 to-blue-800/20",
    greeting: "Tabe'! Aku Phini, ayo berlayar dengan Perahu Phinisi ke Tongkonan Toraja!",
    funFact: "Songkok Recca Bugis yang kukenakan dianyam dari serat pelepah lontar asli pilihan.",
    targetLink: "/Sulawesi",
    mapCoords: { left: "62%", top: "26%" },
  },
  {
    id: "papua",
    name: "Cendera",
    region: "Papua & Kepulauan Timur",
    island: "Papua",
    title: "Bidadari Surga & Penabuh Tifa",
    tagline: "Suara Ceria dari Ufuk Fajar",
    image: "/mascots/mascot-papua.png",
    fallbackEmoji: "🦜",
    themeColor: "#E11D48",
    bgGradient: "from-rose-600/30 to-amber-700/20",
    greeting: "Kinaonak! Aku Cendera, yuk ikut aku menabuh Tifa Asmat & mencicipi Papeda hangat!",
    funFact: "Burung Cenderawasih dijuluki 'Bird of Paradise' karena keindahan bulunya yang bagaikan nirwana.",
    targetLink: "/Papua",
    mapCoords: { left: "84%", top: "34%" },
  },
];
