"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { MoveRight, Compass, Sparkles, Gamepad2, Cloud } from "lucide-react";
import FeatureHighlights from "@/components/HeroPage/FeatureHighlights";
import NusantaraExpeditionGrid from "@/components/HeroPage/NusantaraExpeditionGrid";
import MascotCarousel from "@/components/HeroPage/MascotCarousel";
import LogoLoop, { logos } from "@/components/HeroPage/LogoLoop";
import { FloatingMegaMendungClouds } from "@/components/Nusantara/MegaMendungClouds";

// Dynamically import 3D Canvas
const CulturalRelic3D = dynamic(() => import("@/components/HeroPage/CulturalRelic3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-[#0D2547]/80 border border-sky-400/20 flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 rounded-full border-2 border-sky-400/30 border-t-sky-300 animate-spin mb-3" />
      <p className="text-sky-300 font-mono text-xs tracking-wider uppercase font-bold">
        Memuat Objek 3D...
      </p>
    </div>
  ),
});

export default function HeroPage() {
  return (
    <div className="flex flex-col w-full font-plus-jakarta relative overflow-x-hidden text-[#0F2C59] bg-[#EBF3FA]">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center px-6 lg:px-20 pt-28 pb-16 overflow-hidden">
        {/* Animated Batik Mega Mendung Clouds Background */}
        <FloatingMegaMendungClouds />

        {/* Ambient Radial Soft Sky Halo */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center z-10">
          {/* Left Column: Hero Typography & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-5 text-center lg:text-left cursor-default"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#0F2C59]/15 text-[#0F2C59] text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0 w-fit shadow-xs">
              <Cloud className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
              <span>Tema Batik Awan Mega Mendung</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-[1.18] tracking-tight text-[#0F2C59]">
              Merawat Budaya <br />
              Menyapa Nusantara <br />
              Bersama{" "}
              <span className="text-[#2563EB] underline-highlight">
                Megantara
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base lg:text-lg text-[#335377] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Pelajari sejarah peradaban, arsitektur pusaka, dan keselarasan laras musik daerah Nusantara berbalut keanggunan motif awan Batik Mega Mendung dalam visual 3D yang interaktif.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-2">
              <Link
                href="/Nusantara"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#0F2C59] hover:bg-[#2563EB] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer text-sm lg:text-base group"
              >
                <span>Mulai Petualangan 3D</span>
                <MoveRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/Jawa"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#EBF3FA] text-[#0F2C59] border border-[#0F2C59]/20 font-bold flex items-center justify-center gap-2 text-sm lg:text-base transition-colors shadow-xs"
              >
                <Gamepad2 className="w-4 h-4 text-[#D97706]" />
                <span>Mini Games Jawa</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Clean 3D Cultural Relic Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 w-full"
          >
            <CulturalRelic3D />
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION: APA ITU MEGANTARA ================= */}
      <section className="bg-[#E2EDF8]/60 relative overflow-hidden py-16 lg:py-20 border-t border-[#0F2C59]/10">
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center items-center gap-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2C59] font-serif">
            Apa itu <span className="text-[#2563EB]">Megantara?</span>
          </h2>
          <p className="text-base lg:text-lg max-w-2xl text-[#335377] leading-relaxed">
            Megantara adalah platform edukasi budaya generasi baru yang memadukan filosofi luhur awan Mega Mendung Nusantara dengan teknologi visual 3D interaktif untuk memperkenalkan warisan budaya Indonesia kepada generasi penerus bangsa.
          </p>
        </div>
      </section>

      {/* ================= SECTION: 5 NUSA EXPEDITION CARDS ================= */}
      <NusantaraExpeditionGrid />

      {/* ================= SECTION: SAHABAT MASKOT 3D BUDAYA ================= */}
      <MascotCarousel />

      {/* ================= SECTION: FEATURE HIGHLIGHTS ================= */}
      <FeatureHighlights />

      {/* ================= SECTION: LOGO LOOP MITRA ================= */}
      <section className="py-20 bg-[#EBF3FA] flex flex-col items-center gap-10 overflow-hidden border-t border-[#0F2C59]/10">
        <p className="text-sm lg:text-base font-bold text-[#0F2C59] uppercase tracking-widest text-center px-6">
          Didukung Oleh Ekosistem Pendidikan & Kebudayaan
        </p>

        <div className="w-full opacity-90 transition-opacity hover:opacity-100">
          <LogoLoop
            logos={logos}
            direction="left"
            speed={35}
            gap={60}
            logoHeight={70}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
      </section>
    </div>
  );
}
