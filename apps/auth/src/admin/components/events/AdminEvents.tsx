/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/events/AdminEvents.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type AdminEventRepresentation from "@keycloak/keycloak-admin-client/lib/defs/adminEventRepresentation";
import { KeycloakSelect, SelectVariant, TextControl, useFetch } from "../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
const TableVariant = { compact: undefined, default: undefined } as any;
const cellWidth = (_n: number) => () => ({ className: '' });
import { pickBy } from "lodash-es";
import { PropsWithChildren, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { EventsBanners } from "../banners";
import DropdownPanel from "../dropdown-panel/DropdownPanel";
import CodeEditor from "../form/CodeEditor";
import { useRealm } from "../../context/realm-context/realm-context";
import { useServerInfo } from "../../context/server-info/server-info-provider";
import { prettyPrintJSON } from "../../util";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../../utils/use-format-date";
import { CellResourceLinkRenderer } from "./ResourceLinks";
import { SelectOption } from "../../../shared/pf-compat"

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
const DatePicker = ({ value, onChange, ...props }: any) => (
  <UIInput type="date" value={value ?? ""}
    onChange={(e: any) => onChange?.(e, e.target.value)} {...props} />
);
const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);
const DescriptionListDescription = ({ children, ...props }: any) => (
  <dd {...props}>{children}</dd>
);
const DescriptionListGroup = ({ children, className, ...props }: any) => (
  <div className={cn("contents", className)} {...props}>{children}</div>
);
const DescriptionListTerm = ({ children, ...props }: any) => (
  <dt className="font-medium text-muted-foreground" {...props}>{children}</dt>
);
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
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

type DisplayDialogProps = {
  titleKey: string;
  onClose: () => void;
};

type AdminEventSearchForm = {
  resourceTypes: string[];
  operationTypes: string[];
  resourcePath: string;
  dateFrom: string;
  dateTo: string;
  authClient: string;
  authUser: string;
  authRealm: string;
  authIpAddress: string;
};

