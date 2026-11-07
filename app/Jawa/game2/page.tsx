"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Music2, Volume2, Play, RotateCcw, ListMusic } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";

// --- Game Configuration ---
const CONFIG = {
  noteSpeed: 6.0,
  spawnHeight: 19,
  hitY: 1.6,
  hitWindow: 2.0, // Generous hit window for enjoyable rhythm play
  laneWidth: 2.35, // Wider lane spacing so larger angklungs don't crowd
  startBuffer: 3.5, // 3.5s buffer after countdown so notes don't immediately surprise player
};

// 8 Diatonic Notes (C Major Scale)
const NOTE_DETAILS = [
  { note: "Do", num: "1", keyLabel: "A / 1", color: "#38BDF8", hex: 0x38bdf8 },
  { note: "Re", num: "2", keyLabel: "S / 2", color: "#60A5FA", hex: 0x60a5fa },
  { note: "Mi", num: "3", keyLabel: "D / 3", color: "#818CF8", hex: 0x818cf8 },
  { note: "Fa", num: "4", keyLabel: "F / 4", color: "#34D399", hex: 0x34d399 },
  { note: "Sol", num: "5", keyLabel: "J / 5", color: "#FBBF24", hex: 0xfbbf24 },
  { note: "La", num: "6", keyLabel: "K / 6", color: "#FB923C", hex: 0xfb923c },
  { note: "Si", num: "7", keyLabel: "L / 7", color: "#F472B6", hex: 0xf472b6 },
  { note: "Do'", num: "i", keyLabel: "; / 8", color: "#22D3EE", hex: 0x22d3ee },
];

const KEY_MAPPINGS: Record<string, number> = {
  "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7,
  "a": 0, "s": 1, "d": 2, "f": 3, "j": 4, "k": 5, "l": 6, ";": 7,
  // Alternative ergonomic fallbacks
  "g": 4, "h": 5,
};

// Song Database
const SONGS = {
  level1: {
    title: "Gundul Gundul Pacul",
    region: "Jawa Tengah",
    difficulty: "★☆☆ (Mudah)",
    data: [
      { note: 0, time: 1.0 },
      { note: 2, time: 2.0 },
      { note: 0, time: 3.0 },
      { note: 2, time: 4.0 },
      { note: 3, time: 5.0 },
      { note: 4, time: 6.0 },
      { note: 4, time: 7.0 },
      { note: 0, time: 9.0 },
      { note: 2, time: 10.0 },
      { note: 0, time: 11.0 },
      { note: 2, time: 12.0 },
      { note: 3, time: 13.0 },
      { note: 4, time: 14.0 },
      { note: 4, time: 15.0 },
      { note: 6, time: 17.0 },
      { note: 7, time: 17.8 },
      { note: 6, time: 18.8 },
      { note: 7, time: 19.5 },
      { note: 5, time: 20.5 },
      { note: 4, time: 21.5 },
      { note: 6, time: 23.0 },
      { note: 7, time: 23.8 },
      { note: 6, time: 24.8 },
      { note: 7, time: 25.5 },
      { note: 5, time: 26.5 },
      { note: 4, time: 27.5 },
      { note: 3, time: 28.5 },
      { note: 0, time: 29.5 },
    ],
  },
  level2: {
    title: "Cublak Cublak Suweng",
    region: "Jawa Timur",
    difficulty: "★★☆ (Sedang)",
    data: [
      { note: 2, time: 1.0 },
      { note: 4, time: 1.6 },
      { note: 2, time: 2.2 },
      { note: 4, time: 2.8 },
      { note: 2, time: 3.4 },
      { note: 4, time: 4.0 },
      { note: 1, time: 4.6 },
      { note: 2, time: 5.4 },
      { note: 4, time: 6.0 },
      { note: 6, time: 6.6 },
      { note: 6, time: 7.2 },
      { note: 6, time: 7.8 },
      { note: 5, time: 8.4 },
      { note: 4, time: 9.0 },
      { note: 2, time: 9.8 },
      { note: 4, time: 10.4 },
      { note: 2, time: 11.0 },
      { note: 4, time: 11.6 },
      { note: 2, time: 12.2 },
      { note: 4, time: 12.8 },
      { note: 1, time: 13.4 },
      { note: 0, time: 14.2 },
      { note: 1, time: 14.8 },
      { note: 2, time: 15.4 },
      { note: 3, time: 16.0 },
      { note: 2, time: 16.6 },
      { note: 1, time: 17.2 },
      { note: 0, time: 18.0 },
      { note: 0, time: 19.0 },
      { note: 1, time: 19.6 },
      { note: 2, time: 20.2 },
      { note: 3, time: 20.8 },
      { note: 2, time: 21.4 },
      { note: 1, time: 22.0 },
      { note: 0, time: 22.8 },
      { note: 2, time: 23.6 },
      { note: 4, time: 24.4 },
      { note: 6, time: 25.0 },
      { note: 5, time: 25.6 },
      { note: 4, time: 26.2 },
      { note: 0, time: 27.2 },
    ],
  },
  level3: {
    title: "Suwe Ora Jamu",
    region: "D.I. Yogyakarta",
    difficulty: "★★☆ (Sedang)",
    data: [
      { note: 1, time: 1.0 },
      { note: 1, time: 1.6 },
      { note: 2, time: 2.2 },
      { note: 3, time: 2.8 },
      { note: 4, time: 3.5 },
      { note: 4, time: 4.5 },
      { note: 4, time: 5.5 },
      { note: 4, time: 6.1 },
      { note: 7, time: 6.8 },
      { note: 6, time: 7.4 },
      { note: 4, time: 8.0 },
      { note: 3, time: 8.6 },
      { note: 2, time: 9.2 },
      { note: 1, time: 10.2 },
      { note: 1, time: 10.8 },
      { note: 2, time: 11.4 },
      { note: 3, time: 12.0 },
      { note: 4, time: 12.6 },
      { note: 4, time: 13.6 },
      { note: 4, time: 14.4 },
      { note: 3, time: 15.0 },
      { note: 2, time: 15.6 },
      { note: 1, time: 16.2 },
      { note: 0, time: 17.2 },
      { note: 4, time: 18.2 },
      { note: 3, time: 19.2 },
      { note: 2, time: 20.2 },
      { note: 1, time: 21.2 },
      { note: 0, time: 22.2 },
    ],
  },
};

