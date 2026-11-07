"use client";

import React from "react";
import { motion } from "framer-motion";

export const MegaMendungCloudShape = ({
  className = "",
  scale = 1,
  flip = false,
  opacity = 0.85,
}: {
  className?: string;
  scale?: number;
  flip?: boolean;
  opacity?: number;
}) => {
  return (
    <div
      style={{
        transform: `${flip ? "scaleX(-1)" : ""} scale(${scale})`,
        opacity,
      }}
      className={`select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 380 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Tier 1: Deep Navy Base (Layer Luar Mega Mendung) */}
        <path
          d="M20 140 C50 140, 70 120, 100 120 C130 120, 150 145, 190 145 C230 145, 250 115, 290 115 C330 115, 350 135, 370 135 C380 135, 380 90, 360 80 C340 70, 310 85, 280 75 C250 65, 240 30, 200 30 C160 30, 140 60, 110 65 C80 70, 60 50, 40 60 C10 75, 0 100, 20 140 Z"
          fill="#0C2340"
        />

        {/* Tier 2: Royal Blue */}
        <path
          d="M35 130 C60 130, 78 112, 105 112 C132 112, 150 135, 188 135 C226 135, 246 108, 282 108 C318 108, 338 126, 356 126 C365 126, 365 85, 348 76 C330 67, 304 80, 276 71 C248 62, 238 40, 202 40 C166 40, 148 68, 120 72 C92 76, 74 58, 56 67 C28 80, 20 102, 35 130 Z"
          fill="#1D4ED8"
        />

        {/* Tier 3: Cerulean Blue */}
        <path
          d="M50 122 C72 122, 88 106, 112 106 C136 106, 152 126, 186 126 C220 126, 238 102, 272 102 C306 102, 324 118, 342 118 C350 118, 350 82, 335 74 C320 66, 296 76, 270 68 C244 60, 234 48, 202 48 C170 48, 154 74, 128 78 C102 82, 86 66, 70 74 C44 86, 38 104, 50 122 Z"
          fill="#2563EB"
        />

        {/* Tier 4: Sky Azure */}
        <path
          d="M68 114 C86 114, 100 100, 120 100 C140 100, 154 118, 184 118 C214 118, 230 96, 260 96 C290 96, 306 110, 324 110 C332 110, 332 80, 320 72 C308 64, 288 72, 264 66 C240 60, 230 54, 202 54 C174 54, 160 78, 136 82 C112 86, 98 72, 84 80 C62 92, 58 106, 68 114 Z"
          fill="#38BDF8"
        />

        {/* Tier 5: Ice Blue / Pucuk Mega */}
        <path
          d="M88 106 C102 106, 114 94, 130 94 C146 94, 158 108, 182 108 C206 108, 220 90, 246 90 C272 90, 286 102, 302 102 C310 102, 310 76, 300 70 C290 64, 274 70, 252 64 C230 58, 222 60, 200 60 C178 60, 166 82, 144 86 C122 90, 112 78, 100 86 C82 96, 80 102, 88 106 Z"
          fill="#BAE6FD"
        />

        {/* Tier 6: White Core Peak (Inti Putih Awan) */}
        <path
          d="M110 98 C120 98, 128 88, 140 88 C152 88, 162 100, 180 100 C198 100, 210 86, 230 86 C250 86, 262 94, 276 94 C284 94, 284 74, 276 68 C268 62, 256 66, 238 62 C220 58, 214 64, 198 64 C182 64, 172 84, 154 88 C136 92, 128 84, 118 90 C106 98, 104 98, 110 98 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};

export const FloatingMegaMendungClouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Cloud */}
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -12, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-10 -left-12 w-[340px] md:w-[480px]"
      >
        <MegaMendungCloudShape scale={1.1} opacity={0.8} />
      </motion.div>

      {/* Top Right Cloud */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -top-16 -right-16 w-[360px] md:w-[500px]"
      >
        <MegaMendungCloudShape scale={1.15} flip opacity={0.75} />
      </motion.div>

      {/* Bottom Left Cloud */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-16 -left-16 w-[360px] md:w-[520px]"
      >
        <MegaMendungCloudShape scale={1.2} opacity={0.8} />
      </motion.div>

      {/* Bottom Right Cloud */}
      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, -12, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute -bottom-20 -right-12 w-[380px] md:w-[540px]"
      >
        <MegaMendungCloudShape scale={1.25} flip opacity={0.85} />
      </motion.div>

      {/* Subtle Floating Mid Drift Clouds */}
      <motion.div
        animate={{
          x: [-40, 40, -40],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -left-32 w-[300px] opacity-40 hidden lg:block"
      >
        <MegaMendungCloudShape scale={0.9} />
      </motion.div>

      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [0, 8, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-1/2 -right-28 w-[320px] opacity-40 hidden lg:block"
      >
        <MegaMendungCloudShape scale={0.95} flip />
      </motion.div>
    </div>
  );
};
