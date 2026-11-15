"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChefHat, Flame, RotateCcw } from "lucide-react";

type IngredientId = "santan" | "rempah" | "daging";
type Phase = "adding" | "stirring" | "done" | "burned";

interface Ingredient {
  id: IngredientId;
  name: string;
  emoji: string;
  hint: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: "santan", name: "Santan", emoji: "🥥", hint: "Kelapa parut" },
  { id: "rempah", name: "Rempah", emoji: "🌿", hint: "Bumbu tradisional" },
  { id: "daging", name: "Daging", emoji: "🥩", hint: "Potongan daging" },
];

const ORDER: IngredientId[] = ["santan", "rempah", "daging"];

const MEAT_POSITIONS = [
  { left: 28, top: 36 },
  { left: 56, top: 28 },
  { left: 66, top: 56 },
  { left: 38, top: 62 },
  { left: 47, top: 47 },
];

const STEAM_POSITIONS = [
  { left: 28, top: 24, delay: "0s" },
  { left: 48, top: 14, delay: "0.5s" },
  { left: 68, top: 26, delay: "1s" },
];

function ingredientName(id: IngredientId) {
  return INGREDIENTS.find((item) => item.id === id)?.name ?? id;
}

export default function RendangGame() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("adding");
  const [progress, setProgress] = useState(0);
  const [burn, setBurn] = useState(0);
  const [added, setAdded] = useState<IngredientId[]>([]);
  const [instruction, setInstruction] = useState(
    "Tarik atau klik <b>Santan</b> ke dalam kuali!",
  );
  const [dragging, setDragging] = useState<{
    id: IngredientId;
    x: number;
    y: number;
  } | null>(null);
  const [wrongId, setWrongId] = useState<IngredientId | null>(null);
  const [pouring, setPouring] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showBurnedModal, setShowBurnedModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const stepRef = useRef(0);
  const phaseRef = useRef<Phase>("adding");
  const progressRef = useRef(0);
  const burnRef = useRef(0);
  const lastStirRef = useRef(0);
  const stirHeldRef = useRef(false);
  const wokRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    id: IngredientId;
  } | null>(null);
  const movedRef = useRef(false);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mixColor = useMemo(() => {
    if (added.includes("daging")) return "#5a2a16";
    if (added.includes("rempah")) return "#c79a62";
    if (added.includes("santan")) return "#f1e6cf";
    return "#3a2a1f";
  }, [added]);

  const addIngredient = useCallback((id: IngredientId) => {
    if (phaseRef.current !== "adding") return;

    if (id !== ORDER[stepRef.current]) {
      setWrongId(id);
      setInstruction(
        `Ikuti urutannya dulu: masukkan <b>${ingredientName(
          ORDER[stepRef.current],
        )}</b>.`,
      );
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
      wrongTimeoutRef.current = setTimeout(() => setWrongId(null), 600);
      return;
    }

    setAdded((prev) => [...prev, id]);
    setWrongId(null);

    const next = stepRef.current + 1;
    stepRef.current = next;
    setStepIndex(next);

    if (next < ORDER.length) {
      setInstruction(
        `Lanjut! Masukkan <b>${ingredientName(ORDER[next])}</b>.`,
      );
    } else {
      phaseRef.current = "stirring";
      setPhase("stirring");
      lastStirRef.current = Date.now();
      setInstruction("Bagus! Sekarang <b>ADUK</b> sampai asat!");
    }
  }, []);

  // Simulasi mengaduk + tingkat gosong.
  useEffect(() => {
    if (phase !== "stirring") return;

    const timer = setInterval(() => {
      const now = Date.now();

      if (stirHeldRef.current) {
        lastStirRef.current = now;
        progressRef.current = Math.min(100, progressRef.current + 1.25);
        burnRef.current = Math.max(0, burnRef.current - 3);
      } else if (now - lastStirRef.current > 1800) {
        burnRef.current = Math.min(100, burnRef.current + 1.4);
      } else {
        burnRef.current = Math.max(0, burnRef.current - 0.8);
      }

      setProgress(progressRef.current);
      setBurn(burnRef.current);

      if (burnRef.current >= 100) {
        phaseRef.current = "burned";
        setPhase("burned");
        setShowBurnedModal(true);
      } else if (progressRef.current >= 100) {
        phaseRef.current = "done";
        setPhase("done");
        setPouring(true);
        if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = setTimeout(() => {
          setPouring(false);
          setShowFinishModal(true);
        }, 1400);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    };
  }, []);

  const resetGame = useCallback(() => {
    stepRef.current = 0;
    phaseRef.current = "adding";
    progressRef.current = 0;
    burnRef.current = 0;
    lastStirRef.current = Date.now();
    stirHeldRef.current = false;
    dragStartRef.current = null;
    movedRef.current = false;

    setStepIndex(0);
    setPhase("adding");
    setProgress(0);
    setBurn(0);
    setAdded([]);
    setInstruction("Tarik atau klik <b>Santan</b> ke dalam kuali!");
    setDragging(null);
    setWrongId(null);
    setPouring(false);
    setShowFinishModal(false);
    setShowBurnedModal(false);
    setShowDetails(false);

    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
  }, []);

  const handleIngredientPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    id: IngredientId,
  ) => {
    if (phaseRef.current !== "adding") return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, y: event.clientY, id };
    movedRef.current = false;
    setDragging({ id, x: event.clientX, y: event.clientY });
  };

  const handleIngredientPointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const start = dragStartRef.current;
    if (!start) return;

    if (
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8
    ) {
      movedRef.current = true;
    }

    setDragging({ id: start.id, x: event.clientX, y: event.clientY });
  };

  const handleIngredientPointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const start = dragStartRef.current;
    if (!start) return;

    dragStartRef.current = null;
    setDragging(null);

    // Tap / klik tanpa geser tetap bisa memasukkan bahan.
    if (!movedRef.current) {
      addIngredient(start.id);
      return;
    }

    const wok = wokRef.current;
    if (wok) {
      const rect = wok.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.54;

      if (
        Math.hypot(event.clientX - centerX, event.clientY - centerY) <=
        radius
      ) {
        addIngredient(start.id);
        return;
      }
    }

    if (phaseRef.current === "adding") {
      setInstruction(
        `Tarik atau klik <b>${ingredientName(
          ORDER[stepRef.current],
        )}</b> ke dalam kuali!`,
      );
    }
  };

  const cancelDrag = () => {
    dragStartRef.current = null;
    setDragging(null);
  };

  const startStir = () => {
    if (phaseRef.current !== "stirring") return;
    stirHeldRef.current = true;
    lastStirRef.current = Date.now();
  };

  const stopStir = () => {
    stirHeldRef.current = false;
  };

  const currentIngredient = ORDER[stepIndex];
  const isStirring = phase === "stirring";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1d1009] font-sans text-white">
      <style>{`
        @keyframes rendang-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes rendang-flame {
          0% { transform: scaleY(0.8) translateY(2px); opacity: 0.75; }
          100% { transform: scaleY(1.15) translateY(-3px); opacity: 1; }
        }
        @keyframes rendang-steam {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          25% { opacity: 0.45; }
          100% { transform: translateY(-70px) scale(1.5); opacity: 0; }
        }
        @keyframes rendang-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Latar dapur hangat */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(234,88,12,0.18),transparent_55%),radial-gradient(circle_at_82%_82%,rgba(217,119,6,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <header className="relative z-30 flex items-center justify-between gap-3 px-4 py-4 md:px-8">
        <button
          type="button"
          onClick={() => router.push("/Sumatera")}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <ChefHat className="h-5 w-5 shrink-0 text-yellow-400" />
          <h1 className="truncate text-base font-black tracking-tight text-yellow-400 md:text-2xl">
            Dapur Tradisi Minang
          </h1>
        </div>

        <div className="hidden items-center gap-2 text-xs font-semibold text-white/50 md:flex">
          <Flame className="h-4 w-4 text-orange-400" />
          Rendang
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 md:flex-row md:items-start md:justify-center md:gap-8 md:px-8">
        {/* Panel langkah & instruksi */}
        <section className="w-full rounded-3xl border border-yellow-500/20 bg-[#3a2114]/85 p-4 backdrop-blur md:sticky md:top-6 md:w-72 md:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/80">
            Langkah Memasak
          </p>

          <div className="mt-3 space-y-2">
            {INGREDIENTS.map((ingredient, index) => {
              const isDone = added.includes(ingredient.id);
              const isCurrent =
                phase === "adding" && currentIngredient === ingredient.id;

              return (
                <div
                  key={ingredient.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-200 ${
                    isDone
                      ? "border-emerald-500/30 bg-emerald-500/10 opacity-70"
                      : isCurrent
                        ? "border-yellow-400/60 bg-yellow-500/10"
                        : "border-white/10 bg-white/5 opacity-60"
                  }`}
                >
                  <span className="text-xl">{ingredient.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold capitalize">
                      {ingredient.name}
                    </p>
                    <p className="text-[10px] text-white/45">
                      {ingredient.hint}
                    </p>
                  </div>
                  {isDone ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-white/30">
                      0{index + 1}
                    </span>
                  )}
                </div>
              );
            })}

            <div
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-200 ${
                isStirring || phase === "done"
                  ? "border-yellow-400/60 bg-yellow-500/10"
                  : "border-white/10 bg-white/5 opacity-60"
              }`}
            >
              <span className="text-xl">🥄</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">Aduk</p>
                <p className="text-[10px] text-white/45">Hingga asat</p>
              </div>
              {phase === "done" && (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/25 p-3">
            <p
              className="text-sm leading-relaxed text-white/85"
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          </div>

          {(isStirring || phase === "done") && (
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/50">
                  <span>Kematangan</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-[width] duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/50">
                  <span>Gosong</span>
                  <span>{Math.round(burn)}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-[width] duration-100"
                    style={{ width: `${burn}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {isStirring && (
            <p className="mt-3 animate-pulse text-center text-xs font-bold text-yellow-300">
              Tahan & gerakkan di kuali untuk mengaduk!
            </p>
          )}
        </section>

        {/* Panggung kuali */}
        <section className="flex flex-1 flex-col items-center justify-center py-2">
          <div className="relative w-full max-w-[380px]">
            {/* Api */}
            <div className="pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-1.5">
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className="h-10 w-4 origin-bottom rounded-full bg-gradient-to-t from-orange-700 via-orange-500 to-yellow-300 blur-[0.3px]"
                  style={{
                    animation: `rendang-flame ${
                      0.45 + index * 0.07
                    }s ease-in-out infinite alternate`,
                    animationDelay: `${index * 0.08}s`,
                  }}
                />
              ))}
            </div>

            {/* Kuali */}
            <div
              ref={wokRef}
              className="relative aspect-square w-full rounded-full"
              style={{
                transform: pouring ? "rotate(-18deg) translateY(-6px)" : undefined,
                transition: "transform 0.8s ease",
              }}
            >
              {/* Badan kuali */}
              <div className="absolute inset-0 rounded-full border-[10px] border-[#1a1a1a] bg-gradient-to-b from-[#4a4a4a] via-[#262626] to-[#0a0a0a] shadow-[inset_0_20px_60px_rgba(0,0,0,0.9),0_24px_50px_rgba(0,0,0,0.55)]" />
              <div className="absolute inset-[8%] rounded-full bg-gradient-to-b from-[#141414] to-[#2a2a2a] shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)]" />

              {/* Isi rendang */}
              <div
                className="absolute inset-[16%] overflow-hidden rounded-full transition-colors duration-700"
                style={{
                  backgroundColor: mixColor,
                  opacity: added.length > 0 ? 1 : 0.35,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: `rgba(20, 6, 0, ${Math.min(
                      0.78,
                      progress / 160,
                    )})`,
                  }}
                />

                {added.includes("daging") &&
                  MEAT_POSITIONS.map((position, index) => (
                    <span
                      key={index}
                      className="absolute h-4 w-4 rounded-full bg-[#4a1f10] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.6)]"
                      style={{
                        left: `${position.left}%`,
                        top: `${position.top}%`,
                      }}
                    />
                  ))}

                {isStirring && (
                  <div
                    className="absolute inset-[6%] rounded-full border-4 border-dashed border-white/20"
                    style={{ animation: "rendang-spin 3s linear infinite" }}
                  />
                )}
              </div>

              {/* Uap */}
              {added.length > 0 && (
                <div className="pointer-events-none absolute inset-[12%]">
                  {STEAM_POSITIONS.map((position, index) => (
                    <span
                      key={index}
                      className="absolute h-8 w-8 rounded-full bg-white/25 blur-md"
                      style={{
                        left: `${position.left}%`,
                        top: `${position.top}%`,
                        animation: "rendang-steam 2.4s ease-out infinite",
                        animationDelay: position.delay,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Pegangan kuali */}
              <div className="absolute -left-8 top-1/2 h-5 w-10 -translate-y-1/2 rounded-l-full bg-[#2a2a2a] shadow-lg" />
              <div className="absolute -right-8 top-1/2 h-5 w-10 -translate-y-1/2 rounded-r-full bg-[#2a2a2a] shadow-lg" />

              {/* Area mengaduk */}
              {isStirring && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Tahan untuk mengaduk rendang"
                  className="absolute inset-[14%] z-20 cursor-grab touch-none rounded-full outline-none ring-yellow-300/60 focus-visible:ring-4 active:cursor-grabbing"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    startStir();
                  }}
                  onPointerUp={stopStir}
                  onPointerCancel={stopStir}
                  onPointerLeave={stopStir}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      startStir();
                    }
                  }}
                  onKeyUp={stopStir}
                  onBlur={stopStir}
                />
              )}
            </div>
          </div>

          <p className="mt-7 max-w-sm text-center text-xs leading-relaxed text-white/50">
            {phase === "adding"
              ? "Tarik kartu bahan ke kuali, atau klik kartunya langsung."
              : phase === "stirring"
                ? "Jangan berhenti mengaduk agar rendang tidak gosong."
                : phase === "done"
                  ? "Rendang siap disajikan!"
                  : "Rendang gosong. Coba lagi!"}
          </p>
        </section>

        {/* Kartu bahan */}
        <section className="w-full md:w-56 md:shrink-0">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/80">
            Bahan-bahan
          </p>

          <div className="flex gap-3 md:flex-col">
            {INGREDIENTS.map((ingredient) => {
              const isDone = added.includes(ingredient.id);
              const isCurrent =
                phase === "adding" && currentIngredient === ingredient.id;
              const isWrong = wrongId === ingredient.id;

              return (
                <button
                  key={ingredient.id}
                  type="button"
                  disabled={phase !== "adding" || isDone}
                  onPointerDown={(event) =>
                    handleIngredientPointerDown(event, ingredient.id)
                  }
                  onPointerMove={handleIngredientPointerMove}
                  onPointerUp={handleIngredientPointerUp}
                  onPointerCancel={cancelDrag}
                  aria-label={`Masukkan ${ingredient.name}`}
                  className={`group relative flex min-w-0 flex-1 touch-none select-none items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200 md:w-full md:flex-none ${
                    isDone
                      ? "border-emerald-500/30 bg-emerald-500/10 opacity-50"
                      : isCurrent
                        ? "border-yellow-400/70 bg-yellow-500/15 shadow-[0_0_28px_rgba(234,179,8,0.22)] hover:bg-yellow-500/20"
                        : "border-white/10 bg-white/5 opacity-70 hover:opacity-100"
                  } ${isWrong ? "border-red-500" : ""}`}
                  style={{
                    animation: isWrong
                      ? "rendang-shake 0.4s ease-in-out"
                      : undefined,
                  }}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-200 ${
                      isCurrent ? "scale-110 bg-black/20" : "bg-black/20"
                    }`}
                  >
                    {ingredient.emoji}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {ingredient.name}
                    </span>
                    <span className="hidden text-[10px] text-white/45 md:block">
                      {isDone ? "Sudah dimasukkan" : ingredient.hint}
                    </span>
                  </span>

                  {isDone && (
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bayangan saat drag */}
      {dragging && (
        <div
          className="pointer-events-none fixed z-50 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-yellow-400 bg-[#3a2114]/95 text-3xl shadow-2xl"
          style={{ left: dragging.x, top: dragging.y }}
        >
          {INGREDIENTS.find((item) => item.id === dragging.id)?.emoji}
        </div>
      )}

      {/* Modal selesai */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-yellow-500/30 bg-[#3a2114] p-6 text-white shadow-2xl md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-4xl">🍛</span>
              <div>
                <h2 className="text-3xl font-black text-yellow-400">
                  SELESAI!
                </h2>
                <p className="text-sm text-white/70">
                  Rendang telah tersaji sempurna.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="mb-4 flex w-full items-center justify-between bg-yellow-500/15 px-4 py-2 text-sm font-bold text-yellow-400 transition-colors hover:bg-yellow-500/25"
            >
              <span>
                {showDetails
                  ? "Sembunyikan Detail"
                  : "Lihat Sejarah & Filosofi"}
              </span>
              <span>{showDetails ? "▲" : "▼"}</span>
            </button>

            {showDetails && (
              <div className="mb-4 space-y-4 text-left text-xs leading-relaxed text-white/80 md:text-sm">
                <div>
                  <h3 className="mb-2 text-base font-bold text-yellow-400 md:text-lg">
                    Sejarah Rendang
                  </h3>
                  <p>
                    Rendang berasal dari <b>Minangkabau</b>, Sumatera Barat.
                    Masakan ini lahir dari kebutuhan masyarakat Minang untuk
                    membawa bekal yang tahan lama saat merantau.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-base font-bold text-yellow-400 md:text-lg">
                    Filosofi 4 Unsur
                  </h3>
                  <ul className="space-y-1.5 pl-4 md:space-y-2">
                    <li>
                      <b>• Daging:</b> Simbol niniak mamak (pemimpin adat)
                    </li>
                    <li>
                      <b>• Santan:</b> Simbol cadiak pandai (kaum intelektual)
                    </li>
                    <li>
                      <b>• Cabai:</b> Simbol alim ulama (pemuka agama)
                    </li>
                    <li>
                      <b>• Bumbu rempah:</b> Simbol masyarakat Minang
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-base font-bold text-yellow-400 md:text-lg">
                    Pengakuan Dunia
                  </h3>
                  <p>
                    Pada tahun 2011, CNN International memilih rendang sebagai{" "}
                    <b>makanan paling enak di dunia</b>.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetGame}
                className="flex flex-1 items-center justify-center gap-2 bg-yellow-500 px-5 py-3 text-sm font-bold text-orange-950 transition-colors hover:bg-yellow-400"
              >
                <RotateCcw className="h-4 w-4" />
                Masak Lagi
              </button>
              <button
                type="button"
                onClick={() => router.push("/Sumatera")}
                className="flex flex-1 items-center justify-center gap-2 border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Sumatera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal gosong */}
      {showBurnedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#3a2114] p-6 text-center text-white shadow-2xl md:p-8">
            <span className="text-5xl">🔥</span>
            <h2 className="mt-3 text-3xl font-black text-red-400">GOSONG!</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Rendangnya terlalu lama didiamkan. Aduk terus agar tidak gosong.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetGame}
                className="flex flex-1 items-center justify-center gap-2 bg-red-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-400"
              >
                <RotateCcw className="h-4 w-4" />
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => router.push("/Sumatera")}
                className="flex flex-1 items-center justify-center gap-2 border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
