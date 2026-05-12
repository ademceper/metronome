import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { bootstrapOidc, OidcInitializationGate } from "./auth"
import { ThemeProvider } from "./components/theme-provider"
import "./styles.css"

bootstrapOidc({
  implementation: "real",
  issuerUri:
    import.meta.env.VITE_OIDC_ISSUER_URI ?? "http://localhost:8080/realms/tiko",
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID ?? "admin-spa",
})

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element #root not found")
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <OidcInitializationGate>
        <App />
      </OidcInitializationGate>
    </ThemeProvider>
  </StrictMode>
)
