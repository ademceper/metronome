import React from 'react';
import { useOidc } from '@/auth-client';
import { createContextHook } from '../context';
import { SelfHostedUser } from './user.types';

type KeycloakClaims = {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
};

function claimsToUser(claims: KeycloakClaims): SelfHostedUser {
  return {
    update: async () => null,
    reload: async () => null,
    externalId: claims.sub ?? 'unknown',
    firstName: claims.given_name ?? claims.preferred_username ?? 'User',
    lastName: claims.family_name ?? '',
    emailAddresses: [{ emailAddress: claims.email ?? 'unknown@local' }],
    createdAt: new Date(),
    publicMetadata: { newDashboardOptInStatus: 'opted_in' },
    unsafeMetadata: { newDashboardOptInStatus: 'opted_in' },
    organizationMemberships: [{}],
    passwordEnabled: true,
  };
}

export const UserContext = React.createContext<{
  user: SelfHostedUser | null;
  isLoaded: boolean;
}>({
  user: null,
  isLoaded: false,
});

export function UserContextProvider({ children }: any) {
  const oidc = useOidc();
  const user = oidc.isUserLoggedIn
    ? claimsToUser(oidc.decodedIdToken as KeycloakClaims)
    : null;

  return (
    <UserContext.Provider value={{ user, isLoaded: !!user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = createContextHook(UserContext);
