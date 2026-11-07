"use client";

import React from "react";
import GameBoard from "./components/GameBoard";
import { useRouter } from "next/navigation";

export default function GameTwoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex flex-col font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `nav, footer { display: none !important; }`,
        }}
      />

      <main className="grow flex flex-col items-center justify-center p-4 relative overflow-hidden z-10">
        <div className="w-full">
          <GameBoard mode="SYMBOL" onExit={() => router.push("/Sulawesi")} />
        </div>
      </main>
    </div>
  );
}
