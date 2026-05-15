import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { oidcSpa } from "oidc-spa/vite-plugin"
import { defineConfig, type PluginOption } from "vite"

// Workspace has both vite@5 (auth, via @storybook/react-vite) and vite@6
// (this app, notification). Some plugin types resolve through vite@5 in
// pnpm's hoisted tree, so we cast the plugins array to PluginOption[] to
// avoid the cross-version Plugin<any> mismatch.
const plugins = [
  tanstackRouter({
    routesDirectory: "src/routes",
    generatedRouteTree: "src/routeTree.gen.ts",
    autoCodeSplitting: true,
  }),
  oidcSpa(),
  react(),
  tailwindcss(),
] as PluginOption[]

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
