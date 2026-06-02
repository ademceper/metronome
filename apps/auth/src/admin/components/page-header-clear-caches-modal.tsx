/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/PageHeaderClearCachesModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useRealm } from "../context/realm-context/realm-context";
import { useAdminClient } from "../admin-client";
import { useTranslation } from "react-i18next";
import { HelpItem, useAlerts } from "../../shared/keycloak-ui-shared";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const List = ({ variant, children, className, ...props }: any) => (
  <ul className={cn("space-y-1 text-sm", variant === "inline" ? "flex flex-wrap gap-2" : "list-disc pl-5", className)} {...props}>
    {children}
  </ul>
);
const ListItem = ({ children, ...props }: any) => <li {...props}>{children}</li>;
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

export type ClearCachesModalProps = {
  onClose: () => void;
};
export const PageHeaderClearCachesModal = ({
  onClose,
}: ClearCachesModalProps) => {
  const { realm: realmName } = useRealm();
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const { addError, addAlert } = useAlerts();

  const clearCache =
    (clearCacheFn: typeof adminClient.cache.clearRealmCache) =>
    async (realm: string) => {
      try {
        await clearCacheFn({ realm });
        addAlert(t("clearCacheSuccess"), AlertVariant.success);
      } catch (error) {
        addError("clearCacheError", error);
      }
    };
  const clearRealmCache = clearCache(adminClient.cache.clearRealmCache);
  const clearUserCache = clearCache(adminClient.cache.clearUserCache);
  const clearKeysCache = clearCache(adminClient.cache.clearKeysCache);
  const clearCrlCache = clearCache(adminClient.cache.clearCrlCache);

  return (
    <Modal
      title={t("clearCachesTitle")}
      variant={ModalVariant.small}
      isOpen
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
    >
      <List isPlain isBordered>
        <ListItem>
          <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
            <FlexItem>
              {t("realmCache")}{" "}
              <HelpItem
                helpText={t("clearRealmCacheHelp")}
                fieldLabelId="clearRealmCacheHelp"
              />
            </FlexItem>
            <FlexItem>
              <Button onClick={() => clearRealmCache(realmName)}>
                {t("clearButtonTitle")}
              </Button>
            </FlexItem>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
            <FlexItem>
              {t("userCache")}{" "}
              <HelpItem
                helpText={t("clearUserCacheHelp")}
                fieldLabelId="clearUserCacheHelp"
              />
            </FlexItem>
            <FlexItem>
              <Button onClick={() => clearUserCache(realmName)}>
                {t("clearButtonTitle")}
              </Button>
            </FlexItem>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
            <FlexItem>
              {t("keysCache")}{" "}
              <HelpItem
                helpText={t("clearKeysCacheHelp")}
                fieldLabelId="clearKeysCacheHelp"
              />
            </FlexItem>
            <FlexItem>
              <Button onClick={() => clearKeysCache(realmName)}>
                {t("clearButtonTitle")}
              </Button>
            </FlexItem>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
            <FlexItem>
              {t("crlCache")}{" "}
              <HelpItem
                helpText={t("clearCrlCacheHelp")}
                fieldLabelId="clearCrlCacheHelp"
              />
            </FlexItem>
            <FlexItem>
              <Button onClick={() => clearCrlCache(realmName)}>
                {t("clearButtonTitle")}
              </Button>
            </FlexItem>
          </Flex>
        </ListItem>
      </List>
    </Modal>
  );
};
