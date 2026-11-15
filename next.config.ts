import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sajikan gambar dalam format modern agar transfer lebih kecil.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
  },
  experimental: {
    // Tree-shake import dari paket besar (ikon & animasi).
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/drei",
    ],
  },
  poweredByHeader: false,
  compiler: {
    // Buang console.log di production, sisakan error/warn untuk debugging.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
