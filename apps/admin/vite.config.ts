import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { oidcSpa } from "oidc-spa/vite-plugin"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [oidcSpa(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
