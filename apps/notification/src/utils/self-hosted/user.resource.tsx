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

export const UserContext = React.createContext<{
  user: SelfHostedUser | null;
  isLoaded: boolean;
}>({
  user: MOCK_USER,
  isLoaded: true,
});

export function UserContextProvider({ children }: any) {
  return (
    <UserContext.Provider value={{ user: MOCK_USER, isLoaded: true }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = createContextHook(UserContext);
