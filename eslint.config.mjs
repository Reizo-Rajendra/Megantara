import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // React Compiler advisories (eslint-plugin-react-hooks v6) terlalu ketat
  // untuk kode Three.js imperatif di proyek ini: Math.random()/Date.now()
  // dipakai di dalam callback animasi, helper dideklarasikan setelah dipakai,
  // dan beberapa state memang disinkronkan dari effect. Turunkan ke warning
  // agar tetap terlihat tanpa memblokir build.
  {
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