const DisplayDialog = ({
  titleKey,
  onClose,
  children,
}: PropsWithChildren<DisplayDialogProps>) => {
  const { t } = useTranslation();
  return (
    <Modal
      variant={ModalVariant.medium}
      title={t(titleKey)}
      isOpen={true}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};

const DetailCell = (event: AdminEventRepresentation) => (
  <DescriptionList isHorizontal className="keycloak_eventsection_details">
    {event.details &&
      Object.entries(event.details).map(([key, value]) => (
        <DescriptionListGroup key={key}>
          <DescriptionListTerm>{key}</DescriptionListTerm>
          <DescriptionListDescription>{value}</DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    {event.error && (
      <DescriptionListGroup key="error">
        <DescriptionListTerm>error</DescriptionListTerm>
        <DescriptionListDescription>{event.error}</DescriptionListDescription>
      </DescriptionListGroup>
    )}
  </DescriptionList>
);

type AdminEventsProps = {
  resourcePath?: string;
};

export const AdminEvents = ({ resourcePath }: AdminEventsProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const formatDate = useFormatDate();
  const resourceTypes = serverInfo.enums?.["resourceType"];
  const operationTypes = serverInfo.enums?.["operationType"];

  const [key, setKey] = useState(0);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectResourceTypesOpen, setSelectResourceTypesOpen] = useState(false);
  const [selectOperationTypesOpen, setSelectOperationTypesOpen] =
    useState(false);
  const [activeFilters, setActiveFilters] = useState<
    Partial<AdminEventSearchForm>
  >({});

  const defaultValues: AdminEventSearchForm = {
    resourceTypes: [],
    operationTypes: [],
    resourcePath: resourcePath ? resourcePath : "",
    dateFrom: "",
    dateTo: "",
    authClient: "",
    authUser: "",
    authRealm: "",
    authIpAddress: "",
  };

  const [authEvent, setAuthEvent] = useState<AdminEventRepresentation>();
  const [adminEventsEnabled, setAdminEventsEnabled] = useState<boolean>();
  const [representationEvent, setRepresentationEvent] =
    useState<AdminEventRepresentation>();

  const filterLabels: Record<keyof AdminEventSearchForm, string> = {
    resourceTypes: t("resourceTypes"),
    operationTypes: t("operationTypes"),
    resourcePath: t("resourcePath"),
    dateFrom: t("dateFrom"),
    dateTo: t("dateTo"),
    authClient: t("client"),
    authUser: t("userId"),
    authRealm: t("realm"),
    authIpAddress: t("ipAddress"),
  };

  const form = useForm<AdminEventSearchForm>({
    mode: "onChange",
    defaultValues,
  });
  const {
    getValues,
    reset,
    formState: { isDirty },
    control,
  } = form;

  useFetch(
    () => adminClient.realms.getConfigEvents({ realm }),
    (events) => {
      setAdminEventsEnabled(events?.adminEventsEnabled!);
    },
    [],
  );

  function loader(first?: number, max?: number) {
    return adminClient.realms.findAdminEvents({
      resourcePath,
      // The admin client wants 'dateFrom' and 'dateTo' to be Date objects, however it cannot actually handle them so we need to cast to any.
      ...(activeFilters as any),
      realm,
      first,
      max,
    });
  }

  function submitSearch() {
    setSearchDropdownOpen(false);
    commitFilters();
  }

  function resetSearch() {
    reset();
    commitFilters();
  }

  function removeFilter(key: keyof AdminEventSearchForm) {
    const formValues: AdminEventSearchForm = { ...getValues() };
    delete formValues[key];

    reset({ ...defaultValues, ...formValues });
    commitFilters();
  }

  function removeFilterValue(
    key: keyof AdminEventSearchForm,
    valueToRemove: string,
  ) {
    const formValues = getValues();
    const fieldValue = formValues[key];
    const newFieldValue = Array.isArray(fieldValue)
      ? fieldValue.filter((val) => val !== valueToRemove)
      : fieldValue;

    reset({ ...formValues, [key]: newFieldValue });
    commitFilters();
  }

  function commitFilters() {
    const newFilters: Partial<AdminEventSearchForm> = pickBy(
      getValues(),
      (value) => value !== "" || (Array.isArray(value) && value.length > 0),
    );

    if (resourcePath) {
      delete newFilters.resourcePath;
    }

    setActiveFilters(newFilters);
    setKey(key + 1);
  }

  const code = useMemo(
    () =>
      representationEvent?.representation
        ? prettyPrintJSON(JSON.parse(representationEvent.representation))
        : "",
    [representationEvent?.representation],
  );

  return (
    <>
      {authEvent && (
        <DisplayDialog titleKey="auth" onClose={() => setAuthEvent(undefined)}>
          <Table
            aria-label="authData"
            data-testid="auth-dialog"
            variant={TableVariant.compact}
          >
            <Thead>
              <Tr>
                <Th>{t("attribute")}</Th>
                <Th>{t("value")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{t("realm")}</Td>
                <Td>{authEvent.authDetails?.realmId}</Td>
              </Tr>
              <Tr>
                <Td>{t("client")}</Td>
                <Td>{authEvent.authDetails?.clientId}</Td>
              </Tr>
              <Tr>
                <Td>{t("user")}</Td>
                <Td>{authEvent.authDetails?.userId}</Td>
              </Tr>
              <Tr>
                <Td>{t("ipAddress")}</Td>
                <Td>{authEvent.authDetails?.ipAddress}</Td>
              </Tr>
            </Tbody>
          </Table>
        </DisplayDialog>
      )}
      {representationEvent && (
        <DisplayDialog
          titleKey="representation"
          data-testid="representation-dialog"
          onClose={() => setRepresentationEvent(undefined)}
        >
          <CodeEditor readOnly value={code} language="json" />
        </DisplayDialog>
      )}
      {!adminEventsEnabled && <EventsBanners type="adminEvents" />}
      <DataTable
        t={t}
        key={key}
        loader={loader}
        detailColumns={[
          {
            name: "details",
            enabled: (event) => event.details !== undefined,
            cellRenderer: DetailCell,
          },
        ]}
        isPaginated
        ariaLabelKey="adminEvents"
        toolbarItem={
          <FormProvider {...form}>
            <Flex
              direction={{ default: "column" }}
              spaceItems={{ default: "spaceItemsNone" }}
            >
              <FlexItem>
                <DropdownPanel
                  buttonText={t("searchForAdminEvent")}
                  setSearchDropdownOpen={setSearchDropdownOpen}
                  searchDropdownOpen={searchDropdownOpen}
                  marginRight="2.5rem"
                  width="15vw"
                >
                  <Form
                    isHorizontal
                    className="keycloak__events_search__form"
                    data-testid="searchForm"
                  >
                    <FormGroup
                      label={t("resourceTypes")}
                      fieldId="kc-resourceTypes"
                      className="keycloak__events_search__form_label"
                    >
                      <Controller
                        name="resourceTypes"
                        control={control}
                        render={({ field }) => (
                          <KeycloakSelect
                            className="keycloak__events_search__type_select"
                            data-testid="resource-types-searchField"
                            chipGroupProps={{
                              numChips: 1,
                              expandedText: t("hide"),
                              collapsedText: t("showRemaining"),
                            }}
                            variant={SelectVariant.typeaheadMulti}
                            typeAheadAriaLabel="select-resourceTypes"
                            onToggle={(isOpen) =>
                              setSelectResourceTypesOpen(isOpen)
                            }
                            selections={field.value}
                            onSelect={(selectedValue) => {
                              const option = selectedValue.toString();
                              const changedValue = field.value.includes(option)
                                ? field.value.filter(
                                    (item: string) => item !== option,
                                  )
                                : [...field.value, option];

                              field.onChange(changedValue);
                            }}
                            onClear={() => {
                              field.onChange([]);
                            }}
                            isOpen={selectResourceTypesOpen}
                            aria-labelledby={"resourceTypes"}
                            chipGroupComponent={
                              <ChipGroup>
                                {field.value.map((chip: string) => (
                                  <Chip
                                    key={chip}
                                    onClick={(resource) => {
                                      resource.stopPropagation();
                                      field.onChange(
                                        field.value.filter(
                                          (val: string) => val !== chip,
                                        ),
                                      );
                                    }}
                                  >
                                    {chip}
                                  </Chip>
                                ))}
                              </ChipGroup>
                            }
                          >
                            {resourceTypes?.map((option) => (
                              <SelectOption key={option} value={option}>
                                {option}
                              </SelectOption>
                            ))}
                          </KeycloakSelect>
                        )}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("operationTypes")}
                      fieldId="kc-operationTypes"
                      className="keycloak__events_search__form_label"
                    >
                      <Controller
                        name="operationTypes"
                        control={control}
                        render={({ field }) => (
                          <KeycloakSelect
                            className="keycloak__events_search__type_select"
                            data-testid="operation-types-searchField"
                            chipGroupProps={{
                              numChips: 1,
                              expandedText: t("hide"),
                              collapsedText: t("showRemaining"),
                            }}
                            variant={SelectVariant.typeaheadMulti}
                            typeAheadAriaLabel="select-operationTypes"
                            onToggle={(isOpen) =>
                              setSelectOperationTypesOpen(isOpen)
                            }
                            selections={field.value}
                            onSelect={(selectedValue) => {
                              const option = selectedValue.toString();
                              const changedValue = field.value.includes(option)
                                ? field.value.filter(
                                    (item: string) => item !== option,
                                  )
                                : [...field.value, option];

                              field.onChange(changedValue);
                            }}
                            onClear={() => {
                              field.onChange([]);
                            }}
                            isOpen={selectOperationTypesOpen}
                            aria-labelledby={"operationTypes"}
                            chipGroupComponent={
                              <ChipGroup>
                                {field.value.map((chip: string) => (
                                  <Chip
                                    key={chip}
                                    onClick={(operation) => {
                                      operation.stopPropagation();
                                      field.onChange(
                                        field.value.filter(
                                          (val: string) => val !== chip,
                                        ),
                                      );
                                    }}
                                  >
                                    {chip}
                                  </Chip>
                                ))}
                              </ChipGroup>
                            }
                          >
                            {operationTypes?.map((option) => (
                              <SelectOption key={option} value={option}>
                                {option}
                              </SelectOption>
                            ))}
                          </KeycloakSelect>
                        )}
                      />
                    </FormGroup>
                    {!resourcePath && (
                      <TextControl
                        name="resourcePath"
                        label={t("resourcePath")}
                      />
                    )}
                    <TextControl name="authRealm" label={t("realm")} />
                    <TextControl name="authClient" label={t("client")} />
                    <TextControl name="authUser" label={t("userId")} />
                    <TextControl name="authIpAddress" label={t("ipAddress")} />
                    <FormGroup
                      label={t("dateFrom")}
                      fieldId="kc-dateFrom"
                      className="keycloak__events_search__form_label"
                    >
                      <Controller
                        name="dateFrom"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            className="pf-v5-u-w-100"
                            value={field.value}
                            onChange={(_, value) => field.onChange(value)}
                            inputProps={{ id: "kc-dateFrom" }}
                          />
                        )}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("dateTo")}
                      fieldId="kc-dateTo"
                      className="keycloak__events_search__form_label"
                    >
                      <Controller
                        name="dateTo"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            className="pf-v5-u-w-100"
                            value={field.value}
                            onChange={(_, value) => field.onChange(value)}
                            inputProps={{ id: "kc-dateTo" }}
                          />
                        )}
                      />
                    </FormGroup>
                    <ActionGroup>
                      <Button
                        variant={"primary"}
                        onClick={submitSearch}
                        data-testid="search-events-btn"
                        isDisabled={!isDirty}
                      >
                        {t("searchAdminEventsBtn")}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={resetSearch}
                        isDisabled={!isDirty}
                      >
                        {t("resetBtn")}
                      </Button>
                    </ActionGroup>
                  </Form>
                </DropdownPanel>
              </FlexItem>
              <FlexItem>
                {Object.entries(activeFilters).length > 0 && (
                  <div className="keycloak__searchChips pf-v5-u-ml-md">
                    {Object.entries(activeFilters).map((filter) => {
                      const [key, value] = filter as [
                        keyof AdminEventSearchForm,
                        string | string[],
                      ];

                      if (key === "resourcePath" && !!resourcePath) {
                        return null;
                      }

                      return (
                        <ChipGroup
                          className="pf-v5-u-mt-md pf-v5-u-mr-md"
                          key={key}
                          categoryName={filterLabels[key]}
                          onClick={() => removeFilter(key)}
                        >
                          {typeof value === "string" ? (
                            <Chip isReadOnly>{value}</Chip>
                          ) : (
                            value.map((entry) => (
                              <Chip
                                key={entry}
                                onClick={() => removeFilterValue(key, entry)}
                              >
                                {entry}
                              </Chip>
                            ))
                          )}
                        </ChipGroup>
                      );
                    })}
                  </div>
                )}
              </FlexItem>
            </Flex>
          </FormProvider>
        }
        actions={
          [
            {
              title: t("auth"),
              onRowClick: (event) => setAuthEvent(event),
            },
            {
              title: t("representation"),
              onRowClick: (event) => setRepresentationEvent(event),
            },
          ] as Action<AdminEventRepresentation>[]
        }
        columns={[
          {
            name: "time",
            displayKey: "time",
            cellRenderer: (row) =>
              formatDate(new Date(row.time!), FORMAT_DATE_AND_TIME),
          },
          {
            name: "resourcePath",
            displayKey: "resourcePath",
            cellRenderer: CellResourceLinkRenderer,
          },
          {
            name: "resourceType",
            displayKey: "resourceType",
          },
          {
            name: "operationType",
            displayKey: "operationType",
            transforms: [cellWidth(10)],
          },
          {
            name: "",
            displayKey: "user",
            cellRenderer: (event) => event.authDetails?.userId || "",
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyAdminEvents")}
            instructions={t("emptyAdminEventsInstructions")}
            primaryActionText={t("refresh")}
            onPrimaryAction={() => setKey(key + 1)}
          />
        }
        isSearching={Object.keys(activeFilters).length > 0}
      />
    </>
  );
};
