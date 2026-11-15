"use client"
import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface IdleOverlayProps {
  onStart: () => void;
}

const IdleOverlay: React.FC<IdleOverlayProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-12"
    >
      <div className="max-w-2xl text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-5 bg-[var(--accent)]/10 rounded-full flex items-center justify-center border border-[var(--accent)]/20 shadow-inner">
            <img src="/Sumatera/game1/gadangfull.webp" className="w-32 md:w-36 object-contain" alt="Rumah Gadang" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-3 tracking-tighter italic">ARSITEK MINANG</h2>
          <p className="text-secondary text-sm md:text-base font-medium leading-relaxed max-w-lg mx-auto">
            Selesaikan pembangunan Rumah Gadang dengan menyusun kepingan arsitektur tradisional ke dalam kerangka bangunan sebelum waktu habis.
          </p>
        </motion.div>
        
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={onStart}
            className="group relative flex items-center justify-center gap-3 px-10 py-4 md:px-12 md:py-5 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl font-bold cursor-pointer text-sm md:text-base tracking-wider uppercase"
          >
            <Play fill="currentColor" size={18} />
            MULAI MEMBANGUN
          </button>
          
          <div className="flex items-center gap-3 mt-2">
            <Link 
              href="/Sumatera"
              className="flex items-center gap-1.5 text-secondary/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-black/5"
            >
              <ArrowLeft size={14} />
              Kembali ke Sumatera
            </Link>
            <span className="text-secondary/30">•</span>
            <Link 
              href="/"
              className="flex items-center gap-1.5 text-secondary/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-black/5"
            >
              <Home size={14} />
              Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IdleOverlay;
