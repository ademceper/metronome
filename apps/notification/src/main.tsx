import '@novu/maily-core/style.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { bootstrapOidc, OidcInitializationErrorGate, OidcInitializationGate } from '@/auth-client';
import { FeatureFlagsProvider } from './context/feature-flags-provider';
import { routeTree } from './routeTree.gen';
import { initializeSentry } from './utils/sentry';
import { overrideZodErrorMap } from './utils/validation';

// Surface any uncaught runtime error to the DOM so we don't get silent white screens.
function showFatalError(label: string, err: unknown) {
  const root = document.getElementById('root');
  if (!root) return;
  const msg = err instanceof Error ? `${err.message}\n\n${err.stack ?? ''}` : String(err);
  root.innerHTML = `
    <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 900px; margin: 0 auto;">
      <h2 style="color:#b91c1c; margin-top:0;">${label}</h2>
      <pre style="background:#fafafa; padding:12px; border:1px solid #eee; border-radius:6px; white-space:pre-wrap; word-break:break-word;">${msg.replace(/</g, '&lt;')}</pre>
    </div>`;
}
window.addEventListener('error', (e) => showFatalError('Uncaught error', e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => showFatalError('Unhandled promise rejection', e.reason));

try {
  bootstrapOidc({
    implementation: 'real',
    issuerUri: import.meta.env.VITE_OIDC_ISSUER_URI ?? 'http://localhost:8080/realms/tiko',
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID ?? 'notification-spa',
  });
} catch (err) {
  showFatalError('bootstrapOidc threw synchronously', err);
}

initializeSentry();
overrideZodErrorMap();

const router = createRouter({ routeTree, defaultPreload: false });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

const issuerUri = import.meta.env.VITE_OIDC_ISSUER_URI ?? 'http://localhost:8080/realms/tiko';

function OidcLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Signing you in via Keycloak…</h2>
        <p style={{ marginTop: 8, color: '#888', fontSize: 14 }}>{issuerUri}</p>
      </div>
    </div>
  );
}

function OidcError({
  oidcInitializationError,
}: {
  oidcInitializationError: { message?: string; isAuthServerLikelyDown?: boolean };
}) {
  const serverDown = oidcInitializationError.isAuthServerLikelyDown;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#b91c1c' }}>
          {serverDown ? 'Keycloak unreachable' : 'OIDC initialization failed'}
        </h2>
        <p style={{ marginTop: 12, color: '#444', lineHeight: 1.5 }}>
          {serverDown ? (
            <>
              The dashboard could not reach the OIDC server at <code>{issuerUri}</code>. Start it with{' '}
              <code>pnpm --filter auth dev</code> (docker) or <code>pnpm --filter auth dev:local</code> (native), then
              reload.
            </>
          ) : (
            <>{oidcInitializationError.message ?? 'Unknown error'}</>
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#f7f7f7',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <OidcInitializationErrorGate errorComponent={OidcError}>
      <OidcInitializationGate fallback={<OidcLoading />}>
        <FeatureFlagsProvider>
          <RouterProvider router={router} />
        </FeatureFlagsProvider>
      </OidcInitializationGate>
    </OidcInitializationErrorGate>
  </StrictMode>
);
