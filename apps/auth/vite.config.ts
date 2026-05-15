import path from "node:path"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { keycloakify } from "keycloakify/vite-plugin"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      // Compat shim: the keycloak-admin vendor code under src/admin/ still
      // imports useNavigate/useParams/Link/etc. from react-router-dom v6.
      // Forward those imports to a single TanStack-backed wrapper so we
      // don't have to touch 241 vendor files. Only applies to admin —
      // src/account/ uses TanStack natively, src/shared/ has no router.
      "react-router-dom": path.resolve(
        __dirname,
        "./src/admin/lib/router/index.tsx"
      ),
    },
  },
  plugins: [
    tanstackRouter({
      routesDirectory: "src/account/routes",
      generatedRouteTree: "src/account/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    tanstackRouter({
      routesDirectory: "src/admin/routes",
      generatedRouteTree: "src/admin/routeTree.gen.ts",
      autoCodeSplitting: false,
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
