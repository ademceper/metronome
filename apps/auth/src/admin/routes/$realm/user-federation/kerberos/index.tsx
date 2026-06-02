// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react";
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import { useAlerts, useFetch } from "../../../../../shared/keycloak-ui-shared";
import { CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { Database as DatabaseIcon } from "@phosphor-icons/react"
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../admin-client";
import { useConfirmDialog } from "../../../../components/confirm-dialog/ConfirmDialog";
import { ClickableCard } from "../../../../components/keycloak-card/ClickableCard";
import { KeycloakCard } from "../../../../components/keycloak-card/KeycloakCard";
import { ViewHeader } from "../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../context/server-info/server-info-provider";
import helpUrls from "../../../../help-urls";
import { toUpperCase } from "../../../../util";
import { ManagePriorityDialog } from "../../../../components/user-federation/ManagePriorityDialog";
import { toCustomUserFederation } from "../../../../lib/user-federation";
import { toNewCustomUserFederation } from "../../../../lib/user-federation";
import { toUserFederationKerberos } from "../../../../lib/user-federation";
import { toUserFederationLdap } from "../../../../lib/user-federation";

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
const CardTitle = (props: any) => <UICardTitle {...props} />;
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const Gallery = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-3 sm:grid-cols-2 md:grid-cols-3", className)} {...props}>{children}</div>
);
const GalleryItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

function UserFederationSection() {
  const { adminClient } = useAdminClient();

  const [userFederations, setUserFederations] =
    useState<ComponentRepresentation[]>();
  const { addAlert, addError } = useAlerts();
  const { t } = useTranslation();
  const { realm, realmRepresentation } = useRealm();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const navigate = useNavigate();

  const [manageDisplayDialog, setManageDisplayDialog] = useState(false);

  const providers =
    useServerInfo().componentTypes?.[
      "org.keycloak.storage.UserStorageProvider"
    ] || [];

  useFetch(
    async () => {
      const testParams: { [name: string]: string | number } = {
        parentId: realmRepresentation!.id!,
        type: "org.keycloak.storage.UserStorageProvider",
      };
      return adminClient.components.find(testParams);
    },
    (userFederations) => {
      setUserFederations(userFederations);
    },
    [key],
  );

  const ufAddProviderDropdownItems = useMemo(
    () =>
      providers.map((p) => (
        <DropdownItem
          key={p.id}
          onClick={() =>
            navigate(toNewCustomUserFederation({ realm, providerId: p.id! }))
          }
        >
          {p.id.toUpperCase() == "LDAP"
            ? p.id.toUpperCase()
            : toUpperCase(p.id)}
        </DropdownItem>
      )),
    [],
  );

  const lowerButtonProps = {
    variant: "link",
    onClick: () => setManageDisplayDialog(true),
    lowerButtonTitle: t("managePriorities"),
  };

  let cards;

  const [currentCard, setCurrentCard] = useState("");
  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("userFedDeleteConfirmTitle"),
    messageKey: t("userFedDeleteConfirm"),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({ id: currentCard });
        refresh();
        addAlert(t("userFedDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addError("userFedDeleteError", error);
      }
    },
  });

  const toggleDeleteForCard = (id: string) => {
    setCurrentCard(id);
    toggleDeleteDialog();
  };

  const cardSorter = (card1: any, card2: any) => {
    const a = `${card1.name}`;
    const b = `${card2.name}`;
    return a < b ? -1 : 1;
  };

  const toDetails = (providerId: string, id: string) => {
    switch (providerId) {
      case "ldap":
        return toUserFederationLdap({ realm, id });
      case "kerberos":
        return toUserFederationKerberos({ realm, id });
      default:
        return toCustomUserFederation({ realm, providerId, id });
    }
  };

  if (userFederations) {
    cards = userFederations.sort(cardSorter).map((userFederation, index) => (
      <GalleryItem
        key={index}
        className="keycloak-admin--user-federation__gallery-item"
      >
        <KeycloakCard
          to={toDetails(userFederation.providerId!, userFederation.id!)}
          dropdownItems={[
            <DropdownItem
              key={`${index}-cardDelete`}
              onClick={() => {
                toggleDeleteForCard(userFederation.id!);
              }}
              data-testid="card-delete"
            >
              {t("delete")}
            </DropdownItem>,
          ]}
          title={userFederation.name!}
          footerText={toUpperCase(userFederation.providerId!)}
          labelText={
            userFederation.config?.["enabled"]?.[0] !== "false"
              ? t("enabled")
              : t("disabled")
          }
          labelColor={
            userFederation.config?.["enabled"]?.[0] !== "false"
              ? "blue"
              : "gray"
          }
        />
      </GalleryItem>
    ));
  }

  return (
    <>
      <DeleteConfirm />
      {manageDisplayDialog && userFederations && (
        <ManagePriorityDialog
          onClose={() => setManageDisplayDialog(false)}
          components={userFederations.filter((p) => p.config?.enabled)}
        />
      )}
      <ViewHeader
        titleKey="userFederation"
        subKey="userFederationExplain"
        helpUrl={helpUrls.userFederationUrl}
        {...(userFederations && userFederations.length > 0
          ? {
              lowerDropdownItems: ufAddProviderDropdownItems,
              lowerDropdownMenuTitle: "addNewProvider",
              lowerButton: lowerButtonProps,
            }
          : {})}
      />
      <PageSection>
        {userFederations && userFederations.length > 0 ? (
          <Gallery hasGutter>{cards}</Gallery>
        ) : (
          <>
            <TextContent>
              <Text component={TextVariants.p}>{t("getStarted")}</Text>
            </TextContent>
            <TextContent>
              <Text className="pf-v5-u-mt-lg" component={TextVariants.h2}>
                {t("add-providers")}
              </Text>
            </TextContent>
            <hr className="pf-v5-u-mb-lg" />
            <Gallery hasGutter>
              {providers.map((p) => (
                <ClickableCard
                  key={p.id}
                  onClick={() =>
                    navigate(
                      toNewCustomUserFederation({ realm, providerId: p.id! }),
                    )
                  }
                  data-testid={`${p.id}-card`}
                >
                  <CardTitle>
                    <Split hasGutter>
                      <SplitItem>
                        <Icon size="lg">
                          <DatabaseIcon />
                        </Icon>
                      </SplitItem>
                      <SplitItem isFilled>
                        {t("addProvider", {
                          provider: toUpperCase(p.id!),
                          count: 4,
                        })}
                      </SplitItem>
                    </Split>
                  </CardTitle>
                </ClickableCard>
              ))}
            </Gallery>
          </>
        )}
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/user-federation/kerberos/")({
  component: UserFederationSection,
})
