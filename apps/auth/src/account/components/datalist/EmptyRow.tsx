/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/datalist/EmptyRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from "../../../shared/@patternfly/react-core";

type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <DataListItem className="pf-v5-u-align-items-center pf-p-b-0">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="0" {...props}>
              {message}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );
};
