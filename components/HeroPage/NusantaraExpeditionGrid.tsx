"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass, Gamepad2 } from "lucide-react";

interface IslandCardData {
  id: string;
  name: string;
  alias: string;
  svg: string;
  href: string;
  photo: string;
  description: string;
  games: string[];
  signature: string;
}

const ISLANDS_DATA: IslandCardData[] = [
  {
    id: "sumatera",
    name: "Sumatera",
    alias: "Swarnadwipa",
    svg: "/pulau/sumatera.svg",
    href: "/Sumatera",
    photo: "/Sumatera/game1/gadangfull.png",
    description: "Rumah Gadang Minangkabau dengan atap gonjong menjulang, racikan rempah Rendang, dan keanggunan tari Saman.",
    games: ["Jejak Rumah Gadang", "Racik Rendang"],
    signature: "Arsitektur & Kuliner Pusaka",
  },
  {
    id: "jawa",
    name: "Jawa",
    alias: "Dwipantara",
    svg: "/pulau/jawa.svg",
    href: "/Jawa",
    photo: "/Jawa/game1/gamelan-logo.png",
    description: "Harmoni laras Slendro & Pelog Gamelan ageng, pertunjukan wayang purwa, dan simfoni nada bambu Angklung.",
    games: ["Tantangan Gamelan", "Melodi Angklung"],
    signature: "Ansambel Gamelan & Nada",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    alias: "Borneo Khatulistiwa",
    svg: "/pulau/Kalimantan.svg",
    href: "/Kalimantan",
    photo: "/mascots/mascot-kalimantan.png",
    description: "Kearifan adat Dayak Kenyah, ketangkasan bermain Egrang bambu, dan filosofi Rumah Betang komunal.",
    games: ["Langkah Egrang", "Memori Dayak"],
    signature: "Permainan Adat & Komunal",
  },
  {
    id: "sulawesi",
    name: "Sulawesi",
    alias: "Celebes Bahari",
    svg: "/pulau/sulawesi.svg",
    href: "/Sulawesi",
    photo: "/assets/Sulawesi/game2/Kapal-phinisi.png",
    description: "Legenda pelaut ulung Perahu Phinisi, kemegahan rumah Tongkonan Toraja, dan keelokan tenun Baju Bodo.",
    games: ["Jelajah Kata Bahari", "Jejak Toraja"],
    signature: "Tradisi Bahari & Tekstil",
  },
  {
    id: "papua",
    name: "Papua",
    alias: "Bumi Cenderawasih",
    svg: "/pulau/papua.svg",
    href: "/Papua",
    photo: "/mascots/mascot-papua.png",
    description: "Irama tabuh Tifa suku Asmat, sajian khas kuliner Papeda sagu, dan kehangatan arsitektur Rumah Honai.",
    games: ["Ritme Tifa Asmat", "Sajian Papeda"],
    signature: "Seni Ukir Asmat & Pangan",
  },
];

function IslandCard({ island, index }: { island: IslandCardData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="perspective-1000 w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-3xl bg-white border border-[#0F2C59]/10 p-6 sm:p-7 flex flex-col justify-between min-h-[380px] shadow-md hover:shadow-xl hover:border-[#0F2C59]/25 transition-all duration-300 group text-[#0F2C59]"
      >
        {/* Island Silhouette */}
        <div className="absolute top-4 right-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
          <img
            src={island.svg}
            alt={island.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header */}
        <div style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] border border-[#0F2C59]/10 p-1.5 flex items-center justify-center overflow-hidden shadow-xs">
              <img
                src={island.photo}
                alt={island.name}
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#EBF3FA] text-[#0F2C59] font-bold border border-[#0F2C59]/15">
              {island.signature}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-[#0F2C59] font-serif group-hover:text-[#2563EB] transition-colors">
            {island.name}
          </h3>
          <p className="text-xs text-[#335377] font-mono tracking-wider mt-0.5 font-bold">
            {island.alias}
          </p>

          <p className="text-[#335377] text-xs sm:text-sm mt-3.5 leading-relaxed line-clamp-3">
            {island.description}
          </p>
        </div>

        {/* Mini Games List */}
        <div style={{ transform: "translateZ(25px)" }} className="my-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mb-1.5 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Permainan Budaya:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {island.games.map((game, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#EBF3FA] text-[#0F2C59] font-medium border border-[#0F2C59]/10"
              >
                {game}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div style={{ transform: "translateZ(30px)" }}>
          <Link
            href={island.href}
            className="w-full py-3 px-4 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn shadow-md"
          >
            <span>Kunjungi Wilayah {island.name}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NusantaraExpeditionGrid() {
  return (
    <section className="relative w-full py-20 px-6 lg:px-20 bg-[#F0F6FC] border-t border-[#0F2C59]/10 text-[#0F2C59]">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#2563EB] font-bold mb-2">
            Peta Jelajah Budaya
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2C59] font-serif leading-tight">
            5 Kepulauan Nusantara
          </h2>
          <p className="text-sm text-[#335377] mt-3 leading-relaxed">
            Pilih pulau yang ingin Anda telusuri untuk memainkan mini games tradisional dan mempelajari warisan sejarah khas daerahnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ISLANDS_DATA.map((island, index) => (
            <IslandCard key={island.id} island={island} index={index} />
          ))}

          {/* Hub Card */}
          <div className="w-full flex">
            <div className="w-full rounded-3xl bg-gradient-to-br from-[#0F2C59] to-[#1E3A8A] border border-[#0F2C59]/15 p-6 sm:p-7 flex flex-col justify-between shadow-xl text-white">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mb-4 shadow-md font-bold">
                  <Compass className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-2xl font-black text-white font-serif">
                  Peta Spasial Indonesia
                </h3>
                <p className="text-xs text-sky-200 font-mono tracking-wider mt-0.5">
                  BENTANGAN SAMUDRA LENGKAP
                </p>
                <p className="text-sky-100/90 text-xs sm:text-sm mt-3 leading-relaxed">
                  Buka peta interaktif satu layar penuh untuk melihat persebaran geografis kelima kepulauan Indonesia berbalut tema Batik Mega Mendung.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/Nusantara"
                  className="w-full py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Buka Peta Nusantara</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
