import react from "@vitejs/plugin-react"
import { keycloakify } from "keycloakify/vite-plugin"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: "metronome",
      accountThemeImplementation: "none",
      keycloakifyBuildDirPath: "../../infrastructure/keycloak/providers",
      keycloakVersionTargets: {
        "22-to-25": false,
        "all-other-versions": true,
      },
    }),
  ],
})
