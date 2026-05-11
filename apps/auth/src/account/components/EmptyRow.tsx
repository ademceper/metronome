/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/datalist/EmptyRow.tsx" --revert
 */

type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <div
      className="px-4 py-3 text-center text-muted-foreground text-sm"
      {...props}
    >
      {message}
    </div>
  );
};
