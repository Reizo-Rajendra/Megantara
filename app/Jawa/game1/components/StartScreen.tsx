import React from "react";
import { Sparkles, Music } from "lucide-react";

export const StartScreen = ({
  onStart,
  hidden,
}: {
  onStart: () => void;
  hidden: boolean;
}) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-[#071324]/95 backdrop-blur-md transition-opacity duration-1000 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      style={{ zIndex: 50 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-[#1D4ED8]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-[#0F2C59]/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2563EB]/10 rounded-full blur-3xl animate-[pulse_4s_infinite]" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center transition-all duration-500 max-w-lg px-6 ${hidden ? "scale-90 opacity-0 blur-sm invisible" : "scale-100 opacity-100 blur-0 visible"}`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-200 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Music className="w-4 h-4 text-[#38BDF8]" />
          <span>Megantara • Irama Gamelan Jawa</span>
        </div>

        <div className="animate-[float-wayang_6s_infinite_ease-in-out] mb-2">
          <img
            src="/Jawa/game1/gamelan-logo.png"
            alt="Gamelan Saron Logo"
            width={260}
            height={260}
            className="drop-shadow-[0_0_35px_rgba(37,99,235,0.45)]"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-wide font-serif">
          GAMELAN SARON
        </h1>

        <p className="text-sm md:text-base text-sky-200/80 mb-8 max-w-md font-sans leading-relaxed">
          Pukul bilah saron tepat saat lingkaran not selaras dengan garis emas pembatas.
        </p>

        <button
          onClick={onStart}
          className="cursor-pointer group relative px-10 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl border border-sky-300/30 text-white font-bold text-base md:text-lg tracking-wider uppercase flex items-center gap-3"
        >
          <span>Mulai Bermain</span>
          <span className="text-amber-300 group-hover:translate-x-1 transition-transform">
            ▶
          </span>
        </button>

        <div className="mt-8 space-y-2 font-sans">
          <p className="text-xs uppercase tracking-widest text-sky-200/60 font-mono font-bold">
            Kontrol Keyboard
          </p>
          <div className="flex gap-2 justify-center">
            {["A", "S", "D", "F", "G"].map((key) => (
              <span
                key={key}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white font-bold font-mono text-sm shadow-sm"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
