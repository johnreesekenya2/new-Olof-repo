import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/client",
  },
  server: {
    port: 5000,
    host: "0.0.0.0",
    hmr: {
      port: 5000,
      host: "0.0.0.0"
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./client/src"),
      "@shared": resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});