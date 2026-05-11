/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/keys/key-providers/KeyProvidersPicker.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import { KEY_PROVIDER_TYPE } from "../../../util";


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

type KeyProvidersPickerProps = {
  onConfirm: (provider: string) => void;
  onClose: () => void;
};

export const KeyProvidersPicker = ({
  onConfirm,
  onClose,
}: KeyProvidersPickerProps) => {
  const { t } = useTranslation();
  const serverInfo = useServerInfo();
  const keyProviderComponentTypes =
    serverInfo.componentTypes?.[KEY_PROVIDER_TYPE] ?? [];
  return (
    <Modal variant="medium" title={t("addProvider")} isOpen onClose={onClose}>
      <DataList
        onSelectDataListItem={(_event, id) => {
          onConfirm(id);
        }}
        aria-label={t("addPredefinedMappers")}
        isCompact
      >
        {keyProviderComponentTypes.map((provider) => (
          <DataListItem
            aria-label={provider.id}
            key={provider.id}
            id={provider.id}
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell
                    key={`name-${provider.id}`}
                    data-testid={`option-${provider.id}`}
                  >
                    {provider.id}
                  </DataListCell>,
                  <DataListCell width={2} key={`helpText-${provider.helpText}`}>
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
