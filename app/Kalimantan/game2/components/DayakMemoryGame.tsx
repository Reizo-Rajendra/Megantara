"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

interface DayakSymbol {
  id: string;
  name: string;
  meaning: string;
  color: string;
  frequency: number; // audio feedback
}

const SYMBOLS: DayakSymbol[] = [
  {
    id: "manukan",
    name: "Burung Enggang",
    meaning: "Simbol kehormatan dan jiwa pemimpin suku",
    color: "#FFD700",
    frequency: 261.63,
  },
  {
    id: "sapundu",
    name: "Sapundu Ritual",
    meaning: "Tiang kayu sakral penghubung dunia manusia dan roh",
    color: "#BC8F8F",
    frequency: 329.63,
  },
  {
    id: "orangorangan",
    name: "Patung Penjaga",
    meaning: "Penjaga batas desa dari energi negatif",
    color: "#A0522D",
    frequency: 392.0,
  },
  {
    id: "asmi",
    name: "Ukiran Asmi",
    meaning: "Keseimbangan hubungan manusia dengan pencipta",
    color: "#CD853F",
    frequency: 523.25,
  },
];

const LEVEL_CONFIG = [
  { level: 1, sequenceLength: 3 },
  { level: 2, sequenceLength: 4 },
  { level: 3, sequenceLength: 5 },
  { level: 4, sequenceLength: 6 },
  { level: 5, sequenceLength: 7 },
];

const GAME_DURATION = 75;

type GameStatus =
  | "IDLE"
  | "MEMORIZING"
  | "PLAYING"
  | "LEVEL_TRANSITION"
  | "GAME_OVER"
  | "WIN";

function SymbolArt({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      {id === "manukan" && (
        <>
          <path d="M22 56c0-14 11-25 25-25 6 0 11 2 15 5l14-3-8 9c3 3 5 7 5 12 0 4-2 8-5 11" />
          <path d="M40 31c3-7 8-11 15-11-1 7-4 12-9 15" />
          <path d="M25 58c-8 2-13 7-15 14 8 1 15-1 20-5" />
          <path d="M55 65l-4 18M63 62l6 20" />
          <circle cx="58" cy="47" r="2.5" fill="currentColor" stroke="none" />
          <path d="M62 55l10-2" />
        </>
      )}

      {id === "sapundu" && (
        <>
          <path d="M50 8v84" />
          <path d="M30 20l20-10 20 10-20 10z" />
          <path d="M32 42l18-9 18 9-18 9z" />
          <path d="M32 64l18-9 18 9-18 9z" />
          <path d="M35 84h30" />
          <path d="M42 28h16M42 50h16M42 72h16" />
        </>
      )}

      {id === "orangorangan" && (
        <>
          <circle cx="50" cy="22" r="9" />
          <path d="M50 31v12M32 43h36l-5 12H37z" />
          <path d="M37 55l-6 30M63 55l6 30" />
          <path d="M28 43L18 28M72 43l10-15" />
          <path d="M18 22v12M82 22v12" />
          <path d="M42 67h16" />
        </>
      )}

      {id === "asmi" && (
        <>
          <path d="M50 12c10 0 18 8 18 18 0 8-5 14-12 17 7 3 12 9 12 17 0 10-8 18-18 18" />
          <path d="M50 12c-10 0-18 8-18 18 0 8 5 14 12 17-7 3-12 9-12 17 0 10 8 18 18 18" />
          <path d="M50 30v40" />
          <circle cx="50" cy="50" r="6" />
          <path d="M38 38l-8-8M62 38l8-8M38 62l-8 8M62 62l8 8" />
        </>
      )}
    </svg>
  );
}

