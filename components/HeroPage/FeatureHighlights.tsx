"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Gamepad2, ArrowRight, Box, Compass } from "lucide-react";
import Link from "next/link";

export default function FeatureHighlights() {
  return (
    <section className="py-20 px-6 lg:px-20 bg-[#F0F6FC] border-t border-[#0F2C59]/10 text-[#0F2C59] relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#2563EB] font-bold mb-2">
            Inovasi Pembelajaran
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-[#0F2C59] font-serif leading-tight"
          >
            Rasakan Budaya Lewat <br />
            <span className="text-[#2563EB]">
              Teknologi 3D Interaktif
            </span>
          </motion.h2>
          <p className="text-sm text-[#335377] mt-3 leading-relaxed">
            Menghidupkan kembali kearifan lokal melalui visualisasi presisi 3D dan gamifikasi yang menyenangkan.
          </p>
        </div>

        {/* Clean Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: 3D Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-white rounded-3xl p-7 md:p-10 border border-[#0F2C59]/10 flex flex-col justify-between shadow-md text-[#0F2C59]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] text-[#0F2C59] border border-[#0F2C59]/10 flex items-center justify-center mb-5 shadow-xs font-bold">
                <Box className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] font-serif mb-3 leading-snug">
                Inspeksi Artefak dan Alat Musik Tradisional
              </h3>
              <p className="text-[#335377] text-sm sm:text-base leading-relaxed max-w-xl">
                Jelajahi instrumen Gamelan Jawa, Angklung Sunda, hingga arsitektur Rumah Gadang dalam model 3D nyata. Putar dari berbagai sudut untuk melihat detail ukiran dan struktur aslinya.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 pt-4 border-t border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span className="text-xs text-[#335377] font-medium">
                Didukung pustaka Three.js dan visualisasi WebGL
              </span>
            </div>
          </motion.div>

          {/* Card 2: 5 Nusa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-white border border-[#0F2C59]/10 rounded-3xl p-7 flex flex-col justify-between shadow-md text-[#0F2C59]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] border border-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center mb-5 shadow-xs">
                <Gamepad2 className="w-6 h-6 text-[#D97706]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F2C59] font-serif mb-3">
                Jelajah 5 Kepulauan
              </h3>
              <p className="text-[#335377] text-xs sm:text-sm leading-relaxed mb-6">
                Tiap pulau memiliki tantangan permainan edukasi budaya tersendiri.
              </p>

              <div className="flex flex-col gap-2">
                {["Sumatera", "Jawa", "Kalimantan", "Sulawesi", "Papua"].map((island, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#0F2C59]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    <span className="font-semibold">{island}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/Nusantara"
              className="mt-6 py-3 px-4 rounded-xl bg-[#0F2C59] hover:bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Buka Peta</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
