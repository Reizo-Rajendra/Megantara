import React from "react";
import { Heart } from "lucide-react";
import { KEYS, KEY_LABELS } from "../constants";

const LANE_COLOR_STYLES = [
  { border: "border-red-500/60", bgActive: "bg-red-500 text-white", text: "text-red-400" },
  { border: "border-amber-500/60", bgActive: "bg-amber-500 text-slate-950", text: "text-amber-400" },
  { border: "border-emerald-500/60", bgActive: "bg-emerald-500 text-white", text: "text-emerald-400" },
  { border: "border-cyan-500/60", bgActive: "bg-cyan-500 text-slate-950", text: "text-cyan-400" },
  { border: "border-purple-500/60", bgActive: "bg-purple-500 text-white", text: "text-purple-400" },
];

export const GameHUD = ({
  score,
  combo,
  life,
  feedback,
  activeKeys,
  countdown,
  onKeyInput,
  onKeyRelease,
  hidden,
}: {
  score: number;
  combo: number;
  life: number;
  feedback: { text: string; color: string; id: number } | null;
  activeKeys: boolean[];
  countdown?: number | string | null;
  onKeyInput: (index: number) => void;
  onKeyRelease: (index: number) => void;
  hidden: boolean;
}) => (
  <div
    className={`absolute inset-0 pointer-events-none ${hidden ? "hidden" : ""}`}
    style={{ zIndex: 40 }}
  >
    {/* Countdown & Readiness Banner */}
    {countdown !== null && countdown !== undefined && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-50 pointer-events-none">
        <div className="text-7xl md:text-9xl font-black text-[#f59e0b] font-serif drop-shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce mb-4">
          {countdown}
        </div>
        <p className="text-white text-sm md:text-base font-bold tracking-wider px-6 py-2 rounded-full bg-[#0F2C59]/80 border border-white/20 text-center max-w-md shadow-xl">
          Tekan tombol [A] [S] [D] [F] [G] atau sentuh bilah saat not menyentuh garis emas!
        </p>
      </div>
    )}

    {/* Top Header */}
    <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
      {/* Score */}
      <div className="flex flex-col">
        <div className="text-[10px] md:text-xs text-[#d4af37] uppercase tracking-[0.2em] font-bold">
          Skor
        </div>
        <div className="text-2xl md:text-4xl font-serif text-white font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]">
          {score}
        </div>
      </div>

      {/* Combo */}
      <div className="flex flex-col items-center mt-1">
        <div
          className={`text-4xl md:text-6xl font-bold text-[#ffd700] transition-all duration-100 ${combo > 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"} drop-shadow-md`}
        >
          {combo}
        </div>
        <div
          className={`text-[10px] md:text-xs font-bold text-white uppercase tracking-widest transition-opacity duration-100 ${combo > 0 ? "opacity-100" : "opacity-0"}`}
        >
          Combo
        </div>
      </div>

      {/* Life */}
      <div className="flex flex-col items-end">
        <div className="text-[10px] md:text-xs text-[#d4af37] uppercase tracking-[0.2em] mb-1 font-bold">
          Nyawa
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-500/40 shadow-md">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-sm font-bold text-white font-mono">{life}</span>
          <span className="text-xs text-white/50">/ 8</span>
        </div>
      </div>
    </div>

    {/* Feedback Text (Sempurna / Bagus / Miss) */}
    {feedback && (
      <div
        key={feedback.id}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-serif font-black italic drop-shadow-2xl animate-ping-once ${feedback.color} z-50 pointer-events-none`}
        onAnimationEnd={(e) => (e.currentTarget.style.display = "none")}
      >
        {feedback.text}
      </div>
    )}

    {/* Key Hints & Touch Controls - Sized generously for all laptop viewports */}
    <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2.5 sm:gap-4 md:gap-6 pointer-events-auto items-end">
      {KEYS.map((k, i) => {
        const style = LANE_COLOR_STYLES[i];
        const isActive = activeKeys[i];
        return (
          <div
            key={k}
            onMouseDown={() => onKeyInput(i)}
            onMouseUp={() => onKeyRelease(i)}
            onMouseLeave={() => onKeyRelease(i)}
            onTouchStart={(e) => {
              e.preventDefault();
              onKeyInput(i);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onKeyRelease(i);
            }}
            className={`
              border-2 rounded-2xl w-[68px] h-[72px] sm:w-[84px] sm:h-[88px] md:w-[98px] md:h-[102px] flex flex-col items-center justify-center font-bold font-mono cursor-pointer transition-all duration-100 shadow-2xl touch-manipulation select-none
              ${
                isActive
                  ? `${style.bgActive} scale-105 -translate-y-1.5 shadow-2xl ring-4 ring-white/90`
                  : `${style.border} ${style.text} bg-[#071324]/90 hover:bg-[#0F2C59]/90 hover:-translate-y-0.5`
              }
            `}
          >
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider uppercase">{k}</span>
            <span className="text-[10px] sm:text-xs font-sans font-bold opacity-90 mt-0.5">{KEY_LABELS[i]}</span>
          </div>
        );
      })}
    </div>

    <div className="absolute bottom-1.5 inset-x-0 text-center text-xs text-sky-200/80 font-medium">
      Gunakan keyboard <span className="font-bold text-amber-300">[A] [S] [D] [F] [G]</span> atau sentuh bilah di atas saat not menyentuh garis emas
    </div>
  </div>
);
