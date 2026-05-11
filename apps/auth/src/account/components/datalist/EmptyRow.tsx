/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/datalist/EmptyRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";

const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);
const DataListItemCells = ({ dataListCells, ...props }: any) => (
  <div className="flex flex-1 items-center gap-2" {...props}>{dataListCells}</div>
);
const DataListCell = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);

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
