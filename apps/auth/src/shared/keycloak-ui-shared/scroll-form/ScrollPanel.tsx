/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

/* eslint-disable react/jsx-no-useless-fragment */
// See: https://github.com/i18next/react-i18next/issues/1543
import { HTMLProps } from "react";
import { FormTitle } from "./FormTitle";

type ScrollPanelProps = HTMLProps<HTMLFormElement> & {
  title: string;
  scrollId: string;
};

export const ScrollPanel = (props: ScrollPanelProps) => {
  const { title, children, scrollId, ...rest } = props;
  return (
    <section {...rest} style={{ marginTop: "var(--pf-v5-global--spacer--lg)" }}>
      <>
        <FormTitle id={scrollId} title={title} />
        {children}
      </>
    </section>
  );
};
