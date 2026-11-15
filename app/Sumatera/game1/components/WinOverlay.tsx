"use client"
import React from "react";
import { motion } from "framer-motion";
import { Info, RotateCcw, ArrowRight, ArrowLeft, Home, Trophy } from "lucide-react";
import Link from "next/link";

interface WinOverlayProps {
  onRestart: () => void;
}

const WinOverlay: React.FC<WinOverlayProps> = ({ onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
    >
      <div className="w-full max-w-lg text-foreground">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-xl border-2 border-secondary/15 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl text-center"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-[var(--accent)] to-emerald-500" />

          {/* Trophy Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-amber-300">
            <Trophy size={36} className="text-amber-600" />
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-[var(--primary)] mb-1">
            Konstruksi Berhasil!
          </h3>
          <p className="text-xs md:text-sm text-secondary/70 font-semibold mb-4">
            Level 1: Rumah Gadang Minangkabau Berhasil Disusun
          </p>

          <div className="bg-background/80 p-4 rounded-2xl border border-secondary/10 mb-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-primary" size={16} />
              <h4 className="text-sm font-bold text-secondary">Mengenal Rumah Gadang</h4>
            </div>

            <p className="text-secondary/80 text-xs leading-relaxed mb-3 font-medium">
              Rumah Gadang adalah rumah adat bagi masyarakat Minangkabau di Sumatera Barat. Wujudnya yang paling khas adalah <span className="text-primary font-bold">Atap Gonjong</span> yang melengkung tajam layaknya tanduk kerbau dengan konstruksi pasak kayu tahan gempa.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white p-2.5 rounded-lg border border-secondary/10">
                <span className="text-primary font-black uppercase block mb-0.5">Filosofi</span>
                <span className="text-secondary font-bold">Alam Takambang Jadi Guru</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-secondary/10">
                <span className="text-primary font-black uppercase block mb-0.5">Sistem Konstruksi</span>
                <span className="text-secondary font-bold">Elastisitas & Resiliensi Gempa</span>
              </div>
            </div>
          </div>

          {/* Action Row 1: Main Lagi & Level Selanjutnya */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-background hover:bg-secondary/10 text-primary font-bold rounded-xl border border-secondary/15 transition-all uppercase tracking-wide text-xs cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              Main Lagi
            </button>
            <button
              onClick={() => alert("Level Berikutnya: Rumah Bolon Batak (Segera Hadir di Update Berikutnya!)")}
              className="group flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-black rounded-xl transition-all shadow-md uppercase tracking-wide text-xs cursor-pointer active:scale-95"
            >
              Level Berikutnya
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Action Row 2: Kembali ke Sumatera & Kembali ke Halaman Utama */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/Sumatera"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-[var(--primary)] font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95 border border-secondary/10"
            >
              <ArrowLeft size={14} />
              Kembali ke Sumatera
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95 shadow-sm"
            >
              <Home size={14} />
              Halaman Utama
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WinOverlay;
