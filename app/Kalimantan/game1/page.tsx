"use client";

import React, { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky, ContactShadows, Text, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Footprints, RotateCcw, Volume2, Info, ChevronLeft, Timer, AlertTriangle, Trophy, Home, Keyboard, X } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

import Stilts from "./components/Stilts";
import { GAME_DURATION, MAX_FALLS, EGRANG_COLORS } from "./constants";

export default function EgrangGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [falls, setFalls] = useState(0);
  const [distance, setDistance] = useState(0);
  const [balance, setBalance] = useState(0); // -1 to 1
  const [lastStep, setLastStep] = useState<"L" | "R" | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [leftFoot, setLeftFoot] = useState(0);
  const [rightFoot, setRightFoot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [stumbleWarning, setStumbleWarning] = useState<string | null>(null);

  // Refs for stale-closure prevention in event listeners and loops
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const lastStepRef = useRef(lastStep);
  useEffect(() => {
    lastStepRef.current = lastStep;
  }, [lastStep]);

  const lastStepTimeRef = useRef<number>(0);
  const spamCountRef = useRef<number>(0);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Efek suara (beep audio context standar)
  const playPop = useCallback(() => {
    try {
      const AudioCtor =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      const audioCtx = new AudioCtor();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  const showWarning = useCallback((msg: string) => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setStumbleWarning(msg);
    warningTimerRef.current = setTimeout(() => {
      setStumbleWarning(null);
    }, 900);
  }, []);

  const handleFall = useCallback(() => {
    setFalls(prev => {
      const newFalls = prev + 1;
      if (newFalls >= MAX_FALLS) {
        setGameState("lost");
        gameStateRef.current = "lost";
      }
      return newFalls;
    });
    setBalance(0);
    setLeftFoot(0);
    setRightFoot(0);
    setLastStep(null);
    lastStepRef.current = null;
    spamCountRef.current = 0;
    showWarning("Jatuh! Keseimbangan hilang!");
  }, [showWarning]);

  // Game loop: Keseimbangan dinamis (gravitasi / inersia + hembusan angin)
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setBalance(prev => {
        // Efek gravitasi inersia: jika sudah miring, tarikan semakin kuat
        const gravityPull = prev * 0.09;
        const windDrift = (Math.random() - 0.5) * 0.16;
        const newBalance = prev + gravityPull + windDrift;
        
        // Batas jatuh lebih ketat (0.85) agar lebih realistis dan menantang
        if (Math.abs(newBalance) >= 0.85) {
          handleFall();
          return 0;
        }
        return newBalance;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, handleFall]);

  // Timer game
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("won");
      gameStateRef.current = "won";
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Melangkah (L atau R)
  const takeStep = useCallback((side: "L" | "R") => {
    if (gameStateRef.current !== "playing") return;

    const now = performance.now();
    const timeDelta = now - lastStepTimeRef.current;
    lastStepTimeRef.current = now;

    // Animasi visual kaki
    if (side === "L") {
      setLeftFoot(1);
      setTimeout(() => setLeftFoot(0), 180);
    } else {
      setRightFoot(1);
      setTimeout(() => setRightFoot(0), 180);
    }

    // Deteksi spamming tombol:
    // Melangkah egrang membutuhkan irama (jeda wajar ~280-450ms).
    // Menekan terlalu cepat (< 270ms) dihitung sebagai spam.
    const isSpam = timeDelta < 270;
    if (isSpam) {
      spamCountRef.current += 1;
    } else {
      spamCountRef.current = 0;
    }

    setBalance(prev => {
      let stepImpact = side === "L" ? -0.22 : 0.22;

      // 1. Penalti jika menggunakan kaki yang sama berturut-turut
      if (side === lastStepRef.current) {
        stepImpact = side === "L" ? -0.58 : 0.58;
        showWarning("Kaki Sama! Harus Bergantian!");
      } else {
        setDistance(prevDist => prevDist + 1);
        playPop();
      }

      // 2. Penalti berat jika tombol di-spam secara brutal
      if (spamCountRef.current >= 2) {
        // Ayunan liar akibat kehilangan pijakan
        const chaoticStumble = (Math.random() > 0.5 ? 1 : -1) * (0.35 + spamCountRef.current * 0.12);
        stepImpact += chaoticStumble;
        showWarning("⚠️ Jangan Spam! Jaga Irama!");
      }

      const newBalance = prev + stepImpact;

      // Cek jatuh langsung saat melangkah
      if (Math.abs(newBalance) >= 0.85) {
        handleFall();
        return 0;
      }

      return newBalance;
    });

    setLastStep(side);
    lastStepRef.current = side;
  }, [handleFall, playPop, showWarning]);

  // Kontrol Keyboard (A/D, Panah Kiri/Kanan, L/R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tombol Space/Enter saat game selesai atau idle untuk mulai ulang
      if (gameStateRef.current !== "playing") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          startGame();
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "a" || key === "arrowleft" || key === "l") {
        e.preventDefault();
        takeStep("L");
      } else if (key === "d" || key === "arrowright" || key === "r") {
        e.preventDefault();
        takeStep("R");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [takeStep]);

  const startGame = () => {
    setGameState("playing");
    gameStateRef.current = "playing";
    setTimeLeft(GAME_DURATION);
    setFalls(0);
    setDistance(0);
    setBalance(0);
    setLastStep(null);
    lastStepRef.current = null;
    spamCountRef.current = 0;
    setShowInfo(false);
    setStumbleWarning(null);
  };

  return (
    <>
      <Head>
        <title>Tantangan Egrang Borneo | Megantara</title>
        <meta name="description" content="Uji keseimbanganmu dalam permainan tradisional Egrang dari Kalimantan secara 3D." />
      </Head>
      <main className="relative w-full h-screen bg-[#BAE6FD] overflow-hidden font-sans select-none">
        {/* Langit */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7DD3FC] to-[#BAE6FD] z-0" />

        {/* Nav Bar Atas - Selalu dapat diklik di tengah permainan (z-40) */}
        <nav className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-40 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Link 
              href="/Kalimantan" 
              className="flex items-center gap-2 text-[#543310] hover:bg-white/80 bg-white/50 backdrop-blur-md px-3.5 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm border border-white/60 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={isMobile ? 16 : 20} />
              <span>Kembali ke Kalimantan</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-[#543310]/80 hover:text-[#543310] hover:bg-white/80 bg-white/40 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-full font-semibold text-xs md:text-sm border border-white/40 transition-all active:scale-95 cursor-pointer"
            >
              <Home size={14} />
              <span className="hidden sm:inline">Halaman Utama</span>
            </Link>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowInfo(prev => !prev)}
              className="p-2.5 md:p-3 bg-[#543310] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Panduan Kontrol & Informasi"
            >
              <Info size={isMobile ? 18 : 20} />
            </button>
          </div>
        </nav>

        {/* Judul Atas - pointer-events-none agar tidak menutupi klik tombol */}
        <div className="absolute top-16 md:top-6 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4 pointer-events-none">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-4xl font-black text-[#543310] drop-shadow-lg uppercase tracking-wider"
          >
            Tantangan Egrang
          </motion.h1>
          <p className="text-[10px] md:text-xs font-bold text-[#543310]/70 uppercase tracking-widest mt-1">
            Gunakan Keyboard [A / D] atau [← / →]
          </p>
        </div>

        {/* Notifikasi Peringatan Tersandung / Anti-Spam */}
        <AnimatePresence>
          {stumbleWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-28 md:top-20 left-1/2 -translate-x-1/2 z-30 bg-red-600/90 text-white font-black text-xs md:text-sm px-4 py-2 rounded-full shadow-2xl border-2 border-white/60 pointer-events-none animate-pulse flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              <span>{stumbleWarning}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kiri - Stats Waktu & Jatuh */}
        <div className="absolute top-28 md:top-24 left-4 md:left-6 flex flex-col gap-2 md:gap-4 z-20 pointer-events-none">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#4D7C0F]/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <Timer className="text-[#543310]/60" size={14} />
              <p className="text-[9px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest">Waktu</p>
            </div>
            <p className={`text-2xl md:text-3xl font-black ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-[#543310]"}`}>
              {timeLeft}s
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#7C2D12]/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <AlertTriangle className="text-red-500" size={14} />
              <p className="text-[9px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest">Jatuh</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#543310]">
              {falls}<span className="text-base md:text-lg text-[#543310]/40 font-bold">/{MAX_FALLS}</span>
            </p>
          </motion.div>
        </div>

        {/* Kanan - Stats Langkah */}
        <div className="absolute top-28 md:top-24 right-4 md:right-6 flex flex-col items-end gap-2 md:gap-4 z-20 pointer-events-none">
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-3xl border-2 md:border-4 border-yellow-500/20 shadow-xl text-right"
          >
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <p className="text-[9px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest">Langkah</p>
              <Footprints className="text-yellow-600" size={14} />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#543310]">{distance}</p>
          </motion.div>
        </div>

        {/* Indikator Keseimbangan Tengah Bawah */}
        <div className={`absolute ${isMobile ? "bottom-32" : "bottom-36"} left-1/2 -translate-x-1/2 w-52 md:w-72 h-3.5 md:h-4 bg-black/25 rounded-full z-20 border-2 border-white/50 backdrop-blur-sm pointer-events-none`}>
          {/* Danger zone highlights */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-red-500/30 rounded-l-full" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-red-500/30 rounded-r-full" />
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/50 -translate-x-1/2" />
          
          <motion.div 
            animate={{ x: balance * (isMobile ? 96 : 136) }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute top-1/2 left-1/2 -mt-3 -ml-3 md:-mt-3.5 md:-ml-3.5 w-6 h-6 md:w-7 md:h-7 rounded-full shadow-xl border-2 border-[#543310] ${
              Math.abs(balance) > 0.65 ? "bg-red-500 animate-ping-once" : "bg-white"
            }`}
          />
          <div className="absolute -top-5 left-0 w-full flex justify-between px-2 text-[9px] md:text-[11px] font-black text-[#543310]">
            <span className="text-red-700">KIRI</span>
            <span className="text-[#543310]/70">TENGAH</span>
            <span className="text-red-700">KANAN</span>
          </div>
        </div>
        
        {/* 3D Canvas */}
        <div className="w-full h-full">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 2, isMobile ? 12 : 8]} 
              fov={isMobile ? 50 : 45} 
            />
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            
            <Suspense fallback={null}>
              <Stilts balance={balance} leftFootPos={leftFoot} rightFootPos={rightFoot} />
              
              {/* Tanah */}
              <group position={[0, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial color="#BEF264" />
                </mesh>
                <gridHelper 
                  args={[100, 50, "#4D7C0F", "#4D7C0F"]} 
                  onUpdate={(self) => {
                    self.material.transparent = true;
                    self.material.opacity = 0.2;
                  }} 
                />
              </group>

              <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
              <Environment preset="park" />
            </Suspense>

            <OrbitControls 
              enablePan={false} 
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* Tombol Kiri dan Kanan (Bisa diklik atau pakai Keyboard) */}
        <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 z-30">
          <button
            onPointerDown={() => takeStep("L")}
            className="w-20 h-20 md:w-28 md:h-28 bg-[#543310] hover:bg-[#6c4217] active:bg-[#3d240b] text-white rounded-2xl md:rounded-3xl shadow-2xl active:scale-95 transition-all border-b-4 md:border-b-8 border-black font-black flex flex-col items-center justify-center cursor-pointer select-none"
            aria-label="Langkah Kiri"
          >
            <span className="text-2xl md:text-3xl leading-none">L</span>
            <span className="text-[10px] md:text-xs opacity-75 font-mono mt-1 font-semibold">[A / ←]</span>
          </button>
          <button
            onPointerDown={() => takeStep("R")}
            className="w-20 h-20 md:w-28 md:h-28 bg-[#543310] hover:bg-[#6c4217] active:bg-[#3d240b] text-white rounded-2xl md:rounded-3xl shadow-2xl active:scale-95 transition-all border-b-4 md:border-b-8 border-black font-black flex flex-col items-center justify-center cursor-pointer select-none"
            aria-label="Langkah Kanan"
          >
            <span className="text-2xl md:text-3xl leading-none">R</span>
            <span className="text-[10px] md:text-xs opacity-75 font-mono mt-1 font-semibold">[D / →]</span>
          </button>
        </div>

        {/* Modal Info Panduan jika user klik tombol Info */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#F8F4E1] p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl border-4 border-white text-[#543310]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl md:text-2xl font-black flex items-center gap-2">
                    <Info size={22} className="text-[#543310]" /> Cara Bermain & Kontrol
                  </h3>
                  <button 
                    onClick={() => setShowInfo(false)}
                    className="p-1 rounded-full hover:bg-black/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-[#71421e]">
                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#543310]/15">
                    <p className="font-bold text-[#543310] mb-1 flex items-center gap-1.5">
                      <Keyboard size={16} /> Kontrol Keyboard:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><span className="font-bold">Kaki Kiri:</span> Tombol <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono text-black">A</kbd> atau <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono text-black">←</kbd></li>
                      <li><span className="font-bold">Kaki Kanan:</span> Tombol <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono text-black">D</kbd> atau <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono text-black">→</kbd></li>
                    </ul>
                  </div>

                  <div className="bg-amber-100/70 p-3.5 rounded-xl border border-amber-300">
                    <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <AlertTriangle size={16} /> Perhatian (Anti-Spam):
                    </p>
                    <p>
                      Jangan menekan tombol terlalu cepat secara acak (spamming)! Melangkah dengan egrang memerlukan ritme dan keseimbangan stabil. Jika di-spam atau melangkah dengan kaki yang sama, kamu akan tersandung dan terjatuh.
                    </p>
                  </div>

                  <div className="bg-[#4D7C0F]/10 p-3.5 rounded-xl border border-[#4D7C0F]/20">
                    <p className="font-bold text-[#4D7C0F] mb-1">Filosofi Egrang:</p>
                    <p>
                      Egrang melatih ketangkasan fisik, keseimbangan, serta mengajarkan kesabaran dalam menjaga keselarasan gerak langkah hidup.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full mt-5 py-3 bg-[#543310] text-white rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                >
                  Tutup Panduan
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay Menang/Kalah/Awal Game */}
        <AnimatePresence>
          {(gameState === "idle" || gameState === "lost" || gameState === "won") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#F8F4E1] p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] text-center border-4 md:border-8 border-white border-double overflow-y-auto max-h-[92vh]"
              >
                {gameState === "won" ? (
                  <>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Trophy size={isMobile ? 32 : 42} className="text-white" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#543310] mb-2">Hebat Sekali!</h2>
                    <p className="text-base md:text-xl font-bold text-[#71421e] mb-3">
                      Kamu berhasil bertahan dan mencapai {distance} langkah!
                    </p>
                    <div className="bg-[#4D7C0F]/10 p-4 md:p-5 rounded-2xl md:rounded-3xl mb-5 text-left border-2 border-[#4D7C0F]/20">
                      <h3 className="text-base md:text-lg font-black text-[#4D7C0F] mb-1.5 flex items-center gap-2">
                        <Info size={18} /> Mengenal Egrang
                      </h3>
                      <p className="text-xs md:text-sm text-[#543310] leading-relaxed">
                        Egrang adalah permainan tradisional yang melatih keseimbangan, keberanian, dan koordinasi motorik. Bambu yang digunakan melambangkan kemandirian dan kekuatan pijakan hidup.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-amber-100">
                      {gameState === "lost" ? (
                        <AlertTriangle size={36} className="text-red-600" />
                      ) : (
                        <Footprints size={36} className="text-[#543310]" />
                      )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#543310] mb-2">
                      {gameState === "lost" ? "Yah, Terjatuh!" : "Siap Berjalan?"}
                    </h2>
                    <p className="text-sm md:text-base text-[#71421e] mb-5 font-medium leading-relaxed">
                      {gameState === "lost" 
                        ? `Kamu terjatuh terlalu sering. Jaga irama langkah dan hindari menekan tombol terlalu cepat secara acak!` 
                        : "Gunakan tombol keyboard [A / D] atau [← / →] secara bergantian. Jaga irama dan jangan biarkan indikator keseimbangan keluar dari jalur!"}
                    </p>
                  </>
                )}

                {/* Tombol Utama (Mulai / Ulangi) */}
                <button 
                  onClick={startGame}
                  className="w-full py-4 md:py-5 bg-[#543310] hover:bg-[#6c4217] text-white rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl active:scale-95 transition-all shadow-[0_10px_30px_rgba(84,51,16,0.3)] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <RotateCcw size={isMobile ? 20 : 24} />
                  {gameState === "won" ? "Main Lagi" : (gameState === "lost" ? "Ulangi Permainan" : "Mulai Game")}
                </button>
                
                {/* Tombol Navigasi Kembali & Halaman Utama yang jelas di semua state overlay */}
                <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                  <Link 
                    href="/Kalimantan" 
                    className="flex-1 py-3 px-4 bg-white/80 hover:bg-white text-[#543310] rounded-xl md:rounded-2xl font-bold text-xs md:text-sm border border-[#543310]/20 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    Kembali ke Kalimantan
                  </Link>
                  <Link 
                    href="/" 
                    className="flex-1 py-3 px-4 bg-[#543310]/10 hover:bg-[#543310]/20 text-[#543310] rounded-xl md:rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Home size={16} />
                    Halaman Utama
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          canvas {
            touch-action: none;
          }
        `}</style>
      </main>
    </>
  );
}