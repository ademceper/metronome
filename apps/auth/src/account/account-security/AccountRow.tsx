/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/AccountRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  IconMapper,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { LinkSimple as LinkIcon, LinkBreak as UnlinkIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";

import { unLinkAccount } from "../api/methods";
import { LinkedAccountRepresentation } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const DataListAction = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const DataListCell = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);
const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemCells = ({ dataListCells, ...props }: any) => (
  <div className="flex flex-1 items-center gap-2" {...props}>{dataListCells}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);
const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);

type AccountRowProps = {
  account: LinkedAccountRepresentation;
  isLinked?: boolean;
  refresh: () => void;
};

export const AccountRow = ({
  account,
  isLinked = false,
  refresh,
}: AccountRowProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;
  const { addAlert, addError } = useAccountAlerts();

  const unLink = async (account: LinkedAccountRepresentation) => {
    try {
      await unLinkAccount(context, account);
      addAlert(t("unLinkSuccess"));
      refresh();
    } catch (error) {
      addError("unLinkError", error);
    }
  };

  return (
    <DataListItem
      id={`${account.providerAlias}-idp`}
      key={account.providerName}
      aria-label={t("linkedAccounts")}
    >
      <DataListItemRow
        key={account.providerName}
        data-testid={`linked-accounts/${account.providerName}`}
      >
        <DataListItemCells
          dataListCells={[
            <DataListCell key="idp">
              <Split>
                <SplitItem className="pf-v5-u-mr-sm">
                  <IconMapper icon={account.providerName} />
                </SplitItem>
                <SplitItem className="pf-v5-u-my-xs" isFilled>
                  <span id={`${account.providerAlias}-idp-name`}>
                    {label(t, account.displayName)}
                  </span>
                </SplitItem>
              </Split>
            </DataListCell>,
            <DataListCell key="label">
              <Split>
                <SplitItem className="pf-v5-u-my-xs" isFilled>
                  <span id={`${account.providerAlias}-idp-label`}>
                    <Label color={account.social ? "blue" : "green"}>
                      {t(account.social ? "socialLogin" : "systemDefined")}
                    </Label>
                  </span>
                </SplitItem>
              </Split>
            </DataListCell>,
            <DataListCell key="username" width={5}>
              <Split>
                <SplitItem className="pf-v5-u-my-xs" isFilled>
                  <span id={`${account.providerAlias}-idp-username`}>
                    {account.linkedUsername}
                  </span>
                </SplitItem>
              </Split>
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-labelledby={t("link")}
          aria-label={t("unLink")}
          id="setPasswordAction"
        >
          {isLinked && (
            <Button
              id={`${account.providerAlias}-idp-unlink`}
              variant="link"
              onClick={() => unLink(account)}
            >
              <Icon size="sm">
                <UnlinkIcon />
              </Icon>{" "}
              {t("unLink")}
            </Button>
          )}
          {!isLinked && (
            <Button
              id={`${account.providerAlias}-idp-link`}
              variant="link"
              onClick={async () => {
                await login({
                  action: "idp_link:" + account.providerAlias,
                });
              }}
            >
              <Icon size="sm">
                <LinkIcon />
              </Icon>{" "}
              {t("link")}
            </Button>
          )}
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};
