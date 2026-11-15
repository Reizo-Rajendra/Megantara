"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import { Rotate3D } from "lucide-react";

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

function disposeModel(model: THREE.Object3D) {
  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
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
  const loadedModelsRef = useRef<Set<THREE.Group>>(new Set());
  const loadTokenRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const loadedModels = loadedModelsRef.current;

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

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (currentModelRef.current) {
        if (!isDraggingRef.current) {
          // Rotasi hanya berasal dari drag pengguna; tidak ada auto-spin.
          currentModelRef.current.rotation.y += rotationVelocityRef.current.y;
          rotationVelocityRef.current.y = THREE.MathUtils.lerp(rotationVelocityRef.current.y, 0, 0.06);
          rotationVelocityRef.current.x = THREE.MathUtils.lerp(rotationVelocityRef.current.x, 0, 0.06);
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

      // Batalkan load yang masih berjalan dan bersihkan semua model agar
      // tidak ada objek lama yang tertinggal di scene.
      loadTokenRef.current += 1;
      loadedModels.forEach((model) => {
        scene.remove(model);
        disposeModel(model);
      });
      loadedModels.clear();
      currentModelRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  // Load Model
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const token = ++loadTokenRef.current;
    setLoading(true);
    setLoadError(false);

    // Hapus semua model yang pernah dimuat (bukan hanya model aktif) agar
    // tidak ada objek lama, mis. Gamelan, yang tertinggal saat tab diganti.
    loadedModelsRef.current.forEach((model) => {
      scene.remove(model);
      disposeModel(model);
    });
    loadedModelsRef.current.clear();
    currentModelRef.current = null;

    isDraggingRef.current = false;
    rotationVelocityRef.current = { x: 0, y: 0 };

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      activeRelic.path,
      (gltf) => {
        const model = gltf.scene;

        // Abaikan hasil load yang sudah basi (tab berganti / komponen unmount).
        if (token !== loadTokenRef.current || sceneRef.current !== scene) {
          disposeModel(model);
          return;
        }

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

        scene.add(model);
        loadedModelsRef.current.add(model);
        currentModelRef.current = model;
        setLoading(false);
      },
      undefined,
      (err) => {
        if (token !== loadTokenRef.current) return;
        console.error("Relic loading error", err);
        setLoading(false);
        setLoadError(true);
      }
    );

    return () => {
      // Invalidate respons load yang masih berjalan saat tab berubah.
      if (loadTokenRef.current === token) loadTokenRef.current += 1;
    };
  }, [activeRelic]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !currentModelRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    currentModelRef.current.rotation.y += deltaX * 0.01;
    currentModelRef.current.rotation.x = THREE.MathUtils.clamp(
      currentModelRef.current.rotation.x + deltaY * 0.005,
      -0.25,
      0.25,
    );

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
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F2F8FE] via-white to-[#E3EDF9] border border-[#0F2C59]/15 shadow-xl flex items-center justify-center">
        {/* 3D Canvas Mount Point */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

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
              src="/mascots/mascot-jawa.webp"
              alt="Mascot Gatot Cilik"
              className="w-44 h-auto drop-shadow-md mb-3"
            />
            <p className="text-[#0F2C59] font-bold text-sm">Artefak Budaya Nusantara</p>
          </div>
        )}
      </div>

      {/* Hint & relic info sit below the stage so nothing covers the 3D object */}
      <div className="w-full mt-3 flex items-center gap-1.5 px-1 text-xs font-semibold text-[#0F2C59]/70">
        <Rotate3D className="w-3.5 h-3.5 text-[#D97706]" />
        <span>Putar objek 360° dengan drag</span>
      </div>

      <div className="w-full mt-2 p-3.5 rounded-2xl bg-white border border-[#0F2C59]/15 text-left shadow-sm flex items-center justify-between gap-3 text-[#0F2C59]">
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

      {/* Relic Switcher Tabs */}
      <div className="w-full mt-3 flex items-center justify-center gap-2 flex-wrap">
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
