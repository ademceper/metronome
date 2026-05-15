/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/registration/AddProviderDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import useLocaleSort, { mapByKey } from "../../../utils/useLocaleSort";


const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
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

type AddProviderDialogProps = {
  onConfirm: (providerId: string) => void;
  toggleDialog: () => void;
};

export const AddProviderDialog = ({
  onConfirm,
  toggleDialog,
}: AddProviderDialogProps) => {
  const { t } = useTranslation();
  const serverInfo = useServerInfo();
  const providers = Object.keys(
    serverInfo.providers?.["client-registration-policy"].providers || [],
  );

  const descriptions =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy"
    ];
  const localeSort = useLocaleSort();

  const rows = useMemo(
    () =>
      localeSort(
        descriptions?.filter((d) => providers.includes(d.id)) || [],
        mapByKey("id"),
      ),
    [providers, descriptions],
  );
  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("chooseAPolicyProvider")}
      isOpen
      onClose={toggleDialog}
    >
      <DataList
        onSelectDataListItem={(_event, id) => {
          onConfirm(id);
          toggleDialog();
        }}
        aria-label={t("addPredefinedMappers")}
        isCompact
      >
        <DataListItem aria-label={t("headerName")} id="header">
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[t("name"), t("description")].map((name) => (
                <DataListCell style={{ fontWeight: 700 }} key={name}>
                  {name}
                </DataListCell>
              ))}
            />
          </DataListItemRow>
        </DataListItem>
        {rows.map((provider) => (
          <DataListItem
            aria-label={provider.id}
            key={provider.id}
            data-testid={provider.id}
            id={provider.id}
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={2} key={`name-${provider.id}`}>
                    {provider.id}
                  </DataListCell>,
                  <DataListCell width={4} key={`description-${provider.id}`}>
                    {provider.helpText}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    </Modal>
  );
};