// --- Audio Manager ---
class AngklungAudio {
  audioElements: HTMLAudioElement[];
  audioFiles: string[];

  constructor() {
    this.audioFiles = [
      "/nada/Do.m4a",
      "/nada/Re.m4a",
      "/nada/Mi.m4a",
      "/nada/Fa.m4a",
      "/nada/So.m4a",
      "/nada/La.m4a",
      "/nada/Si.m4a",
      "/nada/DoH.m4a",
    ];

    this.audioElements = this.audioFiles.map((file) => {
      const audio = new Audio(file);
      audio.preload = "auto";
      audio.volume = 0.85;
      return audio;
    });
  }

  resume() {
    // Ensure first audio can play smoothly
    try {
      this.audioElements[0]?.play().then(() => {
        this.audioElements[0]?.pause();
        this.audioElements[0].currentTime = 0;
      }).catch(() => {});
    } catch {}
  }

  playNote(index: number) {
    if (!this.audioElements[index]) return;
    const audio = this.audioElements[index];
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 650);
  }
}

// --- Procedural Bamboo Angklung Generator ---
// Guaranteed to render instantly with authentic bamboo geometry and natural golden textures
function createProceduralAngklung(noteIndex: number): THREE.Group {
  const group = new THREE.Group();
  const pitchFactor = 1.0 - noteIndex * 0.055; // Lower notes are taller, higher notes shorter

  const bambooMat = new THREE.MeshStandardMaterial({
    color: 0xe5ba82,
    roughness: 0.3,
    metalness: 0.1,
  });
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x936639,
    roughness: 0.45,
  });
  const rattanMat = new THREE.MeshStandardMaterial({
    color: 0x42210b,
    roughness: 0.85,
  });

  // ~30% larger dimensions for high-visibility and presence on laptop screens
  const frameWidth = 1.75 * pitchFactor;
  const frameHeight = 4.4 * pitchFactor;

  // 1. Two Vertical Frame Poles
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, frameHeight, 16);
  const leftPole = new THREE.Mesh(poleGeo, bambooMat);
  leftPole.position.set(-frameWidth / 2, frameHeight / 2, 0);
  leftPole.castShadow = true;
  group.add(leftPole);

  const rightPole = new THREE.Mesh(poleGeo, bambooMat);
  rightPole.position.set(frameWidth / 2, frameHeight / 2, 0);
  rightPole.castShadow = true;
  group.add(rightPole);

  // 2. Horizontal Crossbeams
  const barGeo = new THREE.CylinderGeometry(0.075, 0.075, frameWidth + 0.35, 16);
  barGeo.rotateZ(Math.PI / 2);

  const bottomBar = new THREE.Mesh(barGeo, bambooMat);
  bottomBar.position.set(0, 0.55 * pitchFactor, 0);
  bottomBar.castShadow = true;
  group.add(bottomBar);

  const topBar = new THREE.Mesh(barGeo, bambooMat);
  topBar.position.set(0, frameHeight - 0.5 * pitchFactor, 0);
  topBar.castShadow = true;
  group.add(topBar);

  // 3. Rattan Bindings (Corners)
  const ringGeo = new THREE.TorusGeometry(0.1, 0.03, 8, 16);
  [
    [-frameWidth / 2, 0.55 * pitchFactor],
    [frameWidth / 2, 0.55 * pitchFactor],
    [-frameWidth / 2, frameHeight - 0.5 * pitchFactor],
    [frameWidth / 2, frameHeight - 0.5 * pitchFactor],
  ].forEach(([x, y]) => {
    const lash = new THREE.Mesh(ringGeo, rattanMat);
    lash.position.set(x, y, 0);
    group.add(lash);
  });

  // 4. Primary Resonant Bamboo Tube
  const tube1H = 3.0 * pitchFactor;
  const tube1Geo = new THREE.CylinderGeometry(0.20, 0.23, tube1H, 24);
  const tube1 = new THREE.Mesh(tube1Geo, bambooMat);
  tube1.position.set(-frameWidth * 0.18, tube1H / 2 + 0.35, 0.06);
  tube1.castShadow = true;
  group.add(tube1);

  // Bamboo Node Ring on Tube 1
  const t1Node = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.05, 24), nodeMat);
  t1Node.position.set(-frameWidth * 0.18, tube1H * 0.5 + 0.35, 0.06);
  group.add(t1Node);

  // 5. Secondary Resonant Bamboo Tube (Higher Octave harmonic)
  const tube2H = 2.1 * pitchFactor;
  const tube2Geo = new THREE.CylinderGeometry(0.15, 0.18, tube2H, 24);
  const tube2 = new THREE.Mesh(tube2Geo, bambooMat);
  tube2.position.set(frameWidth * 0.18, tube2H / 2 + 0.35, -0.06);
  tube2.castShadow = true;
  group.add(tube2);

  // Bamboo Node Ring on Tube 2
  const t2Node = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.04, 24), nodeMat);
  t2Node.position.set(frameWidth * 0.18, tube2H * 0.5 + 0.35, -0.06);
  group.add(t2Node);

  return group;
}

