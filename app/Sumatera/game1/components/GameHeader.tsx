"use client"
import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const GameHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="z-10 text-center mb-4 md:mb-6 mt-20 md:mt-16"
    >
      <h1 className="text-3xl md:text-5xl font-black text-[var(--primary)] mb-1 md:mb-2 tracking-tighter">
        RUMAH GADANG BUILDER
      </h1>
      <div className="flex items-center justify-center gap-2 text-[var(--secondary)]/60 uppercase tracking-[0.3em] text-[10px] font-bold">
        <Info size={12} />
        Arsitektur Tradisional Minangkabau
      </div>
    </motion.div>
  );
};

export default GameHeader;
