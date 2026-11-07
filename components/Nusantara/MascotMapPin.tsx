"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CulturalMascot } from "./MascotsData";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function MascotMapPin({
  mascot,
  isSelected,
  onSelect,
}: {
  mascot: CulturalMascot;
  isSelected: boolean;
  onSelect: (mascot: CulturalMascot) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        left: mascot.mapCoords.left,
        top: mascot.mapCoords.top,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-40"
    >
      {/* Interactive Mascot Avatar Button */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative cursor-pointer group"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(mascot);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glowing Base Shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 rounded-full blur-xs group-hover:scale-125 transition-transform" />

        {/* Mascot Character Wrapper */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: [-2, 2, -2] }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/95 border-2 shadow-lg flex items-center justify-center p-1 overflow-hidden transition-all duration-300 ${
            isSelected || isHovered
              ? "border-[#F59E0B] shadow-[0_8px_25px_rgba(245,158,11,0.4)] scale-110"
              : "border-[#93C5FD]/40 hover:border-[#F59E0B]/60"
          }`}
        >
          {/* Mascot Image with Fallback Emoji */}
          <img
            src={mascot.image}
            alt={mascot.name}
            className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
            onError={(e) => {
              // If image still loading or not found, show cute styled fallback
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".fallback-emoji")) {
                const span = document.createElement("span");
                span.className = "fallback-emoji text-2xl select-none";
                span.innerText = mascot.fallbackEmoji;
                parent.appendChild(span);
              }
            }}
          />

          {/* Sparkle Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-slate-950 shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-slate-950" />
          </div>
        </motion.div>

        {/* Mascot Name Pill */}
        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#0F2C59]/20 text-center shadow-sm whitespace-nowrap">
          <span className="text-[10px] md:text-xs font-bold text-[#0F2C59] font-serif tracking-wide">
            {mascot.name}
          </span>
        </div>

        {/* Cute Speech Bubble Popover on Hover */}
        <AnimatePresence>
          {(isHovered || isSelected) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 md:w-64 p-3.5 rounded-2xl bg-white text-[#0F2C59] border border-[#0F2C59]/15 shadow-xl z-50 pointer-events-auto"
            >
              {/* Little Speech Triangle */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />

              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#EBF3FA] p-0.5 shrink-0 overflow-hidden border border-[#0F2C59]/10">
                  <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F2C59] font-serif leading-tight">
                    {mascot.name}
                  </h4>
                  <p className="text-[9px] font-mono text-[#D97706] font-bold uppercase">
                    {mascot.title}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#0F2C59] leading-relaxed italic bg-[#EBF3FA] p-2.5 rounded-xl border border-[#0F2C59]/10 my-2">
                "{mascot.greeting}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <span className="text-[9px] text-[#335377] font-mono font-medium">
                  {mascot.region}
                </span>
                <Link
                  href={mascot.targetLink}
                  className="px-2.5 py-1 rounded-lg bg-[#0F2C59] hover:bg-[#2563EB] text-white text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>Jelajahi ➔</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
