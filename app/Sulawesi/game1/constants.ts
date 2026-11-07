import { CardItem } from "./types";

export const GAME_DURATION = 60; // seconds

export const THEME_COLORS = {
  primary: "#543310", // Dark Brown
  secondary: "#AF8F6F", // Tan/Light Brown
  accent: "#D97706", // Gold
  background: "#F8F4E1", // Cream
  success: "#10B981", // Keep standard green for success or use accent-spirit if fitting, but green is better for UI feedback
  error: "#9F1239", // Accent Spirit (Dark Red)
  text: "#543310",
};

export const LANGUAGE_DATA: CardItem[] = [
  {
    id: "l1-q",
    content: "Siri'",
    type: "QUESTION",
    pairId: "l1",
    info: "Siri' itu kehormatan diri. Kalo ilang, malunya minta ampun di budaya Bugis-Makassar!",
  },
  {
    id: "l1-a",
    content: "Harga Diri",
    type: "ANSWER",
    pairId: "l1",
    info: "Siri' itu kehormatan diri. Kalo ilang, malunya minta ampun di budaya Bugis-Makassar!",
  },
  {
    id: "l2-q",
    content: "Tabe'",
    type: "QUESTION",
    pairId: "l2",
    info: "Tabe' artinya permisi, biar sopan kayak orang Sulawesi asli!",
  },
  {
    id: "l2-a",
    content: "Permisi",
    type: "ANSWER",
    pairId: "l2",
    info: "Tabe' artinya permisi, biar sopan kayak orang Sulawesi asli!",
  },
  {
    id: "l3-q",
    content: "Marendeng",
    type: "QUESTION",
    pairId: "l3",
    info: "Marendeng itu artinya aman dan sejahtera. Semoga kita semua selalu marendeng ya!",
  },
  {
    id: "l3-a",
    content: "Aman/Sentosa",
    type: "ANSWER",
    pairId: "l3",
    info: "Marendeng itu artinya aman dan sejahtera. Semoga kita semua selalu marendeng ya!",
  },
  {
    id: "l4-q",
    content: "Ewako",
    type: "QUESTION",
    pairId: "l4",
    info: "Ewako! Teriakkan ini kalau butuh semangat membara. Artinya Berani atau Lawan!",
  },
  {
    id: "l4-a",
    content: "Berani/Lawan",
    type: "ANSWER",
    pairId: "l4",
    info: "Ewako! Teriakkan ini kalau butuh semangat membara. Artinya Berani atau Lawan!",
  },
  {
    id: "l5-q",
    content: "Iye'",
    type: "QUESTION",
    pairId: "l5",
    info: "Kalo ditanya atau setuju, jawab 'Iye'' ya. Lebih halus dan sopan lho!",
  },
  {
    id: "l5-a",
    content: "Ya (Sopan)",
    type: "ANSWER",
    pairId: "l5",
    info: "Kalo ditanya atau setuju, jawab 'Iye'' ya. Lebih halus dan sopan lho!",
  },
  {
    id: "l6-q",
    content: "Pesse",
    type: "QUESTION",
    pairId: "l6",
    info: "Pesse itu rasa senasib sepenanggungan. Sakitmu, sakitku juga. Solidaritas abis!",
  },
  {
    id: "l6-a",
    content: "Empati/Solidaritas",
    type: "ANSWER",
    pairId: "l6",
    info: "Pesse itu rasa senasib sepenanggungan. Sakitmu, sakitku juga. Solidaritas abis!",
  },
];
