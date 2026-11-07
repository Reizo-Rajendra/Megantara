"use client";

import React, { ReactNode } from "react";
import { useTransitionContext } from "./TransitionContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { isAnimating } = useTransitionContext();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  // Only hide navbar in active fullscreen mini-game screens
  const isGameFullscreenPage =
    pathname.includes("/game1") ||
    pathname.includes("/game2");

  if (isAuthPage || isGameFullscreenPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`transition-opacity duration-500 ${
          isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Navbar />
      </div>

      {children}

      <div
        className={`transition-opacity duration-500 ${
          isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Footer />
      </div>
    </>
  );
}
