/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/keys/KeysListTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import type { KeyMetadataRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/keyMetadataRepresentation";
import { KeycloakSelect, SelectVariant, useFetch } from "../../../../shared/keycloak-ui-shared";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { Button as UIButton } from "@metronome/ui/components/button";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { Funnel as FilterIcon } from "@phosphor-icons/react"
const cellWidth = (_n: number) => () => ({ className: '' });
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { useRealm } from "../../../context/realm-context/realm-context";
import { emptyFormatter } from "../../../util";
import useFormatDate from "../../../utils/use-format-date";
import useToggle from "../../../utils/use-toggle";
import { toKeysTab } from "../../../lib/realm-settings";
import { SelectOption } from "../../../../shared/pf-compat"

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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

const FILTER_OPTIONS = ["ACTIVE", "PASSIVE", "DISABLED"] as const;

type FilterType = (typeof FILTER_OPTIONS)[number];

type KeyData = KeyMetadataRepresentation & {
  provider?: string;
};

type KeysListTabProps = {
  realmComponents: ComponentRepresentation[];
};

type SelectFilterProps = {
  onFilter: (filter: FilterType) => void;
};

const SelectFilter = ({ onFilter }: SelectFilterProps) => {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState<FilterType>(FILTER_OPTIONS[0]);

  const [filterDropdownOpen, toggleFilter] = useToggle();
  return (
    <KeycloakSelect
      width={300}
      data-testid="filter-type-select"
      isOpen={filterDropdownOpen}
      className="kc-filter-type-select"
      variant={SelectVariant.single}
      onToggle={toggleFilter}
      toggleIcon={<FilterIcon />}
      onSelect={(value) => {
        const filter =
          FILTER_OPTIONS.find((o) => o === value.toString()) ||
          FILTER_OPTIONS[0];
        setFilterType(filter);
        onFilter(filter);
        toggleFilter();
      }}
      selections={filterType}
      aria-label={t("selectFilterType")}
    >
      {FILTER_OPTIONS.map((option) => (
        <SelectOption
          key={option}
          data-testid={`${option}-option`}
          value={option}
        >
          {t(`keysFilter.${option}`)}
        </SelectOption>
      ))}
    </KeycloakSelect>
  );
};

export const KeysListTab = ({ realmComponents }: KeysListTabProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const formatDate = useFormatDate();

  const [publicKey, setPublicKey] = useState("");
  const [certificate, setCertificate] = useState("");

  const { realm } = useRealm();

  const [keyData, setKeyData] = useState<KeyData[]>([]);

  const [filter, setFilter] = useState<string>(FILTER_OPTIONS[0]);

  const filteredKeyData = useMemo(
    () => keyData?.filter(({ status }) => status === filter),
    [keyData, filter],
  );

  useFetch(
    async () => {
      const keysMetaData = await adminClient.realms.getKeys({ realm });
      return keysMetaData.keys?.map((key) => {
        const provider = realmComponents.find(
          (component: ComponentRepresentation) =>
            component.id === key.providerId,
        );
        return { ...key, provider: provider?.name } as KeyData;
      })!;
    },
    setKeyData,
    [],
  );

  const [togglePublicKeyDialog, PublicKeyDialog] = useConfirmDialog({
    titleKey: t("publicKey"),
    messageKey: publicKey,
    continueButtonLabel: "close",
    continueButtonVariant: ButtonVariant.primary,
    onConfirm: () => Promise.resolve(),
  });

  const [toggleCertificateDialog, CertificateDialog] = useConfirmDialog({
    titleKey: t("certificate"),
    messageKey: certificate,
    continueButtonLabel: "close",
    continueButtonVariant: ButtonVariant.primary,
    onConfirm: () => Promise.resolve(),
  });

  if (!keyData) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection variant="light" padding={{ default: "noPadding" }}>
      <PublicKeyDialog />
      <CertificateDialog />
      <DataTable
        t={t}
        isNotCompact
        className="kc-keys-list"
        loader={filteredKeyData}
        ariaLabelKey="keysList"
        searchPlaceholderKey="searchKey"
        searchTypeComponent={
          <SelectFilter onFilter={(filterType) => setFilter(filterType)} />
        }
        columns={[
          {
            name: "algorithm",
            displayKey: "algorithm",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(15)],
          },
          {
            name: "type",
            displayKey: "type",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(10)],
          },
          {
            name: "kid",
            displayKey: "kid",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(10)],
          },
          {
            name: "use",
            displayKey: "use",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(10)],
          },
          {
            name: "provider",
            displayKey: "provider",
            cellRenderer: ({ provider }: KeyData) => provider || "-",
            transforms: [cellWidth(10)],
          },
          {
            name: "validTo",
            displayKey: "validTo",
            cellRenderer: ({ validTo }: KeyData) =>
              validTo ? formatDate(new Date(validTo)) : "-",
            transforms: [cellWidth(10)],
          },
          {
            name: "publicKeys",
            displayKey: "publicKeys",
            cellRenderer: ({ publicKey, certificate }: KeyData) => {
              if (certificate) {
                return (
                  <div className="button-wrapper">
                    <Button
                      onClick={() => {
                        togglePublicKeyDialog();
                        setPublicKey(publicKey!);
                      }}
                      variant="secondary"
                      id={publicKey}
                    >
                      {t("publicKey")}
                    </Button>
                    <Button
                      onClick={() => {
                        toggleCertificateDialog();
                        setCertificate(certificate!);
                      }}
                      variant="secondary"
                      id={certificate}
                      className="kc-certificate"
                    >
                      {t("certificate")}
                    </Button>
                  </div>
                );
              } else if (publicKey) {
                return (
                  <Button
                    onClick={() => {
                      togglePublicKeyDialog();
                      setPublicKey(publicKey!);
                    }}
                    variant="secondary"
                    id="kc-public-key"
                  >
                    {t("publicKey")}
                  </Button>
                );
              } else return "";
            },
            transforms: [cellWidth(20)],
          },
        ]}
        isSearching={!!filteredKeyData}
        emptyState={
          <ListEmptyState
            hasIcon
            message={t("noKeys")}
            instructions={t("noKeysDescription")}
            primaryActionText={t("addProvider")}
            onPrimaryAction={() =>
              navigate(toKeysTab({ realm, tab: "providers" }))
            }
          />
        }
      />
    </PageSection>
  );
};
