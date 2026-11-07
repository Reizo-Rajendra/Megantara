"use client";

import React from "react";
import { motion } from "framer-motion";

export const EquatorLine = () => (
  <div className="absolute top-[48%] left-0 right-0 w-full pointer-events-none z-10 flex items-center">
    <div className="w-full border-t border-dashed border-[#F59E0B]/30" />
    <span className="absolute right-6 -top-5 text-[10px] font-mono tracking-widest text-[#F59E0B]/70 uppercase font-bold bg-[#0F284E]/80 px-2 py-0.5 rounded-full border border-[#F59E0B]/20">
      0° Garis Khatulistiwa
    </span>
  </div>
);

export const CompassRose = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`select-none pointer-events-none ${className}`}>
      <motion.div
        animate={{ rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#F59E0B]/30" />
        <div className="absolute inset-2 rounded-full border border-[#93C5FD]/20" />

        {/* 8-Point Star Compass */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* North Point */}
          <polygon points="50,10 54,46 50,46" fill="#F59E0B" />
          <polygon points="50,10 46,46 50,46" fill="#B45309" />

          {/* South Point */}
          <polygon points="50,90 54,54 50,54" fill="#38BDF8" />
          <polygon points="50,90 46,54 50,54" fill="#1D4ED8" />

          {/* East Point */}
          <polygon points="90,50 54,54 54,50" fill="#F59E0B" />
          <polygon points="90,50 54,46 54,50" fill="#B45309" />

          {/* West Point */}
          <polygon points="10,50 46,54 46,50" fill="#38BDF8" />
          <polygon points="10,50 46,46 46,50" fill="#1D4ED8" />

          {/* Diagonal Points */}
          <polygon points="78,22 53,47 50,50" fill="#93C5FD" opacity="0.6" />
          <polygon points="22,78 47,53 50,50" fill="#93C5FD" opacity="0.6" />
          <polygon points="78,78 53,53 50,50" fill="#FDE68A" opacity="0.6" />
          <polygon points="22,22 47,47 50,50" fill="#FDE68A" opacity="0.6" />

          {/* Cardinal Labels */}
          <text x="50" y="8" textAnchor="middle" fill="#FDE68A" fontSize="7" fontWeight="bold" fontFamily="serif">U</text>
          <text x="50" y="98" textAnchor="middle" fill="#93C5FD" fontSize="7" fontWeight="bold" fontFamily="serif">S</text>
          <text x="96" y="52.5" textAnchor="middle" fill="#FDE68A" fontSize="7" fontWeight="bold" fontFamily="serif">T</text>
          <text x="4" y="52.5" textAnchor="middle" fill="#93C5FD" fontSize="7" fontWeight="bold" fontFamily="serif">B</text>
        </svg>

        {/* Center Pivot */}
        <div className="absolute w-3 h-3 rounded-full bg-[#F59E0B] border border-white shadow-sm" />
      </motion.div>
    </div>
  );
};
