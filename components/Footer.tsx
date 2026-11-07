"use client";

import { motion } from "framer-motion";
import { ArrowUp, Cloud, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Beranda", href: "/" },
    { title: "Peta Nusantara", href: "/Nusantara" },
    { title: "Sumatera (Gadang)", href: "/Sumatera" },
    { title: "Jawa (Gamelan)", href: "/Jawa" },
    { title: "Kalimantan (Dayak)", href: "/Kalimantan" },
    { title: "Sulawesi (Phinisi)", href: "/Sulawesi" },
    { title: "Papua (Asmat)", href: "/Papua" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#0F2C59] text-white py-12 px-6 lg:px-20 overflow-hidden font-sans border-t border-[#0F2C59]/10">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Brand MEGANTARA */}
          <div className="flex flex-col justify-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-2xl font-black font-serif tracking-wider text-white"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-xs">
                <Cloud className="w-4 h-4 text-white fill-white" />
              </div>
              <span>MEGANTARA</span>
            </Link>
            <p className="text-xs sm:text-sm text-sky-200/80 mt-2.5 max-w-xs leading-relaxed">
              Jelajah Mahakarya Budaya 3D Nusantara berbalut keagungan filosofi awan Batik Mega Mendung Indonesia.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Wilayah Kepulauan
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-xs text-sky-100/75 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-sky-300/60" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kirim Saran */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-2">
              Aspirasi Budaya
            </h3>
            <p className="text-xs text-sky-200/80 mb-2.5">
              Punya ide artefak atau cerita daerah yang ingin dimasukkan?
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Tulis saran Anda..."
                className="w-full bg-[#0B1E3B] border border-sky-400/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-sky-200/40 focus:outline-none focus:border-sky-300 transition-colors"
              />
              <button
                type="button"
                className="self-end bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-white/10 text-xs text-sky-200/60">
          <p className="flex items-center gap-1.5">
            <span>&copy; {currentYear} Megantara. Merawat Budaya Nusantara.</span>
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-sky-200/75 hover:text-white transition-colors cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
