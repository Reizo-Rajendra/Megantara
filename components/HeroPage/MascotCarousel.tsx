"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CULTURAL_MASCOTS, CulturalMascot } from "@/components/Nusantara/MascotsData";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MascotCarousel() {
  const [activeMascot, setActiveMascot] = useState<CulturalMascot>(CULTURAL_MASCOTS[0]);

  return (
    <section className="py-20 px-6 lg:px-20 bg-[#EBF3FA] border-t border-[#0F2C59]/10 text-[#0F2C59] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0F2C59]/15 text-[#0F2C59] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Karakter 3D Resmi Megantara</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2C59] font-serif leading-tight">
            Sahabat Maskot Budaya Nusantara
          </h2>
          <p className="text-sm text-[#335377] mt-2.5 leading-relaxed">
            Temui karakter 3D khas dari tiap pulau yang siap memandu petualangan edukasi budaya Anda!
          </p>
        </div>

        {/* Mascot Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {CULTURAL_MASCOTS.map((mascot) => {
            const isActive = mascot.id === activeMascot.id;
            return (
              <motion.button
                key={mascot.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMascot(mascot)}
                className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "bg-white border-[#0F2C59] shadow-lg ring-2 ring-[#0F2C59]/20"
                    : "bg-white/80 hover:bg-white border-[#0F2C59]/10 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-b from-[#EBF3FA] to-[#DBEAFE]/40 border border-[#0F2C59]/10 p-1.5 mb-2.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={mascot.image}
                    alt={mascot.name}
                    className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none select-none"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F2C59] font-serif leading-tight">
                  {mascot.name}
                </h4>
                <span className="text-[10px] text-[#335377] font-mono mt-0.5 font-semibold">
                  {mascot.island}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Mascot Spotlight Showcase Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMascot.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#0F2C59]/15 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-[#0F2C59]"
          >
            {/* Mascot Character Image */}
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 shrink-0 rounded-2xl bg-gradient-to-b from-[#EBF3FA] via-[#DBEAFE]/40 to-[#BFDBFE]/30 border border-[#0F2C59]/10 p-3 flex items-center justify-center shadow-inner">
              <img
                src={activeMascot.image}
                alt={activeMascot.name}
                className="w-full h-full object-contain filter drop-shadow-md select-none"
              />
            </div>

            {/* Content & Story */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-[#EBF3FA] border border-[#0F2C59]/15 text-[#0F2C59] text-xs font-mono font-bold uppercase mb-2">
                {activeMascot.region}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59] font-serif">
                {activeMascot.name}
              </h3>
              <p className="text-xs font-bold text-[#D97706] mt-0.5">
                {activeMascot.title} • <span className="italic font-normal text-[#335377]">"{activeMascot.tagline}"</span>
              </p>

              {/* Greeting */}
              <div className="my-3.5 p-3 rounded-xl bg-[#EBF3FA] border border-[#0F2C59]/10 text-xs text-[#0F2C59] italic font-serif leading-relaxed">
                "{activeMascot.greeting}"
              </div>

              {/* Fun Fact */}
              <p className="text-xs text-[#335377] leading-relaxed">
                <strong className="text-[#0F2C59]">Tahukah kamu?</strong> {activeMascot.funFact}
              </p>

              <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
                <Link
                  href={activeMascot.targetLink}
                  className="px-5 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>Kunjungi {activeMascot.island}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/Nusantara"
                  className="px-4 py-2.5 rounded-xl border border-[#0F2C59]/20 hover:bg-[#EBF3FA] text-[#0F2C59] font-bold text-xs transition-colors"
                >
                  Lihat di Peta
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
