import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    // tanstackRouter({
    //   target: "react",
    //   // autoCodeSplitting: true,
    // }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@gryffindor/client": path.resolve(__dirname, "./src"),
    },
  },
});
