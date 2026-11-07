"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud } from "lucide-react";

export default function LoadingScreen({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const { progress: realProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - prev;
        const jump = Math.max(0.9, remaining * 0.09);
        const next = prev + jump;
        return next > 99.5 ? 100 : next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (realProgress > progress) {
      setProgress(realProgress);
    }
  }, [realProgress, progress]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsFinished(true);
        onFinished();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#EBF3FA] text-[#0F2C59]"
        >
          <div className="relative flex flex-col items-center">
            {/* Clean Cloud Icon */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-white border border-[#0F2C59]/15 flex items-center justify-center shadow-sm mb-4"
            >
              <Cloud className="w-7 h-7 text-[#2563EB] fill-[#2563EB]" />
            </motion.div>

            {/* Brand: MEGANTARA */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-[#0F2C59] mb-2 tracking-[0.2em] uppercase font-serif"
            >
              MEGANTARA
            </motion.h2>

            <p className="text-[#335377] text-xs font-mono tracking-[0.25em] uppercase mb-8 font-semibold">
              Edukasi Budaya 3D Nusantara
            </p>

            {/* Clean Blue Progress Bar */}
            <div className="w-64 md:w-80 h-[3px] bg-[#0F2C59]/15 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-[#2563EB]"
              />
            </div>

            {/* Percentage */}
            <div className="mt-3 flex items-center justify-between w-64 md:w-80 text-xs font-mono text-[#335377]">
              <span className="tracking-wider">MEMUAT ASET BUDAYA</span>
              <span className="font-bold text-[#0F2C59]">{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
