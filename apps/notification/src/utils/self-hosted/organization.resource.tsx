import React from 'react';
import { createContextHook } from '../context';

const MOCK_ORG_ID = '000000000000000000000001';

export const OrganizationContext = React.createContext({});

export function OrganizationContextProvider({ children }: any) {
  const value = {
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

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export const useOrganization = createContextHook(OrganizationContext);
