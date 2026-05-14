import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { keycloakify } from "keycloakify/vite-plugin"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "src/account/routes",
      generatedRouteTree: "src/account/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    keycloakify({
      themeName: "metronome",
      accountThemeImplementation: "Single-Page",
      keycloakifyBuildDirPath: "../../infrastructure/keycloak/providers",
      keycloakVersionTargets: {
        "22-to-25": false,
        "all-other-versions": true,
      },
      startKeycloakOptions: {
        realmJsonFilePath: "keycloak-realm.json",
      },
    }),
  ],
})
