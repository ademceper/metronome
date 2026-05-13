// vite.config.ts
import { tanstackRouter } from "file:///Users/ademceper/Desktop/metronome/node_modules/.pnpm/@tanstack+router-plugin@1.167.35_@tanstack+react-router@1.169.2_react-dom@19.2.4_react@19.2.4_ouexjszo374jhxshremfvyrqaa/node_modules/@tanstack/router-plugin/dist/esm/vite.js"
import react from "file:///Users/ademceper/Desktop/metronome/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@25.2.3_lightningcss@1.32.0_terser@5.47.1_/node_modules/@vitejs/plugin-react/dist/index.js"
import { keycloakify } from "file:///Users/ademceper/Desktop/metronome/node_modules/.pnpm/keycloakify@11.15.3/node_modules/keycloakify/vite-plugin/index.js"
import { defineConfig } from "file:///Users/ademceper/Desktop/metronome/node_modules/.pnpm/vite@5.4.21_@types+node@25.2.3_lightningcss@1.32.0_terser@5.47.1/node_modules/vite/dist/node/index.js"

var vite_config_default = defineConfig({
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
    }),
  ],
})

export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWRlbWNlcGVyL0Rlc2t0b3AvbWV0cm9ub21lL2FwcHMvYXV0aFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FkZW1jZXBlci9EZXNrdG9wL21ldHJvbm9tZS9hcHBzL2F1dGgvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FkZW1jZXBlci9EZXNrdG9wL21ldHJvbm9tZS9hcHBzL2F1dGgvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB0YW5zdGFja1JvdXRlciB9IGZyb20gXCJAdGFuc3RhY2svcm91dGVyLXBsdWdpbi92aXRlXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IHsga2V5Y2xvYWtpZnkgfSBmcm9tIFwia2V5Y2xvYWtpZnkvdml0ZS1wbHVnaW5cIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdGFuc3RhY2tSb3V0ZXIoe1xuICAgICAgcm91dGVzRGlyZWN0b3J5OiBcInNyYy9hY2NvdW50L3JvdXRlc1wiLFxuICAgICAgZ2VuZXJhdGVkUm91dGVUcmVlOiBcInNyYy9hY2NvdW50L3JvdXRlVHJlZS5nZW4udHNcIixcbiAgICAgIGF1dG9Db2RlU3BsaXR0aW5nOiB0cnVlLFxuICAgIH0pLFxuICAgIHJlYWN0KCksXG4gICAga2V5Y2xvYWtpZnkoe1xuICAgICAgdGhlbWVOYW1lOiBcIm1ldHJvbm9tZVwiLFxuICAgICAgYWNjb3VudFRoZW1lSW1wbGVtZW50YXRpb246IFwiU2luZ2xlLVBhZ2VcIixcbiAgICAgIGtleWNsb2FraWZ5QnVpbGREaXJQYXRoOiBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2tleWNsb2FrL3Byb3ZpZGVyc1wiLFxuICAgICAga2V5Y2xvYWtWZXJzaW9uVGFyZ2V0czoge1xuICAgICAgICBcIjIyLXRvLTI1XCI6IGZhbHNlLFxuICAgICAgICBcImFsbC1vdGhlci12ZXJzaW9uc1wiOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNULFNBQVMsc0JBQXNCO0FBQ3JWLE9BQU8sV0FBVztBQUNsQixTQUFTLG1CQUFtQjtBQUM1QixTQUFTLG9CQUFvQjtBQUU3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxlQUFlO0FBQUEsTUFDYixpQkFBaUI7QUFBQSxNQUNqQixvQkFBb0I7QUFBQSxNQUNwQixtQkFBbUI7QUFBQSxJQUNyQixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCw0QkFBNEI7QUFBQSxNQUM1Qix5QkFBeUI7QUFBQSxNQUN6Qix3QkFBd0I7QUFBQSxRQUN0QixZQUFZO0FBQUEsUUFDWixzQkFBc0I7QUFBQSxNQUN4QjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
