import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html", // Ensure it points to your index.html file
    },
  },
  base: "./", // Adjust the base path if needed
});
