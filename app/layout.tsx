import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/TransitionContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import CloudTransition from "@/components/CloudTransition";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Megantara - Jelajah Budaya 3D Nusantara",
  description: "Platform edukasi budaya 3D interaktif bertema Mega Mendung Nusantara",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <TransitionProvider>
          <CloudTransition />
          <LayoutWrapper>{children}</LayoutWrapper>
        </TransitionProvider>
      </body>
    </html>
  );
}
