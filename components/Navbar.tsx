"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Home,
  ChevronDown,
  Cloud,
  Landmark,
  Music,
  Trees,
  Ship,
  Sparkles,
} from "lucide-react";

interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  { name: "Beranda", link: "/" },
  { name: "Nusantara", link: "/Nusantara" },
];

const islandQuickLinks = [
  { name: "Sumatera", link: "/Sumatera", icon: Landmark, desc: "Rumah Gadang & Rendang" },
  { name: "Jawa", link: "/Jawa", icon: Music, desc: "Gamelan & Angklung" },
  { name: "Kalimantan", link: "/Kalimantan", icon: Trees, desc: "Dayak & Egrang" },
  { name: "Sulawesi", link: "/Sulawesi", icon: Ship, desc: "Phinisi & Toraja" },
  { name: "Papua", link: "/Papua", icon: Sparkles, desc: "Tifa Asmat & Honai" },
];

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isNusaDropdownOpen, setIsNusaDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const nusaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nusaDropdownRef.current && !nusaDropdownRef.current.contains(event.target as Node)) {
        setIsNusaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.06,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="fixed top-3 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`pointer-events-auto relative flex items-center gap-3 px-3.5 py-2 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-md border border-[#0F2C59]/15 shadow-xl"
              : "bg-white/90 backdrop-blur-md border border-[#0F2C59]/10 shadow-md"
          }`}
        >
          {/* Logo MEGANTARA */}
          <Link href="/" className="flex items-center gap-2.5 pl-1 pr-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F2C59] flex items-center justify-center shadow-xs">
              <Cloud className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black font-serif tracking-wide text-[#0F2C59]">
                MEGANTARA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#335377]/80 -mt-0.5 font-bold">
                BUDAYA 3D
              </span>
            </div>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-[#0F2C59]/15 mx-1" />

          {/* Navigation Items */}
          <div className="flex items-center gap-1 font-semibold">
            {navItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.link}
                    className={`relative z-10 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-colors duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "text-white"
                        : "text-[#0F2C59]/80 hover:text-[#0F2C59]"
                    }`}
                  >
                    {item.name}
                  </Link>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveDesktopCleanBlue"
                      className="absolute inset-0 bg-[#0F2C59] rounded-xl z-0 shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}

                  {/* Hover Indicator */}
                  {hoveredItem === item.name && !isActive && (
                    <motion.div
                      layoutId="navHoverDesktopCleanBlue"
                      className="absolute inset-0 bg-[#0F2C59]/5 rounded-xl z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </div>
              );
            })}

            {/* Quick 5 Nusa Dropdown Menu */}
            <div className="relative" ref={nusaDropdownRef}>
              <button
                onClick={() => setIsNusaDropdownOpen(!isNusaDropdownOpen)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0F2C59]/80 hover:text-[#0F2C59] hover:bg-[#0F2C59]/5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Pilih Wilayah</span>
                <ChevronDown
                  size={14}
                  className={`text-[#335377] transition-transform duration-200 ${
                    isNusaDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isNusaDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-3 w-60 p-2 rounded-2xl bg-white border border-[#0F2C59]/15 shadow-xl z-50 flex flex-col gap-1"
                  >
                    <p className="px-3 py-1 text-[10px] font-mono tracking-widest text-[#335377] uppercase font-bold">
                      JELAJAH 5 KEPULAUAN
                    </p>
                    {islandQuickLinks.map((island) => {
                      const IconComponent = island.icon;
                      return (
                        <Link
                          key={island.name}
                          href={island.link}
                          onClick={() => setIsNusaDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#EBF3FA] text-[#0F2C59] text-xs font-semibold transition-colors group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#EBF3FA] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold group-hover:text-[#2563EB] transition-colors">{island.name}</span>
                            <span className="text-[10px] text-[#335377]/70">{island.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* --- MOBILE DOCK NAVBAR --- */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-xs">
        <motion.div
          className="relative bg-white/95 backdrop-blur-xl border border-[#0F2C59]/15 shadow-xl rounded-2xl px-3 py-1.5 flex items-center justify-around"
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: isVisible ? 0 : 150,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
        >
          {[
            { name: "Beranda", link: "/", icon: Home },
            { name: "Nusantara", link: "/Nusantara", icon: Compass },
          ].map((item) => {
            const isActive = item.link === pathname;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.link}
                className="flex-1 flex justify-center w-full"
              >
                <div
                  className={`relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-colors ${
                    isActive ? "text-white" : "text-[#0F2C59]/70 hover:text-[#0F2C59]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActivePillCleanBlue"
                      className="absolute inset-0 bg-[#0F2C59] rounded-xl -z-10 shadow-sm"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    />
                  )}

                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
}
