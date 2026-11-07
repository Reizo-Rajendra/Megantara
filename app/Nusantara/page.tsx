"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/TransitionContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, Compass, Layers, Map as MapIcon, Globe } from "lucide-react";
import { FloatingMegaMendungClouds } from "@/components/Nusantara/MegaMendungClouds";
import { CompassRose, EquatorLine } from "@/components/Nusantara/MaritimeCompass";
import { CULTURAL_MASCOTS, CulturalMascot } from "@/components/Nusantara/MascotsData";
import MascotMapPin from "@/components/Nusantara/MascotMapPin";
import MascotDetailModal from "@/components/Nusantara/MascotDetailModal";
import { DIORAMA_ISLANDS, IslandDioramaCard, IslandDioramaData } from "@/components/Nusantara/IslandDiorama3D";

// DO NOT CHANGE THESE POSITIONS - User is happy with them.
const ISLANDS = [
  {
    name: "Sumatera",
    file: "/pulau/sumatera.svg",
    style: { width: "30%", left: "-5%", top: "20%" },
  },
  {
    name: "Kalimantan",
    file: "/pulau/Kalimantan.svg",
    style: { width: "25%", left: "25%", top: "20%" },
  },
  {
    name: "Jawa",
    file: "/pulau/jawa.svg",
    style: { width: "65%", left: "17%", top: "90%" },
  },
  {
    name: "Sulawesi",
    file: "/pulau/sulawesi.svg",
    style: { width: "25%", left: "50%", top: "15%" },
  },
  {
    name: "Papua",
    file: "/pulau/papua.svg",
    style: { width: "40%", left: "70%", top: "28%" },
  },
];

