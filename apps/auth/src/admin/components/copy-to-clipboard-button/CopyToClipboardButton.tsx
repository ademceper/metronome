/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/copy-to-clipboard-button/CopyToClipboardButton.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useSetTimeout } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import useQueryPermission from "../../utils/use-query-permission";


const ClipboardCopyButton = ({ onClick, textId, children, ...props }: any) => (
  <UIButton type="button" variant="outline" onClick={onClick} {...props}>{children}</UIButton>
);
type ClipboardCopyButtonProps = React.ComponentProps<typeof ClipboardCopyButton>;

enum CopyState {
  Ready,
  Copied,
  Error,
}

type CopyToClipboardButtonProps = Pick<ClipboardCopyButtonProps, "variant"> & {
  id: string;
  label: string;
  text: string;
};

export const CopyToClipboardButton = ({
  id,
  label,
  text,
  variant = "plain",
}: CopyToClipboardButtonProps) => {
  const { t } = useTranslation();
  const setTimeout = useSetTimeout();
  const permission = useQueryPermission("clipboard-write" as PermissionName);
  const permissionDenied = permission?.state === "denied";
  const [copyState, setCopyState] = useState(CopyState.Ready);

  // Determine the message to use for the copy button.
  const copyMessageKey = useMemo(() => {
    if (permissionDenied) {
      return "clipboardCopyDenied";
    }

    switch (copyState) {
      case CopyState.Ready:
        return "copyToClipboard";
      case CopyState.Copied:
        return "copySuccess";
      case CopyState.Error:
        return "clipboardCopyError";
    }
  }, [permissionDenied, copyState]);

  // Reset the message of the copy button after copying to the clipboard.
  useEffect(() => {
    if (copyState !== CopyState.Ready) {
      return setTimeout(() => setCopyState(CopyState.Ready), 1000);
    }
  }, [copyState, setTimeout]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(CopyState.Copied);
    } catch {
      setCopyState(CopyState.Error);
    }
  };

  return (
    <ClipboardCopyButton
      id={`copy-button-${id}`}
      textId={label}
      aria-label={t("copyToClipboard")}
      onClick={() => copyToClipboard(text)}
      exitDelay={600}
      variant={variant}
    >
      {t(copyMessageKey)}
    </ClipboardCopyButton>
  );
};
