"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CulturalMascot } from "./MascotsData";
import { X, Sparkles, MapPin, ArrowRight, Volume2 } from "lucide-react";
import Link from "next/link";

export default function MascotDetailModal({
  mascot,
  onClose,
}: {
  mascot: CulturalMascot | null;
  onClose: () => void;
}) {
  if (!mascot) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-white border border-[#0F2C59]/15 shadow-2xl overflow-hidden p-6 sm:p-8 text-[#0F2C59]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EBF3FA] hover:bg-[#DCE9F6] text-[#0F2C59] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Mascot 3D Image Showcase */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl bg-gradient-to-b from-[#EBF3FA] to-[#DBEAFE] border border-[#BFDBFE] p-2 flex items-center justify-center shadow-inner">
              <img
                src={mascot.image}
                alt={mascot.name}
                className="w-full h-full object-contain filter drop-shadow-md select-none"
              />
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#0F2C59] text-white text-[10px] font-bold font-mono tracking-wider shadow-sm">
                MASKOT RESMI
              </div>
            </div>

            {/* Mascot Details */}
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2563EB] font-bold">
                {mascot.region}
              </span>
              <h3 className="text-2xl font-black text-[#0F2C59] font-serif mt-0.5">
                {mascot.name}
              </h3>
              <p className="text-xs font-bold text-[#D97706] mt-0.5">
                {mascot.title}
              </p>
              <p className="text-xs text-[#335377] italic mt-1">
                "{mascot.tagline}"
              </p>
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#EBF3FA] border border-[#0F2C59]/10 text-xs text-[#0F2C59] leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sapaan Maskot Budaya:</span>
            </p>
            <p className="italic font-serif text-sm text-[#0F2C59]">
              "{mascot.greeting}"
            </p>
          </div>

          {/* Cultural Fun Fact */}
          <div className="mt-3 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] leading-relaxed">
            <span className="font-bold text-[#B45309]">Tahukah Kamu? </span>
            <span>{mascot.funFact}</span>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <Link
              href={mascot.targetLink}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Jelajahi {mascot.island}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
