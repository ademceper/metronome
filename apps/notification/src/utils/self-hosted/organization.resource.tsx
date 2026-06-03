import React from 'react';
import { createContextHook } from '../context';

const MOCK_ORG_ID = '000000000000000000000001';

// Stable, module-level value — consumers read this via context, so reusing
// the same reference across renders breaks the re-render cascade that would
// otherwise loop EnvironmentProvider -> router navigation.
const STABLE_VALUE = {
  organization: {
    name: 'Local',
    createdAt: new Date(),
    updatedAt: new Date(),
    externalOrgId: MOCK_ORG_ID,
    publicMetadata: { externalOrgId: MOCK_ORG_ID },
    _id: MOCK_ORG_ID,
  },
  isLoaded: true,
};

export const OrganizationContext = React.createContext({});

export function OrganizationContextProvider({ children }: any) {
  return (
    <OrganizationContext.Provider value={STABLE_VALUE}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = createContextHook(OrganizationContext);
