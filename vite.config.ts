
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    open: true
  },
  base: "/", // Explicitly set the base URL for assets
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: {},
    'process.env': {},
    'window.global': {},
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Disable code splitting for simpler asset loading
      }
    }
  }
});
