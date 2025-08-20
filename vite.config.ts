// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    // 필요 시 프록시 설정
    // proxy: { "/api": { target: "http://localhost:4000", changeOrigin: true } }
  },
  build: { sourcemap: true },
});