export default function NusantaraPage() {
  const router = useRouter();
  const { setIsAnimating } = useTransitionContext();
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);
  const [selectedMascot, setSelectedMascot] = useState<CulturalMascot | null>(null);
  const [viewMode, setViewMode] = useState<"diorama" | "ocean">("diorama");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const selectedIslandData = ISLANDS.find((i) => i.name === selectedIsland);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full min-h-screen bg-[#EBF3FA] text-[#0F2C59] overflow-hidden flex flex-col items-center justify-start pt-20 md:pt-28 pb-20 md:pb-36"
    >
      {/* ================= BATIK MEGA MENDUNG CLOUDS ================= */}
      <FloatingMegaMendungClouds />

      {/* Subtle Batik Wave Grid Contours */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none -z-10" />

      {/* Maritime Compass & 0° Equator Line in Ocean Mode */}
      {viewMode === "ocean" && (
        <>
          <CompassRose className="absolute top-28 left-6 md:left-14 opacity-75 z-10" />
          <EquatorLine />
        </>
      )}

      {/* Header Text */}
      <div className="text-center mb-6 md:mb-8 relative z-20 px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#0F2C59]/15 text-[#0F2C59] text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Megantara • Jelajah Peta Budaya 3D</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight uppercase font-serif text-[#0F2C59] drop-shadow-xs"
        >
          NUSANTARA 3D
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[#335377] font-serif italic text-xs md:text-sm tracking-[0.2em] mt-1.5 uppercase font-medium"
        >
          Diorama Kepulauan Indonesia & Sahabat Maskot Budaya
        </motion.p>

        {/* View Mode Switcher Pills */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setViewMode("diorama")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              viewMode === "diorama"
                ? "bg-[#0F2C59] text-white border-[#0F2C59] shadow-md font-bold"
                : "bg-white text-[#0F2C59] border-[#0F2C59]/15 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Diorama 3D Wilayah</span>
          </button>

          <button
            onClick={() => setViewMode("ocean")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              viewMode === "ocean"
                ? "bg-[#0F2C59] text-white border-[#0F2C59] shadow-md font-bold"
                : "bg-white text-[#0F2C59] border-[#0F2C59]/15 hover:bg-slate-50"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta Samudra Lengkap</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW MODE 1: DIORAMA 3D KEPULAUAN (BRAND NEW MODERN 3D DESIGN) ================= */}
      {viewMode === "diorama" && (
        <div className="container mx-auto px-6 relative z-20 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIORAMA_ISLANDS.map((island) => (
              <IslandDioramaCard
                key={island.id}
                island={island}
                isSelected={selectedIsland === island.name}
                onSelect={(isl) => {
                  setSelectedIsland(isl.name);
                  setSelectedMascot(isl.mascot);
                }}
              />
            ))}

            {/* Complete Archipelago Overview Card */}
            <div className="w-full flex">
              <div className="w-full rounded-3xl p-6 flex flex-col justify-between bg-white border border-[#0F2C59]/15 shadow-md relative overflow-hidden group text-[#0F2C59]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] text-[#0F2C59] border border-[#0F2C59]/10 flex items-center justify-center font-bold mb-4 shadow-xs">
                    <Globe className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F2C59] font-serif">
                    Peta Samudra Utuh
                  </h3>
                  <p className="text-xs text-[#2563EB] font-mono tracking-widest mt-0.5 font-bold">
                    17.000+ PULAU DALAM 1 BENTANGAN
                  </p>
                  <p className="text-[#335377] text-xs sm:text-sm mt-3 leading-relaxed">
                    Ingin melihat posisi geografis dan rute maritim antar-pulau secara langsung? Ganti ke mode tampilan Peta Samudra Lengkap.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setViewMode("ocean")}
                    className="w-full py-3 px-4 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Buka Peta Samudra</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODE 2: PETA SAMUDRA LENGKAP ================= */}
      {viewMode === "ocean" && (
        <div
          className="relative w-full md:max-w-7xl pl-12 md:px-4 flex-1 flex items-center md:justify-center overflow-x-auto md:overflow-visible pb-20 md:pb-0 scrollbar-hide z-20"
        >
          <div
            className="relative min-w-[215vw] md:min-w-full w-full aspect-[2/1] md:aspect-[2.3/1] select-none"
            onClick={() => {
              setSelectedIsland(null);
              setSelectedMascot(null);
            }}
            onMouseLeave={() => setHoveredIsland(null)}
          >
            {/* Nautical Sea Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
              <path
                d="M 180 220 Q 320 280 440 280 T 700 240 T 950 260"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeDasharray="6,8"
              />
            </svg>

            {/* Interactive Regional Mascots */}
            {CULTURAL_MASCOTS.map((mascot) => (
              <MascotMapPin
                key={mascot.id}
                mascot={mascot}
                isSelected={selectedMascot?.id === mascot.id}
                onSelect={(m) => {
                  setSelectedMascot(m);
                  setSelectedIsland(m.island);
                }}
              />
            ))}

            {/* The 5 Illustrated Islands with enhanced 3D drop-shadow */}
            {ISLANDS.map((island) => {
              const isSelected = selectedIsland === island.name;
              const isHovered = hoveredIsland === island.name;
              const isBlur = (selectedIsland || hoveredIsland) && !isSelected && !isHovered;

              return (
                <motion.div
                  key={island.name}
                  className={`absolute cursor-pointer transition-all duration-500 ${island.name === "Papua" ? "z-15" : "z-20"}`}
                  style={{
                    ...island.style,
                    zIndex: isSelected || isHovered ? 50 : undefined,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: isBlur ? 0.45 : 1,
                    scale: isSelected || isHovered ? 1.05 : 1,
                    filter:
                      isSelected || isHovered
                        ? "drop-shadow(0 20px 30px rgba(15, 44, 89, 0.28)) drop-shadow(0 0 14px rgba(37, 99, 235, 0.2))"
                        : "drop-shadow(0 14px 22px rgba(15, 44, 89, 0.16))",
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIsland(island.name);
                  }}
                  onMouseEnter={() => setHoveredIsland(island.name)}
                  onMouseLeave={() => setHoveredIsland(null)}
                >
                  <img
                    src={island.file}
                    alt={`Peta Pulau ${island.name}`}
                    className="w-full h-auto pointer-events-none"
                    draggable={false}
                  />

                  {/* Hover Island Title Label */}
                  <AnimatePresence>
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-1/2 -translate-x-1/2 -top-12 pointer-events-none whitespace-nowrap z-50 px-3.5 py-1.5 rounded-xl bg-white border border-[#0F2C59]/15 shadow-lg text-[#0F2C59]"
                      >
                        <h3 className="text-base md:text-xl font-black font-serif uppercase tracking-wider flex items-center gap-1.5 text-[#0F2C59]">
                          <Sparkles className="w-4 h-4 text-[#D97706]" />
                          <span>{island.name}</span>
                        </h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Action Panel */}
      <AnimatePresence mode="wait">
        {selectedIsland && selectedIslandData && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-auto max-w-[460px]"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-[#0F2C59]/15 p-3.5 pr-4 rounded-3xl shadow-2xl flex items-center gap-3 md:gap-5 w-full justify-between text-[#0F2C59]">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-b from-[#EBF3FA] to-[#DBEAFE]/40 border border-[#0F2C59]/10 p-1 flex items-center justify-center shrink-0 ml-1 overflow-hidden shadow-xs">
                {CULTURAL_MASCOTS.find((m) => m.island === selectedIsland) ? (
                  <img
                    src={CULTURAL_MASCOTS.find((m) => m.island === selectedIsland)!.image}
                    alt={selectedIsland}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <MapPin size={24} className="text-[#D97706]" />
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="text-[10px] text-[#2563EB] uppercase tracking-wider font-mono font-bold truncate">
                  WILAYAH TERPILIH
                </span>
                <motion.h2
                  layout
                  className="text-lg md:text-2xl font-black text-[#0F2C59] font-serif leading-tight truncate"
                >
                  {selectedIslandData.name}
                </motion.h2>
              </div>

              <button
                className="
                   cursor-pointer
                   group relative overflow-hidden shrink-0
                   px-5 py-2.5 md:px-6 md:py-3
                   bg-[#0F2C59] hover:bg-[#2563EB] text-white
                   rounded-2xl font-bold
                   shadow-md
                   transition-all duration-200
                   flex items-center gap-2
                 "
                onClick={() => router.push(`/${selectedIsland}`)}
              >
                <span className="uppercase tracking-wider text-[11px] md:text-xs">
                  Masuk Pulau
                </span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Details Modal */}
      <MascotDetailModal
        mascot={selectedMascot}
        onClose={() => setSelectedMascot(null)}
      />
    </motion.section>
  );
}
