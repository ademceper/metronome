/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/PartialImport.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type {
  PartialImportRealmRepresentation,
  PartialImportResponse,
  PartialImportResult,
} from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { KeycloakSelect } from "../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { JsonFileUpload } from "../json-file-upload/json-file-upload";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { useRealm } from "../../context/realm-context/realm-context";
import { SelectOption } from "../../../shared/pf-compat"


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
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
const Divider = (props: any) => <UISeparator {...props} />;
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
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
const Stack = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const StackItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

export type PartialImportProps = {
  open: boolean;
  toggleDialog: () => void;
};

// An imported JSON file can either be an array of realm objects
// or a single realm object.
type ImportedMultiRealm = RealmRepresentation | RealmRepresentation[];

type NonRoleResource = "users" | "clients" | "groups" | "identityProviders";
type RoleResource = "realmRoles" | "clientRoles";
type Resource = NonRoleResource | RoleResource;

type CollisionOption = "FAIL" | "SKIP" | "OVERWRITE";

type ResourceChecked = { [k in Resource]: boolean };

const INITIAL_RESOURCES: Readonly<ResourceChecked> = {
  users: false,
  clients: false,
  groups: false,
  identityProviders: false,
  realmRoles: false,
  clientRoles: false,
};

export const PartialImportDialog = (props: PartialImportProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();

  const [importedFile, setImportedFile] = useState<ImportedMultiRealm>();
  const isFileSelected = !!importedFile;
  const [isRealmSelectOpen, setIsRealmSelectOpen] = useState(false);
  const [isCollisionSelectOpen, setIsCollisionSelectOpen] = useState(false);
  const [importInProgress, setImportInProgress] = useState(false);
  const [collisionOption, setCollisionOption] =
    useState<CollisionOption>("FAIL");
  const [targetRealm, setTargetRealm] = useState<RealmRepresentation>({});
  const [importResponse, setImportResponse] = useState<PartialImportResponse>();
  const { addError } = useAlerts();

  const [resourcesToImport, setResourcesToImport] = useState(INITIAL_RESOURCES);
  const isAnyResourceChecked = Object.values(resourcesToImport).some(
    (checked) => checked,
  );

  const resetResourcesToImport = () => {
    setResourcesToImport(INITIAL_RESOURCES);
  };

  const resetInputState = () => {
    setImportedFile(undefined);
    setTargetRealm({});
    setCollisionOption("FAIL");
    resetResourcesToImport();
  };

  // when dialog opens or closes, clear state
  useEffect(() => {
    setImportInProgress(false);
    setImportResponse(undefined);
    resetInputState();
  }, [props.open]);

  const handleFileChange = (value: ImportedMultiRealm) => {
    resetInputState();
    setImportedFile(value);

    if (!Array.isArray(value)) {
      setTargetRealm(value);
    } else if (value.length > 0) {
      setTargetRealm(value[0]);
    }
  };

  const handleRealmSelect = (realm: string | number | object) => {
    setTargetRealm(realm as RealmRepresentation);
    setIsRealmSelectOpen(false);
    resetResourcesToImport();
  };

  const handleResourceCheckBox = (
    checked: boolean,
    event: FormEvent<HTMLInputElement>,
  ) => {
    const resource = event.currentTarget.name as Resource;

    setResourcesToImport({
      ...resourcesToImport,
      [resource]: checked,
    });
  };

  const realmSelectOptions = (realms: RealmRepresentation[]) =>
    realms.map((realm) => (
      <SelectOption
        key={realm.id}
        value={realm}
        data-testid={realm.id + "-select-option"}
      >
        {realm.realm || realm.id}
      </SelectOption>
    ));

  const handleCollisionSelect = (option: string | number | object) => {
    setCollisionOption(option as CollisionOption);
    setIsCollisionSelectOpen(false);
  };

  const collisionOptions = () => {
    return [
      <SelectOption key="fail" value="FAIL">
        {t("FAIL")}
      </SelectOption>,
      <SelectOption key="skip" value="SKIP">
        {t("SKIP")}
      </SelectOption>,
      <SelectOption key="overwrite" value="OVERWRITE">
        {t("OVERWRITE")}
      </SelectOption>,
    ];
  };

  const targetHasResources = () => {
    return (
      targetHasResource("users") ||
      targetHasResource("groups") ||
      targetHasResource("clients") ||
      targetHasResource("identityProviders") ||
      targetHasRealmRoles() ||
      targetHasClientRoles()
    );
  };

  const targetHasResource = (resource: NonRoleResource) => {
    const value = targetRealm[resource];
    return value !== undefined && value.length > 0;
  };

  const targetHasRealmRoles = () => {
    const value = targetRealm.roles?.realm;
    return value !== undefined && value.length > 0;
  };

  const targetHasClientRoles = () => {
    const value = targetRealm.roles?.client;
    return value !== undefined && Object.keys(value).length > 0;
  };

  const itemCount = (resource: Resource) => {
    if (!isFileSelected) return 0;

    if (resource === "realmRoles") {
      return targetRealm.roles?.realm?.length ?? 0;
    }

    if (resource === "clientRoles") {
      return targetHasClientRoles()
        ? clientRolesCount(targetRealm.roles!.client!)
        : 0;
    }

    return targetRealm[resource]?.length ?? 0;
  };

  const clientRolesCount = (
    clientRoles: Record<string, RoleRepresentation[]>,
  ) =>
    Object.values(clientRoles).reduce((total, role) => total + role.length, 0);

  const resourceDataListItem = (
    resource: Resource,
    resourceDisplayName: string,
  ) => {
    return (
      <DataListItem aria-labelledby={`${resource}-list-item`}>
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key={resource}>
                <Checkbox
                  id={`${resource}-checkbox`}
                  label={`${itemCount(resource)} ${resourceDisplayName}`}
                  aria-labelledby={`${resource}-checkbox`}
                  name={resource}
                  isChecked={resourcesToImport[resource]}
                  onChange={(event, checked: boolean) =>
                    handleResourceCheckBox(checked, event)
                  }
                  data-testid={resource + "-checkbox"}
                />
              </DataListCell>,
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    );
  };

  const jsonForImport = () => {
    const jsonToImport: PartialImportRealmRepresentation = {
      ifResourceExists: collisionOption,
      id: targetRealm.id,
      realm: targetRealm.realm,
    };

    if (resourcesToImport["users"]) jsonToImport.users = targetRealm.users;
    if (resourcesToImport["groups"]) jsonToImport.groups = targetRealm.groups;
    if (resourcesToImport["identityProviders"])
      jsonToImport.identityProviders = targetRealm.identityProviders;
    if (resourcesToImport["clients"])
      jsonToImport.clients = targetRealm.clients;
    if (resourcesToImport["realmRoles"] || resourcesToImport["clientRoles"]) {
      jsonToImport.roles = targetRealm.roles;
      if (!resourcesToImport["realmRoles"]) delete jsonToImport.roles?.realm;
      if (!resourcesToImport["clientRoles"]) delete jsonToImport.roles?.client;
    }
    return jsonToImport;
  };

  async function doImport() {
    if (importInProgress) return;

    setImportInProgress(true);

    try {
      const importResults = await adminClient.realms.partialImport({
        realm,
        rep: jsonForImport(),
      });
      setImportResponse(importResults);
    } catch (error) {
      addError("importFail", error);
    }

    setImportInProgress(false);
  }

  const importModal = () => {
    return (
      <Modal
        variant={ModalVariant.medium}
        title={t("partialImport")}
        isOpen={props.open}
        onClose={props.toggleDialog}
        actions={[
          <Button
            id="modal-import"
            data-testid="confirm"
            key="import"
            isDisabled={!isAnyResourceChecked}
            onClick={async () => {
              await doImport();
            }}
          >
            {t("import")}
          </Button>,
          <Button
            id="modal-cancel"
            data-testid="cancel"
            key="cancel"
            variant={ButtonVariant.link}
            onClick={() => {
              props.toggleDialog();
            }}
          >
            {t("cancel")}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Text>{t("partialImportHeaderText")}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <JsonFileUpload
              id="partial-import-file"
              allowEditingUploadedText
              onChange={handleFileChange}
            />
          </StackItem>

          {isFileSelected && targetHasResources() && (
            <>
              <StackItem>
                <Divider />
              </StackItem>
              {Array.isArray(importedFile) && importedFile.length > 1 && (
                <StackItem>
                  <Text>{t("selectRealm")}:</Text>
                  <KeycloakSelect
                    toggleId="realm-selector"
                    isOpen={isRealmSelectOpen}
                    typeAheadAriaLabel={t("realmSelector")}
                    aria-label={t("realmSelector")}
                    onToggle={() => setIsRealmSelectOpen(!isRealmSelectOpen)}
                    selections={targetRealm.id}
                    onSelect={(value) => handleRealmSelect(value)}
                    placeholderText={targetRealm.realm || targetRealm.id}
                  >
                    {realmSelectOptions(importedFile)}
                  </KeycloakSelect>
                </StackItem>
              )}
              <StackItem>
                <Text>{t("chooseResources")}:</Text>
                <DataList aria-label={t("resourcesToImport")} isCompact>
                  {targetHasResource("users") &&
                    resourceDataListItem("users", t("users"))}
                  {targetHasResource("groups") &&
                    resourceDataListItem("groups", t("groups"))}
                  {targetHasResource("clients") &&
                    resourceDataListItem("clients", t("clients"))}
                  {targetHasResource("identityProviders") &&
                    resourceDataListItem(
                      "identityProviders",
                      t("identityProviders"),
                    )}
                  {targetHasRealmRoles() &&
                    resourceDataListItem("realmRoles", t("realmRoles"))}
                  {targetHasClientRoles() &&
                    resourceDataListItem("clientRoles", t("clientRoles"))}
                </DataList>
              </StackItem>
              <StackItem>
                <Text>{t("selectIfResourceExists")}:</Text>
                <KeycloakSelect
                  isOpen={isCollisionSelectOpen}
                  direction="up"
                  onToggle={() => {
                    setIsCollisionSelectOpen(!isCollisionSelectOpen);
                  }}
                  selections={collisionOption}
                  onSelect={handleCollisionSelect}
                  placeholderText={t(collisionOption)}
                >
                  {collisionOptions()}
                </KeycloakSelect>
              </StackItem>
            </>
          )}
        </Stack>
      </Modal>
    );
  };

  const importCompleteMessage = () => {
    return `${t("importAdded", {
      count: importResponse?.added,
    })}  ${t("importSkipped", {
      count: importResponse?.skipped,
    })} ${t("importOverwritten", {
      count: importResponse?.overwritten,
    })}`;
  };

  const loader = async (first = 0, max = 15) => {
    if (!importResponse) {
      return [];
    }

    const last = Math.min(first + max, importResponse.results.length);

    return importResponse.results.slice(first, last);
  };

  const ActionLabel = (importRecord: PartialImportResult) => {
    switch (importRecord.action) {
      case "ADDED":
        return (
          <Label key={importRecord.id} color="green">
            {t("added")}
          </Label>
        );
      case "SKIPPED":
        return (
          <Label key={importRecord.id} color="orange">
            {t("skipped")}
          </Label>
        );
      case "OVERWRITTEN":
        return (
          <Label key={importRecord.id} color="purple">
            {t("overwritten")}
          </Label>
        );
      default:
        return "";
    }
  };

  const TypeRenderer = (importRecord: PartialImportResult) => {
    const typeMap = new Map([
      ["CLIENT", t("clients")],
      ["REALM_ROLE", t("realmRoles")],
      ["USER", t("users")],
      ["CLIENT_ROLE", t("clientRoles")],
      ["IDP", t("identityProviders")],
      ["GROUP", t("groups")],
    ]);

    return <span>{typeMap.get(importRecord.resourceType)}</span>;
  };

  const importCompletedModal = () => {
    return (
      <Modal
        variant={ModalVariant.medium}
        title={t("partialImport")}
        isOpen={props.open}
        onClose={props.toggleDialog}
        actions={[
          <Button
            id="modal-close"
            data-testid="close-button"
            key="close"
            variant={ButtonVariant.primary}
            onClick={() => {
              props.toggleDialog();
            }}
          >
            {t("close")}
          </Button>,
        ]}
      >
        <Alert
          variant="success"
          component="p"
          isInline
          title={importCompleteMessage()}
        />
        <DataTable
          t={t}
          loader={loader}
          isPaginated
          ariaLabelKey="partialImport"
          columns={[
            {
              name: "action",
              displayKey: "action",
              cellRenderer: ActionLabel,
            },
            {
              name: "resourceType",
              displayKey: "type",
              cellRenderer: TypeRenderer,
            },
            {
              name: "resourceName",
              displayKey: "name",
            },
            {
              name: "id",
              displayKey: "id",
            },
          ]}
        />
      </Modal>
    );
  };

  if (!importResponse) {
    return importModal();
  }

  return importCompletedModal();
};
