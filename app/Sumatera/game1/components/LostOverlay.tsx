"use client"
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface LostOverlayProps {
  onRestart: () => void;
}

const LostOverlay: React.FC<LostOverlayProps> = ({ onRestart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-xl flex items-center justify-center p-8 text-center"
    >
      <div className="max-w-md w-full">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-3xl flex items-center justify-center border border-red-200">
          <AlertTriangle size={40} className="text-red-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-red-600 italic tracking-tighter mb-3">WAKTU HABIS!</h2>
        <p className="text-[var(--secondary)]/70 text-sm md:text-base font-medium mb-8 leading-relaxed">
          Arsitektur hebat membutuhkan kesabaran. Jangan menyerah, coba bangun lagi dengan lebih teliti!
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-xs md:text-sm cursor-pointer"
          >
            <RotateCcw size={18} />
            Coba Bangun Lagi
          </button>
          
          <div className="grid grid-cols-2 gap-2.5 mt-1">
            <Link 
              href="/Sumatera"
              className="flex items-center justify-center gap-2 py-3 px-3 bg-secondary/10 hover:bg-secondary/20 text-[var(--primary)] font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95 border border-secondary/10"
            >
              <ArrowLeft size={14} />
              Kembali ke Sumatera
            </Link>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 py-3 px-3 bg-secondary/10 hover:bg-secondary/20 text-[var(--primary)] font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95 border border-secondary/10"
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

export default LostOverlay;
