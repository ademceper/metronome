import { ClerkProvider as _ClerkProvider } from '@/utils/self-hosted';
import { PropsWithChildren } from 'react';

type EEAuthProviderProps = PropsWithChildren;

// All real auth lives in Keycloak via oidc-spa (see auth-client.ts). This
// component is a passthrough that keeps the historical provider tree so the
// rest of the dashboard's Clerk-shaped imports keep resolving against the
// self-hosted shim in src/utils/self-hosted/.
export const EEAuthProvider = (props: EEAuthProviderProps) => {
  // @ts-expect-error self-hosted ClerkProvider has minimal props
  return <_ClerkProvider>{props.children}</_ClerkProvider>;
};

export { EEAuthProvider as ClerkProvider };
