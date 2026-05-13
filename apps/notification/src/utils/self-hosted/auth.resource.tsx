import React from 'react';
import { createContextHook } from '../context';
import { SelfHostedUser } from './user.types';

const MOCK_USER: SelfHostedUser = {
  update: async () => null,
  reload: async () => null,
  externalId: 'local-user',
  firstName: 'Local',
  lastName: 'User',
  emailAddresses: [{ emailAddress: 'local@notification.dev' }],
  createdAt: new Date(),
  publicMetadata: { newDashboardOptInStatus: 'opted_in' },
  unsafeMetadata: { newDashboardOptInStatus: 'opted_in' },
  organizationMemberships: [{}],
  passwordEnabled: true,
};

export const AuthContext = React.createContext({});

export function AuthContextProvider({ children }: any) {
  const value = {
    currentUser: MOCK_USER,
    has: () => true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = createContextHook(AuthContext);