// --- Main Angklung Game Component ---
export default function AngklungGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // State
  const [gameState, setGameState] = useState({
    playing: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    currentSong: "",
    showMenu: true,
    showGameOver: false,
  });

  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [activeKeys, setActiveKeys] = useState<boolean[]>(new Array(8).fill(false));
  const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);

  // Refs
  const countdownRef = useRef<number | string | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioRef = useRef<AngklungAudio | null>(null);

  const gameDataRef = useRef<{
    playing: boolean;
    startT: number;
    notePtr: number;
    currentSongData: { note: number; time: number }[];
    fallingNotes: { mesh: THREE.Mesh; noteIndex: number; active: boolean; targetTime: number }[];
    angklungModels: THREE.Group[];
    runwayLanes: THREE.Mesh[];
    hitPads: THREE.Mesh[];
    noteGroup: THREE.Group | null;
    animationId: number | null;
    shakeStates: { active: boolean; startTime: number }[];
  }>({
    playing: false,
    startT: 0,
    notePtr: 0,
    currentSongData: [],
    fallingNotes: [],
    angklungModels: [],
    runwayLanes: [],
    hitPads: [],
    noteGroup: null,
    animationId: null,
    shakeStates: new Array(8).fill(null).map(() => ({ active: false, startTime: 0 })),
  });

  // --- Initialize 3D Scene in Mega Mendung Blue Theme ---
  useEffect(() => {
    if (!containerRef.current) return;

    // Audio System
    audioRef.current = new AngklungAudio();

    // 1. Scene Setup with Atmospheric Night Blue Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07152B, 25, 95);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      window.innerWidth < 768 ? 68 : 48,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    );

    const updateCameraPos = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      camera.aspect = aspect;

      if (width < 768) {
        // Mobile screens
        camera.fov = 76;
        camera.position.set(0, 10.0, 16.5);
        camera.lookAt(0, 3.4, 0);
      } else if (aspect >= 1.6) {
        // Standard 16:9 laptop screens (e.g. 1920x1080, 1366x768)
        camera.fov = 48;
        camera.position.set(0, 7.0, 14.8);
        camera.lookAt(0, 3.4, 0);
      } else {
        // 16:10 or taller laptop screens (e.g. 1440x900, 1680x1050, 1920x1200)
        camera.fov = 52;
        camera.position.set(0, 7.8, 16.2);
        camera.lookAt(0, 3.4, 0);
      }
      camera.updateProjectionMatrix();
    };
    updateCameraPos();
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Sky Dome (Deep Indigo to Twilight Navy Blue)
    const skyGeo = new THREE.SphereGeometry(90, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x050E1A) }, // Deepest Midnight
        bottomColor: { value: new THREE.Color(0x133863) }, // Royal Twilight Blue
        offset: { value: 12 },
        exponent: { value: 0.65 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // 5. Lighting
    const ambLight = new THREE.AmbientLight(0xdbeafe, 0.85); // Gentle cool sky illumination
    scene.add(ambLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x07152b, 1.0);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const mainSpot = new THREE.SpotLight(0xfff3d6, 1.8);
    mainSpot.position.set(0, 22, 12);
    mainSpot.angle = Math.PI / 3;
    mainSpot.penumbra = 0.5;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueRimLight.position.set(-15, 12, -10);
    scene.add(blueRimLight);

    // 6. Stage (Deep Navy Cultural Platform with Royal Blue Glowing Edge)
    const stageGeo = new THREE.BoxGeometry(24, 1.2, 10);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0a1a30,
      roughness: 0.3,
      metalness: 0.15,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.6;
    stage.receiveShadow = true;
    scene.add(stage);

    const edgeGeo = new THREE.BoxGeometry(24.2, 0.4, 10.2);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.7,
    });
    const stageEdge = new THREE.Mesh(edgeGeo, edgeMat);
    stageEdge.position.y = 0.05;
    scene.add(stageEdge);

    // 7. Distant Majestic Blue Mountains
    const mtnGeo = new THREE.ConeGeometry(24, 18, 4);
    const mtnMat = new THREE.MeshBasicMaterial({ color: 0x07152b, fog: true });

    const mtn1 = new THREE.Mesh(mtnGeo, mtnMat);
    mtn1.position.set(-28, 5, -35);
    mtn1.scale.set(1.8, 1, 1);
    scene.add(mtn1);

    const mtn2 = new THREE.Mesh(mtnGeo, mtnMat);
    mtn2.position.set(24, 6, -42);
    mtn2.scale.set(2.4, 1.2, 1);
    scene.add(mtn2);

    // 8. Starlight & Blue Fireflies Particles
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 55;
      pPos[i * 3 + 1] = Math.random() * 22;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 35 - 5;

      pSpeeds.push({
        y: Math.random() * 0.04 + 0.01,
        x: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03,
      });
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const starParticles = new THREE.Points(pGeo, pMat);
    scene.add(starParticles);

    // 9. Construct 8 Angklung Stations & Runway Tracks
    const startX = -((8 - 1) * CONFIG.laneWidth) / 2;
    const angklungModels: THREE.Group[] = [];
    const runwayLanes: THREE.Mesh[] = [];
    const hitPads: THREE.Mesh[] = [];

    // Optional GLTF loader
    const gltfLoader = new GLTFLoader();
    let loadedGLTFScene: THREE.Group | null = null;
    gltfLoader.load(
      "/model/angklung.glb",
      (gltf: GLTF) => {
        loadedGLTFScene = gltf.scene;
        // If GLTF is loaded, we can enhance the models
        angklungModels.forEach((grp, idx) => {
          if (loadedGLTFScene) {
            const clone = loadedGLTFScene.clone(true);
            const pScale = 2.8 * (1.0 - idx * 0.05);
            clone.scale.set(pScale, pScale, pScale);
            clone.position.y = 0;
            // Hide procedural bamboo and show GLTF
            grp.children.forEach((c) => (c.visible = false));
            grp.add(clone);
          }
        });
      },
      undefined,
      (err) => {
        console.info("Using procedural bamboo angklungs:", err);
      }
    );

    for (let i = 0; i < 8; i++) {
      const x = startX + i * CONFIG.laneWidth;
      const laneColor = NOTE_DETAILS[i].hex;

      // Vertical Fall Runway (Subtle transparent guide beam)
      const runwayH = CONFIG.spawnHeight - CONFIG.hitY;
      const runwayGeo = new THREE.CylinderGeometry(0.045, 0.045, runwayH, 8);
      const runwayMat = new THREE.MeshBasicMaterial({
        color: laneColor,
        transparent: true,
        opacity: 0.22,
      });
      const runway = new THREE.Mesh(runwayGeo, runwayMat);
      runway.position.set(x, CONFIG.hitY + runwayH / 2, 0);
      scene.add(runway);
      runwayLanes.push(runway);

      // Elevated Hit Pad Ring & Target Disc at hit target height
      const padGroup = new THREE.Group();

      const padGeo = new THREE.RingGeometry(0.70, 0.95, 32);
      padGeo.rotateX(-Math.PI / 2);
      const padMat = new THREE.MeshBasicMaterial({
        color: laneColor,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      padGroup.add(pad);

      const innerPadGeo = new THREE.CircleGeometry(0.68, 32);
      innerPadGeo.rotateX(-Math.PI / 2);
      const innerPadMat = new THREE.MeshBasicMaterial({
        color: laneColor,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const innerPad = new THREE.Mesh(innerPadGeo, innerPadMat);
      padGroup.add(innerPad);

      padGroup.position.set(x, CONFIG.hitY, 0);
      scene.add(padGroup);
      hitPads.push(pad);

      // Procedural Bamboo Angklung Unit
      const angklung = createProceduralAngklung(i);
      angklung.position.set(x, 0, 0);
      scene.add(angklung);
      angklungModels.push(angklung);
    }

    gameDataRef.current.angklungModels = angklungModels;
    gameDataRef.current.runwayLanes = runwayLanes;
    gameDataRef.current.hitPads = hitPads;

    // 10. Note Group for falling notes
    const noteGroup = new THREE.Group();
    scene.add(noteGroup);
    gameDataRef.current.noteGroup = noteGroup;

    // --- Animation & Game Render Loop ---
    const animate = (time: number) => {
      gameDataRef.current.animationId = requestAnimationFrame(animate);

      // Animate fireflies
      const posArray = starParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        posArray[i * 3 + 1] += pSpeeds[i].y;
        if (posArray[i * 3 + 1] > 22) posArray[i * 3 + 1] = 0;
        posArray[i * 3] += Math.sin(time * 0.001 + i) * 0.015;
        posArray[i * 3 + 2] += Math.cos(time * 0.001 + i) * 0.015;
      }
      starParticles.geometry.attributes.position.needsUpdate = true;

      // Animate Angklung Shakes
      const now = performance.now();
      gameDataRef.current.shakeStates.forEach((shake, idx) => {
        if (!shake.active) return;
        const elapsed = (now - shake.startTime) / 1000;
        const model = gameDataRef.current.angklungModels[idx];
        if (!model) return;

        if (elapsed < 0.45) {
          const decay = 1 - elapsed / 0.45;
          model.rotation.z = Math.sin(elapsed * 28) * 0.16 * decay;
        } else {
          model.rotation.z = 0;
          shake.active = false;
        }
      });

      // Render Three.js Scene
      renderer.render(scene, camera);

      // Gameplay Update Logic
      if (!gameDataRef.current.playing) return;
      if (countdownRef.current !== null && countdownRef.current !== "MULAI!") return;

      const tGame = (now - gameDataRef.current.startT) / 1000;
      const songData = gameDataRef.current.currentSongData;
      const travelTime = (CONFIG.spawnHeight - CONFIG.hitY) / CONFIG.noteSpeed;

      // Spawn Notes with Start Buffer
      while (gameDataRef.current.notePtr < songData.length) {
        const item = songData[gameDataRef.current.notePtr];
        const scheduledTime = item.time + CONFIG.startBuffer;

        if (tGame >= scheduledTime - travelTime) {
          spawnVisualNote(item.note, scheduledTime);
          gameDataRef.current.notePtr++;
        } else {
          break;
        }
      }

      // Move Falling Notes & Check Misses
      let activeNotesRemaining = 0;
      const notes = gameDataRef.current.fallingNotes;

      for (let i = notes.length - 1; i >= 0; i--) {
        const n = notes[i];
        if (!n.active) continue;
        activeNotesRemaining++;

        const timeDiff = n.targetTime - tGame;
        n.mesh.position.y = CONFIG.hitY + timeDiff * CONFIG.noteSpeed;
        n.mesh.rotation.y += 0.05;

        // Note passed too far below hit zone -> MISS
        if (n.mesh.position.y < CONFIG.hitY - 1.6) {
          n.active = false;
          noteGroup.remove(n.mesh);
          triggerHUDScore(0, "TERLEWAT");
          notes.splice(i, 1);
        }
      }

      // Check Victory Condition
      if (gameDataRef.current.notePtr >= songData.length && activeNotesRemaining === 0) {
        finishSong();
      }
    };

    animate(0);

    // Resize Handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      updateCameraPos();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameDataRef.current.animationId) {
        cancelAnimationFrame(gameDataRef.current.animationId);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --- Spawn Visual Note Mesh ---
  const spawnVisualNote = (noteIndex: number, targetTime: number) => {
    if (!gameDataRef.current.noteGroup) return;

    const startX = -((8 - 1) * CONFIG.laneWidth) / 2;
    const x = startX + noteIndex * CONFIG.laneWidth;
    const detail = NOTE_DETAILS[noteIndex];

    const noteGroupMesh = new THREE.Group();

    // Glowing sphere - Larger & more prominent for comfortable viewing
    const sphereGeo = new THREE.SphereGeometry(0.66, 28, 28);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: detail.hex,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    noteGroupMesh.add(sphere);

    // Glowing Outer Halo Disc
    const haloGeo = new THREE.RingGeometry(0.72, 0.95, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: detail.hex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    noteGroupMesh.add(halo);

    noteGroupMesh.position.set(x, CONFIG.spawnHeight, 0);

    gameDataRef.current.noteGroup.add(noteGroupMesh);
    gameDataRef.current.fallingNotes.push({
      mesh: noteGroupMesh as any,
      noteIndex,
      active: true,
      targetTime,
    });
  };

  // --- Hit Angklung Logic ---
  const hitAngklung = useCallback((laneIndex: number) => {
    // 1. Play Angklung Sound
    audioRef.current?.playNote(laneIndex);

    // 2. Trigger Visual Active State on HUD Key
    setActiveKeys((prev) => {
      const next = [...prev];
      next[laneIndex] = true;
      return next;
    });
    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = [...prev];
        next[laneIndex] = false;
        return next;
      });
    }, 180);

    // 3. Trigger 3D Bamboo Angklung Shake
    const shakeState = gameDataRef.current.shakeStates[laneIndex];
    if (shakeState) {
      shakeState.active = true;
      shakeState.startTime = performance.now();
    }

    // Pulse hit pad ring
    const pad = gameDataRef.current.hitPads[laneIndex];
    if (pad) {
      (pad.material as THREE.MeshBasicMaterial).opacity = 1.0;
      setTimeout(() => {
        if (pad) (pad.material as THREE.MeshBasicMaterial).opacity = 0.75;
      }, 150);
    }

    if (!gameDataRef.current.playing) return;

    // 4. Hit Detection with Falling Notes
    const now = performance.now();
    const tGame = (now - gameDataRef.current.startT) / 1000;

    const candidate = gameDataRef.current.fallingNotes.find(
      (n) => n.active && n.noteIndex === laneIndex
    );

    if (candidate) {
      const dy = Math.abs(candidate.mesh.position.y - CONFIG.hitY);

      if (dy < CONFIG.hitWindow) {
        candidate.active = false;
        gameDataRef.current.noteGroup?.remove(candidate.mesh);
        gameDataRef.current.fallingNotes = gameDataRef.current.fallingNotes.filter(
          (n) => n !== candidate
        );

        spawnHitExplosion(candidate.mesh.position, NOTE_DETAILS[laneIndex].hex);

        if (dy < 0.7) {
          triggerHUDScore(100, "SEMPURNA!");
        } else {
          triggerHUDScore(50, "BAGUS!");
        }
      }
    }
  }, []);

  // --- Visual Hit Particles Explosion ---
  const spawnHitExplosion = (pos: THREE.Vector3, color: number) => {
    if (!sceneRef.current) return;
    const ringGeo = new THREE.RingGeometry(0.3, 0.75, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.rotation.x = Math.PI / 2;
    sceneRef.current.add(ring);

    let scale = 1.0;
    const animateRing = () => {
      scale += 0.12;
      ring.scale.set(scale, scale, scale);
      ringMat.opacity -= 0.08;
      if (ringMat.opacity > 0) {
        requestAnimationFrame(animateRing);
      } else {
        sceneRef.current?.remove(ring);
        ringGeo.dispose();
        ringMat.dispose();
      }
    };
    animateRing();
  };

  // --- HUD Score & Feedback ---
  const triggerHUDScore = (points: number, text: string) => {
    setGameState((prev) => {
      const newCombo = points > 0 ? prev.combo + 1 : 0;
      const newMax = Math.max(prev.maxCombo, newCombo);
      return {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        maxCombo: newMax,
      };
    });

    const color = points >= 100 ? "#34d399" : points > 0 ? "#38bdf8" : "#94a3b8";
    setFeedback({ text, color, id: Date.now() });
  };

  // --- Start Song with Countdown & Buffer ---
  const startSong = (songKey: keyof typeof SONGS) => {
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];

    const song = SONGS[songKey];
    gameDataRef.current.currentSongData = song.data;
    gameDataRef.current.notePtr = 0;

    // Clear active notes
    if (gameDataRef.current.noteGroup) {
      gameDataRef.current.fallingNotes.forEach((n) =>
        gameDataRef.current.noteGroup?.remove(n.mesh)
      );
    }
    gameDataRef.current.fallingNotes = [];

    setGameState({
      playing: true,
      score: 0,
      combo: 0,
      maxCombo: 0,
      currentSong: song.title,
      showMenu: false,
      showGameOver: false,
    });

    // 3-second countdown
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
      gameDataRef.current.playing = true;
      gameDataRef.current.startT = performance.now();
    }, 3000);

    const t4 = setTimeout(() => {
      countdownRef.current = null;
      setCountdown(null);
    }, 3800);

    countdownTimerRef.current = [t1, t2, t3, t4];
  };

  const finishSong = () => {
    gameDataRef.current.playing = false;
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        playing: false,
        showGameOver: true,
      }));
    }, 1200);
  };

  const returnToMenu = () => {
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];
    countdownRef.current = null;
    setCountdown(null);
    gameDataRef.current.playing = false;

    if (gameDataRef.current.noteGroup) {
      gameDataRef.current.fallingNotes.forEach((n) =>
        gameDataRef.current.noteGroup?.remove(n.mesh)
      );
    }
    gameDataRef.current.fallingNotes = [];

    setGameState((prev) => ({
      ...prev,
      showMenu: true,
      showGameOver: false,
      playing: false,
    }));
  };

  // --- Keyboard Event Listeners ---
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (key in KEY_MAPPINGS) {
        hitAngklung(KEY_MAPPINGS[key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hitAngklung]);

  return (
    <div className="relative w-full h-screen bg-[#07152B] overflow-hidden font-sans select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Back to Island Jawa Button (Menu Mode) */}
      {gameState.showMenu && (
        <div className="absolute top-5 left-5 z-40">
          <button
            onClick={() => router.push("/Jawa")}
            className="cursor-pointer bg-[#0F2C59]/80 hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xl border border-white/20 active:scale-95 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wide">Kembali ke Jawa</span>
          </button>
        </div>
      )}

      {/* --- IN-GAME HUD HEADER --- */}
      {gameState.playing && (
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4 md:p-6 flex justify-between items-start">
          {/* Song Info */}
          <div className="bg-[#0F2C59]/85 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl shadow-lg pointer-events-auto flex items-center gap-3">
            <button
              onClick={returnToMenu}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Menu Lagu"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                Tembang Angklung
              </p>
              <h2 className="text-sm md:text-base font-bold text-white font-serif">
                {gameState.currentSong}
              </h2>
            </div>
          </div>

          {/* Score & Combo */}
          <div className="flex gap-3">
            <div className="bg-[#0F2C59]/85 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-center shadow-lg min-w-[85px]">
              <span className="text-[10px] font-mono tracking-wider text-sky-200/80 uppercase font-bold block">
                Biji / Skor
              </span>
              <span className="text-xl md:text-2xl font-black text-amber-300 font-mono">
                {gameState.score}
              </span>
            </div>

            <div className="bg-[#0F2C59]/85 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-center shadow-lg min-w-[75px]">
              <span className="text-[10px] font-mono tracking-wider text-sky-200/80 uppercase font-bold block">
                Combo
              </span>
              <span
                className={`text-xl md:text-2xl font-black font-mono ${
                  gameState.combo > 0 ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                x{gameState.combo}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- COUNTDOWN OVERLAY --- */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none">
          <div className="text-7xl md:text-9xl font-black text-amber-400 font-serif drop-shadow-[0_0_40px_rgba(251,191,36,0.8)] animate-bounce mb-4">
            {countdown}
          </div>
          <div className="px-6 py-2.5 rounded-full bg-[#0F2C59]/90 border border-white/20 text-white text-xs md:text-sm font-bold tracking-wide shadow-2xl text-center max-w-md">
            Tekan bilah di bawah atau gunakan keyboard [A..;] / [1..8] saat not menyentuh lingkaran!
          </div>
        </div>
      )}

      {/* --- HIT FEEDBACK OVERLAY --- */}
      {feedback && (
        <div
          key={feedback.id}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-4xl md:text-5xl font-black font-serif tracking-wider animate-ping-once drop-shadow-md"
          style={{ color: feedback.color }}
        >
          {feedback.text}
        </div>
      )}

      {/* --- BOTTOM INTERACTIVE ANGKLUNG CONTROL DOCK --- */}
      {gameState.playing && (
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 z-30 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
          <div className="bg-[#0F2C59]/92 backdrop-blur-md border border-white/20 p-2 sm:p-3 md:p-3.5 rounded-3xl shadow-2xl pointer-events-auto max-w-5xl lg:max-w-6xl w-full">
            <div className="grid grid-cols-8 gap-1.5 sm:gap-2.5 md:gap-3">
              {NOTE_DETAILS.map((detail, index) => {
                const isActive = activeKeys[index];
                return (
                  <button
                    key={detail.note}
                    onMouseDown={() => hitAngklung(index)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      hitAngklung(index);
                    }}
                    className={`cursor-pointer flex flex-col items-center justify-center py-2.5 sm:py-4 md:py-4.5 px-1 rounded-2xl transition-all duration-100 border select-none ${
                      isActive
                        ? "bg-white text-slate-950 scale-95 border-amber-300 shadow-[0_0_25px_rgba(255,255,255,0.9)]"
                        : "bg-[#07152B]/85 hover:bg-[#1D4ED8]/50 border-white/15 text-white shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Note pitch name */}
                    <span
                      className="text-xs sm:text-base md:text-lg font-black font-serif tracking-wide"
                      style={{ color: isActive ? "#0F2C59" : detail.color }}
                    >
                      {detail.note}
                    </span>

                    {/* Numeric note */}
                    <span className="text-lg sm:text-2xl md:text-3xl font-black font-mono text-white my-0.5">
                      {detail.num}
                    </span>

                    {/* Keyboard key badge */}
                    <span className="text-[9px] sm:text-xs md:text-sm font-mono px-2 py-0.5 rounded bg-white/10 text-sky-200/90 font-bold border border-white/15 mt-1">
                      {detail.keyLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MENU SCREEN: MEGA MENDUNG BLUE THEME --- */}
      {gameState.showMenu && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#07152B]/95 via-[#0F2C59]/95 to-[#07152B]/95 backdrop-blur-md">
          {/* Subtle Batik Motif Grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-200 text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Music2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Megantara • Angklung Jawi 3D</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight text-white mb-2 drop-shadow-md">
              ANGKLUNG JAWI
            </h1>

            <p className="text-xs md:text-sm text-sky-200/80 mb-8 max-w-md leading-relaxed font-medium">
              Petik keselarasan 8 laras bambu diatonis Nusantara. Ketuk bilah angklung tepat saat nada jatuh ke lingkaran sasaran.
            </p>

            {/* Song Cards List */}
            <div className="w-full flex flex-col gap-3.5 mb-8">
              {(Object.keys(SONGS) as Array<keyof typeof SONGS>).map((key) => {
                const song = SONGS[key];
                return (
                  <button
                    key={key}
                    onClick={() => startSong(key)}
                    className="cursor-pointer group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-[#0B1E3B]/80 hover:bg-[#1D4ED8]/50 border border-white/15 hover:border-[#38BDF8] transition-all duration-200 shadow-lg text-left"
                  >
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-white font-serif group-hover:text-[#38BDF8] transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs text-sky-200/70 font-mono mt-0.5">
                        {song.region} • {song.difficulty}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/40 group-hover:bg-[#2563EB] flex items-center justify-center text-white transition-all shadow-md group-hover:scale-105">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instructions Pill */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-sky-200/80 max-w-md leading-relaxed">
              <span className="font-bold text-amber-300">Cara Bermain: </span>
              Gunakan tombol keyboard <span className="font-mono text-white font-bold">[A][S][D][F][J][K][L][;]</span> atau <span className="font-mono text-white font-bold">[1..8]</span>, atau sentuh langsung tombol bilah di layar!
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER SCREEN --- */}
      {gameState.showGameOver && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#07152B]/95 backdrop-blur-lg">
          <div className="max-w-md w-full bg-[#0F2C59]/90 border border-white/20 p-8 rounded-3xl shadow-2xl text-center text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-serif text-white mb-1">
              SAMPUN PARIPURNA
            </h2>
            <p className="text-xs text-sky-200/80 mb-6 font-mono tracking-widest uppercase">
              Permainan Selesai
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3.5 rounded-2xl bg-[#07152B]/80 border border-white/10">
                <span className="text-[10px] font-mono text-sky-200/70 uppercase block font-bold">
                  Total Biji
                </span>
                <span className="text-2xl md:text-3xl font-black text-amber-300 font-mono">
                  {gameState.score}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#07152B]/80 border border-white/10">
                <span className="text-[10px] font-mono text-sky-200/70 uppercase block font-bold">
                  Max Combo
                </span>
                <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                  x{gameState.maxCombo}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={returnToMenu}
                className="cursor-pointer flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/15"
              >
                <ListMusic className="w-4 h-4" />
                <span>Pilih Lagu</span>
              </button>

              <button
                onClick={() => {
                  const key = (Object.keys(SONGS) as Array<keyof typeof SONGS>).find(
                    (k) => SONGS[k].title === gameState.currentSong
                  ) || "level1";
                  startSong(key);
                }}
                className="cursor-pointer flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ping-once keyframe */}
      <style jsx global>{`
        @keyframes ping-once {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.4);
          }
        }
        .animate-ping-once {
          animation: ping-once 0.45s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