export default function DayakMemoryGame() {
  const router = useRouter();

  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);

  const audioCtx = useRef<AudioContext | null>(null);
  const timeLeftRef = useRef(GAME_DURATION);

  // Audio pertama
  const initAudio = useCallback(() => {
    if (!audioCtx.current) {
      const AudioCtor =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      audioCtx.current = new AudioCtor();
    }
    if (audioCtx.current.state === "suspended") {
      void audioCtx.current.resume();
    }
  }, []);

  const playTone = useCallback((freq: number) => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  // Tutup AudioContext saat komponen dilepas.
  useEffect(() => {
    return () => {
      const ctx = audioCtx.current;
      if (ctx && ctx.state !== "closed") void ctx.close();
      audioCtx.current = null;
    };
  }, []);

  const generateSequence = (lvl: number) => {
    const config = LEVEL_CONFIG[lvl - 1];
    const newSeq = Array.from({ length: config.sequenceLength }, () => {
      return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
    });
    setSequence(newSeq);
  };

  const startGame = () => {
    initAudio();
    setStatus("MEMORIZING");
    setLevel(1);
    timeLeftRef.current = GAME_DURATION;
    setTimeLeft(GAME_DURATION);
    setMistakes(0);
    setScore(0);
    setPlayerSequence([]);
    generateSequence(1);
  };

  // Putar urutan simbol
  useEffect(() => {
    if (status !== "MEMORIZING" || sequence.length === 0) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const interval = setInterval(() => {
      const symbolId = sequence[i];
      const symbol = SYMBOLS.find((s) => s.id === symbolId);

      setActiveSymbol(symbolId);
      if (symbol) playTone(symbol.frequency);

      timeouts.push(setTimeout(() => setActiveSymbol(null), 600));

      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        timeouts.push(setTimeout(() => setStatus("PLAYING"), 800));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      setActiveSymbol(null);
    };
  }, [status, sequence, playTone]);

  // Timer global
  useEffect(() => {
    if (status !== "MEMORIZING" && status !== "PLAYING") return;

    const timer = setInterval(() => {
      timeLeftRef.current = Math.max(0, timeLeftRef.current - 1);
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current === 0) {
        setStatus("GAME_OVER");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleSymbolClick = (id: string) => {
    if (status !== "PLAYING") return;

    initAudio();
    const symbol = SYMBOLS.find((s) => s.id === id);
    if (symbol) playTone(symbol.frequency);

    const nextIndex = playerSequence.length;
    if (sequence[nextIndex] === id) {
      const newPlayerSeq = [...playerSequence, id];
      setPlayerSequence(newPlayerSeq);

      if (newPlayerSeq.length === sequence.length) {
        setMistakes(0);
        setScore((prev) => prev + level * 100);
        if (level === 5) {
          setStatus("WIN");
        } else {
          setStatus("LEVEL_TRANSITION");
        }
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setPlayerSequence([]);

      if (newMistakes >= 3) {
        setStatus("GAME_OVER");
      } else {
        setStatus("MEMORIZING");
      }
    }
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setPlayerSequence([]);
    generateSequence(nextLvl);
    setStatus("MEMORIZING");
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground">
      <div className="mb-4 flex w-full max-w-md items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/Kalimantan")}
          className="flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Memori Totem
        </span>
      </div>

      {/* HUD */}
      <div className="w-full max-w-md rounded-2xl border border-accent/20 bg-secondary/20 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Level
            </span>
            <span className="font-serif text-3xl font-bold">{level}/5</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Waktu
            </span>
            <span
              className={`font-mono text-3xl font-bold ${
                timeLeft < 10 ? "text-red-500" : ""
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
          />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 border-accent ${
                i < 3 - mistakes ? "bg-accent/80" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progres urutan pemain */}
      {status === "PLAYING" && sequence.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          {sequence.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 rounded-full transition-all duration-200 ${
                index < playerSequence.length
                  ? "w-6 bg-accent"
                  : "w-2.5 bg-primary/20"
              }`}
            />
          ))}
        </div>
      )}

      {/* Grid simbol */}
      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-4 sm:gap-6">
        {SYMBOLS.map((symbol) => (
          <SymbolButton
            key={symbol.id}
            symbol={symbol}
            isActive={activeSymbol === symbol.id}
            disabled={status !== "PLAYING"}
            onClick={() => handleSymbolClick(symbol.id)}
          />
        ))}
      </div>

      {/* Narasi */}
      {status === "PLAYING" && (
        <p
          className="mt-8 text-center font-medium italic text-accent"
          role="status"
        >
          Ulangi alunan urutan totem...
        </p>
      )}

      {/* Overlay */}
      {status === "IDLE" && (
        <Overlay
          title="Patung Dayak"
          subtitle="Asah ingatanmu dengan kebijaksanaan leluhur Dayak."
          onBack={() => router.push("/Kalimantan")}
        >
          <button
            type="button"
            onClick={startGame}
            className="rounded-full bg-primary px-8 py-3 font-bold text-background shadow-lg transition-transform hover:scale-105"
          >
            Mulai Ritual
          </button>
        </Overlay>
      )}

      {status === "LEVEL_TRANSITION" && (
        <Overlay
          title={`Level ${level} Selesai!`}
          subtitle={
            SYMBOLS.find((s) => sequence[sequence.length - 1] === s.id)?.meaning
          }
          onBack={() => router.push("/Kalimantan")}
        >
          <div className="flex flex-col items-center gap-4">
            <Sparkles className="mb-2 h-12 w-12 text-accent" />
            <button
              type="button"
              onClick={nextLevel}
              className="rounded-full bg-accent px-8 py-3 font-bold text-background transition-transform hover:scale-105"
            >
              Lanjut ke Tantangan Berikutnya
            </button>
          </div>
        </Overlay>
      )}

      {status === "GAME_OVER" && (
        <Overlay
          title="Ritual Terhenti"
          subtitle="Ingatanmu memudar, namun leluhur selalu memberi kesempatan kedua."
          onBack={() => router.push("/Kalimantan")}
        >
          <button
            type="button"
            onClick={startGame}
            className="rounded-full bg-red-800 px-8 py-3 font-bold text-white transition-transform hover:scale-105"
          >
            Coba Lagi
          </button>
        </Overlay>
      )}

      {status === "WIN" && (
        <Overlay
          title="Penjaga Tradisi"
          subtitle={`Luar biasa! Kamu telah menguasai seluruh urutan totem dalam ${
            GAME_DURATION - timeLeft
          } detik.`}
          onBack={() => router.push("/Kalimantan")}
        >
          <div className="text-center">
            <p className="mb-6 text-accent">
              Skor Akhir: {score + timeLeft * 10}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-primary px-8 py-3 font-bold text-background transition-transform hover:scale-105"
            >
              Main Lagi
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function SymbolButton({
  symbol,
  isActive,
  disabled,
  onClick,
}: {
  symbol: DayakSymbol;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${symbol.name}: ${symbol.meaning}`}
      className={`relative aspect-square overflow-hidden rounded-3xl border-4 p-3 transition-all duration-150 disabled:cursor-not-allowed ${
        isActive ? "scale-[1.04] border-white" : "border-transparent"
      }`}
      style={{
        backgroundColor: isActive ? symbol.color : `${symbol.color}18`,
        borderColor: isActive ? "#ffffff" : `${symbol.color}45`,
        color: isActive ? "#ffffff" : symbol.color,
        boxShadow: isActive
          ? `0 0 40px ${symbol.color}`
          : "0 8px 20px rgba(15, 44, 89, 0.08)",
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center p-5">
        <SymbolArt id={symbol.id} />
      </span>

      <span
        className={`absolute inset-x-2 bottom-2 z-10 rounded-full px-2 py-0.5 text-center text-[10px] font-bold uppercase tracking-tighter ${
          isActive ? "bg-black/35 text-white" : "bg-black/25 text-white"
        }`}
      >
        {symbol.name}
      </span>
    </button>
  );
}

function Overlay({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 text-center backdrop-blur-lg">
      <div className="w-full max-w-md rounded-3xl border border-accent/20 bg-white/90 p-8 shadow-2xl md:p-10">
        <h2 className="mb-2 font-serif text-4xl font-bold leading-tight text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="mb-8 italic leading-relaxed text-secondary">
            {subtitle}
          </p>
        )}
        {children}

        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-primary/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Kalimantan
        </button>
      </div>
    </div>
  );
}
