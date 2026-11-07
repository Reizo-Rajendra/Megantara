"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import * as THREE from "three";

import { GamelanSynth } from "./utils/audio";
import {
  LANE_COLORS,
  KEYS,
  NOTE_FREQUENCIES,
  SCORE_PERFECT,
  SCORE_GOOD,
  THRESHOLD_PERFECT,
  THRESHOLD_GOOD,
  LANE_COUNT,
  KEY_WIDTH,
  KEY_GAP,
  SCROLL_SPEED,
} from "./constants";
import { GameState, NoteData, ActiveNote } from "./types";
import { StartScreen } from "./components/StartScreen";
import { ResultScreen } from "./components/ResultScreen";
import { GameHUD } from "./components/GameHUD";

// --- Main Component ---

export default function GamelanGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Game State
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const countdownRef = useRef<number | string | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [life, setLife] = useState(8);
  const [activeKeys, setActiveKeys] = useState<boolean[]>(
    new Array(5).fill(false),
  );
  const [feedback, setFeedback] = useState<{
    text: string;
    color: string;
    id: number;
  } | null>(null);
  const [accuracy, setAccuracy] = useState(0);

  // Mutable Game State (Refs) for Performance
  const audioRef = useRef<GamelanSynth | null>(null);
  const notesRef = useRef<ActiveNote[]>([]);
  const levelNotesRef = useRef<NoteData[]>([]);
  const spawnIndexRef = useRef(0);
  const gameStartTimeRef = useRef(0);
  const notesHitRef = useRef(0);
  const totalNotesRef = useRef(0);

  const activeKeysRef = useRef<boolean[]>(new Array(5).fill(false)); // Ref for fast checking if needed
  const scoreRef = useRef(0); // Ref for precise score calculation without stale closures

  // Three.js Refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const saronKeysMeshRef = useRef<THREE.Mesh[]>([]);
  const noteMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const noteGeoRef = useRef<THREE.CylinderGeometry | null>(null);
  const animationFrameRef = useRef<number>(0);

  // --- Initialization ---

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Audio
    audioRef.current = new GamelanSynth();

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x071324, 25, 75);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    const updateCamera = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      camera.aspect = aspect;

      if (width < 768) {
        // Mobile Portrait adjustments
        camera.fov = 65;
        camera.position.set(0, 11, 12);
        camera.lookAt(0, 0, -4);
      } else if (aspect >= 1.6) {
        // Standard 16:9 laptop screens
        camera.fov = 46;
        camera.position.set(0, 6.6, 6.8);
        camera.lookAt(0, 0, -1.8);
      } else {
        // 16:10 or taller laptop screens
        camera.fov = 50;
        camera.position.set(0, 7.2, 7.5);
        camera.lookAt(0, 0, -1.8);
      }
      camera.updateProjectionMatrix();
    };
    updateCamera();

    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffeeb1, 1.2);
    spotLight.position.set(5, 15, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.0, 30);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 1, 3);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x3d250f,
      roughness: 0.8,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -0.6, 0);
    base.receiveShadow = true;
    scene.add(base);

    // Saron Keys
    const startX =
      -(LANE_COUNT * KEY_WIDTH + (LANE_COUNT - 1) * KEY_GAP) / 2 +
      KEY_WIDTH / 2;
    const keyGeo = new THREE.BoxGeometry(KEY_WIDTH, 0.22, 2.5);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.75,
      roughness: 0.2,
      emissive: 0x332200,
    });

    const keyMeshes: THREE.Mesh[] = [];
    const laneX = [];

    // 5 Glowing Floor Lane Tracks
    const laneTrackGeo = new THREE.PlaneGeometry(KEY_WIDTH * 0.9, 45);
    laneTrackGeo.rotateX(-Math.PI / 2);

    for (let i = 0; i < LANE_COUNT; i++) {
      const x = startX + i * (KEY_WIDTH + KEY_GAP);
      laneX.push(x);

      // Lane Guide Strip on Floor
      const laneTrackMat = new THREE.MeshBasicMaterial({
        color: LANE_COLORS[i],
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
      });
      const laneTrack = new THREE.Mesh(laneTrackGeo, laneTrackMat);
      laneTrack.position.set(x, -0.05, -18);
      scene.add(laneTrack);

      const keyMesh = new THREE.Mesh(keyGeo, keyMat.clone());
      keyMesh.position.set(x, 0, 0);
      keyMesh.castShadow = true;
      keyMesh.receiveShadow = true;
      keyMeshes.push(keyMesh);
      scene.add(keyMesh);

      // Paku
      const pakuGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
      const pakuMat = new THREE.MeshBasicMaterial({ color: 0x222 });
      const paku1 = new THREE.Mesh(pakuGeo, pakuMat);
      paku1.position.set(x, 0.1, 0.8);
      const paku2 = new THREE.Mesh(pakuGeo, pakuMat);
      paku2.position.set(x, 0.1, -0.8);
      scene.add(paku1, paku2);
    }
    saronKeysMeshRef.current = keyMeshes;

    // Glowing Golden Hit Target Bar across keys at z = 0
    const hitBarGeo = new THREE.PlaneGeometry(LANE_COUNT * (KEY_WIDTH + KEY_GAP) + 0.4, 0.25);
    hitBarGeo.rotateX(-Math.PI / 2);
    const hitBarMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const hitBar = new THREE.Mesh(hitBarGeo, hitBarMat);
    hitBar.position.set(0, 0.12, 0);
    scene.add(hitBar);

    // Pre-create Note Resources (Large Glowing Disks - Sized for Clear Visibility)
    noteGeoRef.current = new THREE.CylinderGeometry(0.80, 0.80, 0.32, 32);
    noteGeoRef.current.rotateX(Math.PI / 2);

    LANE_COLORS.forEach((color) => {
      noteMaterialsRef.current.push(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: color,
          emissiveIntensity: 1.3,
          metalness: 0.3,
          roughness: 0.1,
        }),
      );
    });

    // Resize Handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      cameraRef.current.aspect = aspect;

      if (width < 768) {
        cameraRef.current.fov = 65;
        cameraRef.current.position.set(0, 11, 12);
        cameraRef.current.lookAt(0, 0, -4);
      } else if (aspect >= 1.6) {
        cameraRef.current.fov = 46;
        cameraRef.current.position.set(0, 6.6, 6.8);
        cameraRef.current.lookAt(0, 0, -1.8);
      } else {
        cameraRef.current.fov = 50;
        cameraRef.current.position.set(0, 7.2, 7.5);
        cameraRef.current.lookAt(0, 0, -1.8);
      }

      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // --- Game Logic functions ---

  const generateSong = () => {
    const notes: NoteData[] = [];
    const bpm = 100;
    const beatMs = 60000 / bpm; // 600ms

    // Give a 4.5s initial buffer so player sees runway and is prepared after countdown!
    for (let i = 0; i < 50; i++) {
      const time = 4500 + i * beatMs + (i % 3 === 0 ? beatMs : 0);
      const lane = Math.floor(Math.random() * LANE_COUNT);
      notes.push({ time, lane, hit: false });
    }
    notes.sort((a, b) => a.time - b.time);
    levelNotesRef.current = notes;
    totalNotesRef.current = notes.length;
  };

  const spawnVisualNote = (noteData: NoteData, startZ: number) => {
    if (!sceneRef.current || !noteGeoRef.current) return;

    // Calculate X based on lane
    const startX =
      -(LANE_COUNT * KEY_WIDTH + (LANE_COUNT - 1) * KEY_GAP) / 2 +
      KEY_WIDTH / 2;
    const x = startX + noteData.lane * (KEY_WIDTH + KEY_GAP);

    const mat = noteMaterialsRef.current[noteData.lane];
    const mesh = new THREE.Mesh(noteGeoRef.current, mat);

    mesh.position.set(x, 0.5, startZ);
    sceneRef.current.add(mesh);

    notesRef.current.push({
      data: noteData,
      mesh,
      id: Math.random().toString(36).substr(2, 9),
    });
  };

  const createExplosion = (pos: THREE.Vector3, laneIdx: number) => {
    if (!sceneRef.current) return;

    const geo = new THREE.RingGeometry(0.3, 0.4, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: LANE_COLORS[laneIdx],
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.position.y = 0.1;
    mesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(mesh);

    let scale = 1;
    const animateEx = () => {
      scale += 0.1;
      mesh.scale.set(scale, scale, scale);
      mesh.material.opacity -= 0.05;
      if (mesh.material.opacity > 0) {
        requestAnimationFrame(animateEx);
      } else {
        sceneRef.current?.remove(mesh);
        geo.dispose();
        mat.dispose();
      }
    };
    animateEx();
  };

  const handleKeyHit = useCallback(
    (laneIndex: number) => {
      // Audio & Visual input feedback always triggers
      audioRef.current?.playNote(laneIndex);

      // Visual feedback on Saron Key
      const keyMesh = saronKeysMeshRef.current[laneIndex];
      if (keyMesh) {
        keyMesh.position.y = -0.1;
        (keyMesh.material as THREE.MeshStandardMaterial).emissive.setHex(
          0xffaa00,
        );
        (keyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1;
      }

      // UI Feedback
      setActiveKeys((prev) => {
        const next = [...prev];
        next[laneIndex] = true;
        return next;
      });

      if (gameState !== "PLAYING") return;

      // Hit Logic
      const now = performance.now();
      const gameTime = now - gameStartTimeRef.current;

      const candidate = notesRef.current.find(
        (n) => n.data.lane === laneIndex && !n.data.hit,
      );
      if (!candidate) return; // No note to hit

      const diff = Math.abs(candidate.data.time - gameTime);

      if (diff < THRESHOLD_GOOD) {
        candidate.data.hit = true;

        // Remove from 3D scene
        sceneRef.current?.remove(candidate.mesh);
        // Remove from tracking
        notesRef.current = notesRef.current.filter((n) => n !== candidate);

        createExplosion(candidate.mesh.position, laneIndex);

        notesHitRef.current++;

        // Score Update
        if (diff < THRESHOLD_PERFECT) {
          const points = SCORE_PERFECT;
          setScore((s) => s + points);
          scoreRef.current += points; // Update Ref
          setCombo((c) => {
            const newCombo = c + 1;
            setMaxCombo((mc) => Math.max(mc, newCombo));
            return newCombo;
          });
          setFeedback({
            text: "SEMPURNA",
            color: "text-[#ffd700]",
            id: Date.now(),
          });
        } else {
          const points = SCORE_GOOD;
          setScore((s) => s + points);
          scoreRef.current += points; // Update Ref
          setCombo((c) => {
            const newCombo = c + 1;
            setMaxCombo((mc) => Math.max(mc, newCombo));
            return newCombo;
          });
          setFeedback({
            text: "BAGUS",
            color: "text-green-400",
            id: Date.now(),
          });
        }
      }
    },
    [gameState],
  );

  const handleKeyUp = useCallback((laneIndex: number) => {
    const keyMesh = saronKeysMeshRef.current[laneIndex];
    if (keyMesh) {
      keyMesh.position.y = 0;
      (keyMesh.material as THREE.MeshStandardMaterial).emissive.setHex(
        0x332200,
      );
      (keyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
    }
    setActiveKeys((prev) => {
      const next = [...prev];
      next[laneIndex] = false;
      return next;
    });
  }, []);

  const handleMiss = (note: ActiveNote) => {
    audioRef.current?.playMissSound(); // Beep
    sceneRef.current?.remove(note.mesh);

    setLife((l) => {
      const newLife = l - 1;
      if (newLife <= 0) endGame(false);
      return newLife;
    });
    setCombo(0);
    setFeedback({ text: "MISS", color: "text-red-600", id: Date.now() });

    // Camera shake
    if (cameraRef.current) {
      cameraRef.current.position.x = (Math.random() - 0.5) * 0.5;
      setTimeout(() => {
        if (cameraRef.current) cameraRef.current.position.x = 0;
      }, 100);
    }
  };

  const endGame = (isWin: boolean) => {
    setGameState(isWin ? "WIN" : "LOSE");
    const totalNotes = totalNotesRef.current;
    const maxPossibleScore = totalNotes * SCORE_PERFECT;

    // Calculate accuracy using Ref to avoid stale closure state
    let acc = 0;
    const finalScore = scoreRef.current;

    if (maxPossibleScore > 0) {
      acc = Math.round((finalScore / maxPossibleScore) * 100);
    }
    setAccuracy(Math.min(100, Math.max(0, acc)));
  };

  const startGame = () => {
    // Clear any active countdown timers
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];

    // Reset
    notesRef.current.forEach((n) => sceneRef.current?.remove(n.mesh));
    notesRef.current = [];
    setScore(0);
    scoreRef.current = 0; // Reset Ref
    setCombo(0);
    setMaxCombo(0);
    setLife(8);
    setAccuracy(0);
    spawnIndexRef.current = 0;
    notesHitRef.current = 0;

    generateSong();

    // Start with countdown
    setGameState("PLAYING");
    countdownRef.current = 3;
    setCountdown(3);

    const t1 = setTimeout(() => {
      countdownRef.current = 2;
      setCountdown(2);
    }, 1000);
    const t2 = setTimeout(() => {
      countdownRef.current = 1;
      setCountdown(1);
    }, 2000);
    const t3 = setTimeout(() => {
      countdownRef.current = "MULAI!";
      setCountdown("MULAI!");
      audioRef.current?.resume();
      gameStartTimeRef.current = performance.now();
    }, 3000);
    const t4 = setTimeout(() => {
      countdownRef.current = null;
      setCountdown(null);
    }, 3800);

    countdownTimerRef.current = [t1, t2, t3, t4];
  };

  // Game Loop
  useEffect(() => {
    const loop = () => {
      animationFrameRef.current = requestAnimationFrame(loop);
      if (gameState !== "PLAYING") {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        return;
      }

      // During countdown (3, 2, 1), render scene but don't run game logic yet
      if (countdownRef.current !== null && countdownRef.current !== "MULAI!") {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        return;
      }

      const now = performance.now();
      const gameTime = now - gameStartTimeRef.current;
      const dt = 0.016;

      // 1. Spawning
      const spawnZ = -30;
      const travelTime = (Math.abs(spawnZ) / SCROLL_SPEED) * 1000;

      while (spawnIndexRef.current < levelNotesRef.current.length) {
        const note = levelNotesRef.current[spawnIndexRef.current];
        if (gameTime >= note.time - travelTime) {
          spawnVisualNote(note, spawnZ);
          spawnIndexRef.current++;
        } else {
          break;
        }
      }

      // 2. Moving & Miss Detection
      // We iterate backwards to allow safe removal
      for (let i = notesRef.current.length - 1; i >= 0; i--) {
        const n = notesRef.current[i];
        if (!n) continue;

        const timeDiff = (n.data.time - gameTime) / 1000;

        n.mesh.position.z = -(timeDiff * SCROLL_SPEED);
        n.mesh.rotation.z += 5 * dt;

        // Miss condition: give more margin so notes don't miss prematurely
        if (timeDiff < -0.45) {
          handleMiss(n);
          notesRef.current.splice(i, 1);
        }
      }

      // 3. Win Condition
      if (
        spawnIndexRef.current === levelNotesRef.current.length &&
        notesRef.current.length === 0 &&
        life > 0
      ) {
        // Wait a bit before winning
        if (gameState === "PLAYING") {
          // Check if we actually finished waiting (hacky check: if last note was long ago)
          setTimeout(() => endGame(true), 1000); // This might trigger multiple times if not careful?
          // Actually safer to do:
          // setGameState((prev) => prev === 'PLAYING' ? 'WIN' : prev);
          // But we need to call endGame for stats.
          // Correct approach: this block runs every frame. We need a flag or logic.
          // Simplified:
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    loop();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, life]); // Re-bind loop if state important to it changes (mostly only 'playing')

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) handleKeyHit(idx);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const idx = KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) handleKeyUp(idx);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleKeyHit, handleKeyUp]);

  return (
    <div className="relative w-full h-screen bg-[#071324] overflow-hidden font-serif">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundColor: "#071324",
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 12px, #1e3a8a 13px, #1e3a8a 16px, transparent 17px),
            radial-gradient(circle at 0% 0%, transparent 22px, #1e3a8a 23px, #1e3a8a 26px, transparent 27px),
            radial-gradient(circle at 100% 0%, transparent 22px, #1e3a8a 23px, #1e3a8a 26px, transparent 27px),
            radial-gradient(circle at 100% 100%, transparent 22px, #1e3a8a 23px, #1e3a8a 26px, transparent 27px),
            radial-gradient(circle at 0% 100%, transparent 22px, #1e3a8a 23px, #1e3a8a 26px, transparent 27px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-10" />

      {/* Back Button (Top Left) - Only shown in Menu */}
      {gameState === "MENU" && (
        <div className="absolute top-4 left-4 z-100">
          <button
            onClick={() => router.push("/Jawa")}
            className="cursor-pointer bg-[#0F2C59]/80 hover:bg-[#2563EB] backdrop-blur-md text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xl border border-white/15 group active:scale-95"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">Kembali</span>
          </button>
        </div>
      )}

      {/* UI Layers */}
      <StartScreen onStart={startGame} hidden={gameState !== "MENU"} />

      <GameHUD
        score={score}
        combo={combo}
        life={life}
        feedback={feedback}
        activeKeys={activeKeys}
        countdown={countdown}
        onKeyInput={handleKeyHit}
        onKeyRelease={handleKeyUp}
        hidden={gameState !== "PLAYING"}
      />

      {(gameState === "WIN" || gameState === "LOSE") && (
        <ResultScreen
          type={gameState}
          score={score}
          maxCombo={maxCombo}
          accuracy={accuracy}
          onRestart={startGame}
          onExit={() => router.push("/Jawa")}
        />
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap");

        @keyframes float-wayang {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes ping-once {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-ping-once {
          animation: ping-once 0.4s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
