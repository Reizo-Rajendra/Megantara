"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import { Rotate3D, Sparkles } from "lucide-react";

interface RelicData {
  id: string;
  name: string;
  region: string;
  path: string;
  scale: number;
  yOffset: number;
  rotationY: number;
  description: string;
}

const RELICS: RelicData[] = [
  {
    id: "gamelan",
    name: "Gamelan Ageng",
    region: "Jawa Tengah & DI Yogyakarta",
    path: "/gamelanan.glb",
    scale: 2.1,
    yOffset: -0.6,
    rotationY: -Math.PI / 2,
    description: "Ansambel musik tradisional dengan laras Pelog & Slendro warisan adiluhur Keraton.",
  },
  {
    id: "angklung",
    name: "Angklung Bambu",
    region: "Jawa Barat (Sunda)",
    path: "/model/angklung.glb",
    scale: 1.8,
    yOffset: -0.6,
    rotationY: 0,
    description: "Instrumen bambu bernada ganda warisan mahakarya budaya dunia UNESCO.",
  },
  {
    id: "rumah-gadang",
    name: "Rumah Gadang",
    region: "Sumatera Barat (Minangkabau)",
    path: "/RumahGadang.glb",
    scale: 0.9,
    yOffset: -1.0,
    rotationY: 0.2,
    description: "Arsitektur pusaka Minangkabau dengan atap gonjong menjulang menyerupai tanduk kerbau.",
  },
  {
    id: "buku",
    name: "Pustaka Adat",
    region: "Nusantara",
    path: "/Buku.glb",
    scale: 1.5,
    yOffset: -0.5,
    rotationY: 0.4,
    description: "Manuskrip dan babad sejarah yang merekam kearifan peradaban Nusantara.",
  },
];

export default function CulturalRelic3D({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeRelic, setActiveRelic] = useState<RelicData>(RELICS[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentModelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.005 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn("WebGL initialization failed", e);
      setLoadError(true);
      return;
    }

    // Clean Blue-White Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xf0f7ff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.9);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueRimLight.position.set(-4, 2, -2);
    scene.add(blueRimLight);

    // Soft Shadow Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Sleek Blue/Gold Pedestal Ring
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.68, 0.08, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x133863,
      roughness: 0.5,
      metalness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.24;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (currentModelRef.current) {
        if (!isDraggingRef.current) {
          currentModelRef.current.rotation.y += rotationVelocityRef.current.y;
          rotationVelocityRef.current.y = THREE.MathUtils.lerp(rotationVelocityRef.current.y, 0.004, 0.05);
          rotationVelocityRef.current.x = THREE.MathUtils.lerp(rotationVelocityRef.current.x, 0, 0.05);
          currentModelRef.current.rotation.x += rotationVelocityRef.current.x;
          currentModelRef.current.rotation.x = THREE.MathUtils.clamp(currentModelRef.current.rotation.x, -0.25, 0.25);
        }

        const floatY = Math.sin(elapsedTime * 1.6) * 0.06;
        currentModelRef.current.position.y = (currentModelRef.current.userData.baseY || 0) + floatY;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Load Model
  useEffect(() => {
    if (!sceneRef.current) return;
    setLoading(true);
    setLoadError(false);

    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
      currentModelRef.current = null;
    }

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      activeRelic.path,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(activeRelic.scale, activeRelic.scale, activeRelic.scale);
        model.position.set(0, activeRelic.yOffset, 0);
        model.rotation.y = activeRelic.rotationY;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        model.userData = { baseY: activeRelic.yOffset };

        if (sceneRef.current) {
          sceneRef.current.add(model);
          currentModelRef.current = model;
        }
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Relic loading error", err);
        setLoading(false);
        setLoadError(true);
      }
    );
  }, [activeRelic]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !currentModelRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    currentModelRef.current.rotation.y += deltaX * 0.01;
    currentModelRef.current.rotation.x += deltaY * 0.005;

    rotationVelocityRef.current = {
      x: deltaY * 0.002,
      y: deltaX * 0.005,
    };

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={`relative flex flex-col items-center w-full max-w-xl mx-auto select-none ${className}`}>
      {/* 3D Stage Container */}
      <div
        className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden bg-white border border-[#0F2C59]/15 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Subtle Ambient Ocean Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBF3FA]/70 via-white to-[#DBEAFE]/30 pointer-events-none" />

        {/* 3D Canvas Mount Point */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs pointer-events-none z-20"
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#0F2C59]/20 border-t-[#0F2C59] animate-spin mb-3" />
              <p className="text-[#0F2C59] text-xs tracking-wider font-semibold font-mono">
                Memuat Objek 3D...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback to mascot image if WebGL fails */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EBF3FA] z-20 p-6 text-center">
            <img
              src="/mascots/mascot-jawa.png"
              alt="Mascot Gatot Cilik"
              className="w-44 h-auto drop-shadow-md mb-3"
            />
            <p className="text-[#0F2C59] font-bold text-sm">Artefak Budaya Nusantara</p>
          </div>
        )}

        {/* Top Hint Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-[#0F2C59]/15 text-[#0F2C59] text-xs font-semibold shadow-sm pointer-events-none">
          <Rotate3D className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Putar Objek 360°</span>
        </div>

        {/* Bottom Relic Info Banner */}
        <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-2xl bg-white/95 border border-[#0F2C59]/15 text-left shadow-lg flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md text-[#0F2C59]">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-[#2563EB] uppercase font-bold">
              {activeRelic.region}
            </span>
            <h4 className="text-base font-bold text-[#0F2C59] font-serif leading-tight">
              {activeRelic.name}
            </h4>
            <p className="text-xs text-[#335377] line-clamp-1 mt-0.5">
              {activeRelic.description}
            </p>
          </div>
        </div>
      </div>

      {/* Relic Switcher Tabs */}
      <div className="w-full mt-3.5 flex items-center justify-center gap-2 flex-wrap">
        {RELICS.map((relic) => {
          const isActive = relic.id === activeRelic.id;
          return (
            <button
              key={relic.id}
              onClick={() => setActiveRelic(relic)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0F2C59] text-white font-bold shadow-md scale-102"
                  : "bg-white text-[#0F2C59] hover:bg-[#EBF3FA] border border-[#0F2C59]/15 shadow-xs"
              }`}
            >
              {relic.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
