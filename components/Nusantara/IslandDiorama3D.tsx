"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, MapPin, ArrowRight, Mountain, Trees, Compass } from "lucide-react";
import Link from "next/link";
import { CulturalMascot } from "./MascotsData";

export interface IslandDioramaData {
  id: string;
  name: string;
  islandSlug: string;
  nativeTitle: string;
  landmarks: string[];
  features: string;
  elevationBadge: string;
  mascot: CulturalMascot;
  position: { left: string; top: string; width: string };
  gradient: string;
  glow: string;
}

export const DIORAMA_ISLANDS: IslandDioramaData[] = [
  {
    id: "sumatera",
    name: "Sumatera",
    islandSlug: "Sumatera",
    nativeTitle: "Bumi Swarnadwipa",
    landmarks: ["Bukit Barisan", "Danau Toba", "Istana Basa Pagaruyung"],
    features: "Pegunungan vulkanik aktif & arsitektur Gonjong megah",
    elevationBadge: "Puncak Kerinci 3.805 mdpl",
    mascot: {
      id: "sumatera",
      name: "Rimau Minang",
      region: "Sumatera Barat",
      island: "Sumatera",
      title: "Penjaga Gonjong",
      tagline: "Pemberani nan Santun",
      image: "/mascots/mascot-sumatera.png",
      fallbackEmoji: "🐯",
      themeColor: "#D97706",
      bgGradient: "from-amber-600/30 to-orange-700/20",
      greeting: "Salamaik Datang! Mari jelajahi megahnya Rumah Gadang & sedapnya Rendang!",
      funFact: "Tanjak melambangkan kehormatan pemimpin Minangkabau.",
      targetLink: "/Sumatera",
      mapCoords: { left: "14%", top: "30%" },
    },
    position: { left: "4%", top: "18%", width: "24%" },
    gradient: "from-emerald-600/40 via-teal-700/30 to-sky-900/60",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    islandSlug: "Kalimantan",
    nativeTitle: "Borneo Khatulistiwa",
    landmarks: ["Sungai Mahakam", "Rimba Tropis Kayan", "Rumah Betang"],
    features: "Jantung paru-paru dunia dengan peradaban sungai tertua",
    elevationBadge: "Gunung Bukit Raya 2.278 mdpl",
    mascot: {
      id: "kalimantan",
      name: "Otan Dayak",
      region: "Kalimantan",
      island: "Kalimantan",
      title: "Sahabat Hutan Borneo",
      tagline: "Penjaga Paru-paru Dunia",
      image: "/mascots/mascot-kalimantan.png",
      fallbackEmoji: "🦧",
      themeColor: "#059669",
      bgGradient: "from-emerald-600/30 to-teal-800/20",
      greeting: "Adik-adik! Ayo berlatih Egrang bambu & singgah ke Rumah Betang Dayak!",
      funFact: "Mahkota bulu enggang melambangkan kemuliaan Dayak.",
      targetLink: "/Kalimantan",
      mapCoords: { left: "37%", top: "24%" },
    },
    position: { left: "28%", top: "14%", width: "25%" },
    gradient: "from-green-600/40 via-emerald-800/30 to-blue-900/60",
    glow: "rgba(5, 150, 105, 0.4)",
  },
  {
    id: "jawa",
    name: "Jawa",
    islandSlug: "Jawa",
    nativeTitle: "Dwipantara Adiluhung",
    landmarks: ["Candi Borobudur", "Kaldera Bromo", "Keraton Surakarta"],
    features: "Pusat keselarasan laras Gamelan & arsitektur candi megah",
    elevationBadge: "Puncak Semeru 3.676 mdpl",
    mascot: {
      id: "jawa",
      name: "Gatot Cilik",
      region: "Jawa Tengah",
      island: "Jawa",
      title: "Kesatria Laras Slendro",
      tagline: "Otot Kawat, Balung Wesi",
      image: "/mascots/mascot-jawa.png",
      fallbackEmoji: "🦸",
      themeColor: "#2563EB",
      bgGradient: "from-blue-600/30 to-indigo-800/20",
      greeting: "Sugeng Rawuh! Mari menabuh Gamelan & melantunkan tembang Jawa!",
      funFact: "Sayap kecil terinspirasi dari Kotang Antakusuma sakti.",
      targetLink: "/Jawa",
      mapCoords: { left: "38%", top: "78%" },
    },
    position: { left: "20%", top: "66%", width: "32%" },
    gradient: "from-amber-600/40 via-yellow-700/30 to-indigo-900/60",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  {
    id: "sulawesi",
    name: "Sulawesi",
    islandSlug: "Sulawesi",
    nativeTitle: "Celebes Samudra",
    landmarks: ["Tana Toraja Tongkonan", "Taman Karst Rammang-rammang", "Galangan Phinisi"],
    features: "Mahakarya arsitektur perahu Phinisi & tebing batu Toraja",
    elevationBadge: "Gunung Latimojong 3.478 mdpl",
    mascot: {
      id: "sulawesi",
      name: "Phini Anoa",
      region: "Sulawesi",
      island: "Sulawesi",
      title: "Nahkoda Samudra",
      tagline: "Tangguh Menembus Ombak",
      image: "/mascots/mascot-sulawesi.png",
      fallbackEmoji: "🐂",
      themeColor: "#0284C7",
      bgGradient: "from-cyan-600/30 to-blue-800/20",
      greeting: "Tabe'! Ayo berlayar dengan Phinisi ke Tongkonan megah Toraja!",
      funFact: "Songkok Recca dianyam dari serat pelepah lontar asli.",
      targetLink: "/Sulawesi",
      mapCoords: { left: "62%", top: "26%" },
    },
    position: { left: "54%", top: "16%", width: "22%" },
    gradient: "from-cyan-600/40 via-blue-700/30 to-slate-900/60",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    id: "papua",
    name: "Papua",
    islandSlug: "Papua",
    nativeTitle: "Bumi Cenderawasih",
    landmarks: ["Puncak Cartensz", "Lembah Baliem", "Raja Ampat"],
    features: "Pegunungan salju abadi khatulistiwa & harmoni ritme Tifa",
    elevationBadge: "Puncak Jaya 4.884 mdpl",
    mascot: {
      id: "papua",
      name: "Cendera",
      region: "Papua",
      island: "Papua",
      title: "Bidadari Surga Timur",
      tagline: "Suara Ceria dari Ufuk Fajar",
      image: "/mascots/mascot-papua.png",
      fallbackEmoji: "🦜",
      themeColor: "#E11D48",
      bgGradient: "from-rose-600/30 to-amber-700/20",
      greeting: "Kinaonak! Yuk menabuh Tifa Asmat & mencicipi Papeda hangat!",
      funFact: "Burung Cenderawasih dijuluki Bird of Paradise di dunia.",
      targetLink: "/Papua",
      mapCoords: { left: "84%", top: "34%" },
    },
    position: { left: "75%", top: "22%", width: "23%" },
    gradient: "from-rose-600/40 via-orange-700/30 to-sky-950/60",
    glow: "rgba(225, 29, 72, 0.4)",
  },
];

export function IslandDioramaCard({
  island,
  isSelected,
  onSelect,
}: {
  island: IslandDioramaData;
  isSelected: boolean;
  onSelect: (island: IslandDioramaData) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 220 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="perspective-1000 w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onClick={() => onSelect(island)}
        className={`relative rounded-3xl p-6 flex flex-col justify-between min-h-[380px] cursor-pointer transition-all duration-300 border ${
          isSelected
            ? "bg-white border-[#0F2C59] shadow-xl ring-2 ring-[#0F2C59]/20"
            : "bg-white hover:bg-slate-50/80 border-[#0F2C59]/10 shadow-md hover:border-[#0F2C59]/25 hover:shadow-lg"
        }`}
      >
        {/* Subtle Ambient Base */}
        <div
          style={{ background: island.glow }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 rounded-full blur-xl opacity-20 pointer-events-none -z-10"
        />

        {/* 3D Header Section */}
        <div style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EBF3FA] border border-[#0F2C59]/15 text-[#0F2C59] uppercase tracking-wider">
              {island.nativeTitle}
            </span>
            <span className="text-[10px] font-mono text-[#335377] bg-slate-100 px-2 py-0.5 rounded-md border border-[#0F2C59]/10 font-bold">
              {island.elevationBadge}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59] font-serif leading-tight">
            {island.name}
          </h3>

          <p className="text-[#335377] text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
            {island.features}
          </p>
        </div>

        {/* Central 3D Mascot & Landmark Floating Layer */}
        <div
          style={{ transform: "translateZ(45px)" }}
          className="relative my-4 flex items-center justify-center"
        >
          {/* Floating Diorama Island Pedestal */}
          <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-[#EBF3FA] to-[#DBEAFE]/50 border border-[#0F2C59]/10 p-2 flex items-center justify-between overflow-hidden shadow-xs">
            {/* Mascot Avatar */}
            <div className="relative w-24 h-24 shrink-0 rounded-xl bg-white border border-[#0F2C59]/10 p-1 flex items-center justify-center overflow-hidden shadow-xs">
              <img
                src={island.mascot.image}
                alt={island.mascot.name}
                className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
              />
            </div>

            {/* Miniature Landmarks Tags */}
            <div className="flex-1 pl-3 pr-1 flex flex-col gap-1 text-[11px] text-[#0F2C59]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#D97706] font-bold">
                Landmark Budaya:
              </span>
              {island.landmarks.slice(0, 2).map((l, i) => (
                <div key={i} className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span className="truncate font-medium">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ transform: "translateZ(35px)" }}>
          <Link
            href={`/${island.islandSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full py-3 px-4 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group"
          >
            <span>Jelajahi {island.name}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
