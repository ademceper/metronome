/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/events/UserEvents.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type EventRepresentation from "@keycloak/keycloak-admin-client/lib/defs/eventRepresentation";
import type EventType from "@keycloak/keycloak-admin-client/lib/defs/eventTypes";
import { KeycloakSelect, SelectVariant, TextControl, useFetch } from "../../../shared/keycloak-ui-shared";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { CheckCircle as CheckCircleIcon, Warning as WarningTriangleIcon } from "@phosphor-icons/react"
const cellWidth = (_n: number) => () => ({ className: '' });
import { pickBy } from "lodash-es";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { EventsBanners } from "../banners";
import DropdownPanel from "../dropdown-panel/DropdownPanel";
import { useRealm } from "../../context/realm-context/realm-context";
import { toUser } from "../../lib/user";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../../utils/use-format-date";
import useLocaleSort from "../../utils/use-locale-sort";
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
const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
);
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

type UserEventSearchForm = {
  client: string;
  dateFrom: string;
  dateTo: string;
  user: string;
  type: EventType[];
  ipAddress: string;
};

const StatusRow = (event: EventRepresentation) =>
  !event.error ? (
    <span>
      <Icon status="success">
        <CheckCircleIcon />
      </Icon>
      {event.type}
    </span>
  ) : (
    <Tooltip content={event.error}>
      <span>
        <Icon status="warning">
          <WarningTriangleIcon />
        </Icon>
        {event.type}
      </span>
    </Tooltip>
  );

const DetailCell = (event: EventRepresentation) => (
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

const UserDetailLink = (event: EventRepresentation) => {
  const { t } = useTranslation();
  const { realm } = useRealm();

  return (
    <>
      {event.userId && (
        <Link
          key={`link-${event.time}-${event.type}`}
          to={toUser({
            realm,
            id: event.userId,
            tab: "settings",
          })}
        >
          {event.userId}
        </Link>
      )}
      {!event.userId && t("noUserDetails")}
    </>
  );
};

type UserEventsProps = {
  user?: string;
  client?: string;
};

export const UserEvents = ({ user, client }: UserEventsProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const localeSort = useLocaleSort();
  const { realm } = useRealm();
  const formatDate = useFormatDate();
  const [key, setKey] = useState(0);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [events, setEvents] = useState<string[]>();
  const [userEventsEnabled, setUserEventsEnabled] = useState<boolean>();
  const [activeFilters, setActiveFilters] = useState<
    Partial<UserEventSearchForm>
  >({});

  const defaultValues: UserEventSearchForm = {
    client: client ? client : "",
    dateFrom: "",
    dateTo: "",
    user: user ? user : "",
    type: [],
    ipAddress: "",
  };

  const filterLabels: Record<keyof UserEventSearchForm, string> = {
    client: t("client"),
    dateFrom: t("dateFrom"),
    dateTo: t("dateTo"),
    user: t("userId"),
    type: t("eventType"),
    ipAddress: t("ipAddress"),
  };

  const form = useForm<UserEventSearchForm>({
    mode: "onChange",
    defaultValues,
  });

  const {
    getValues,
    reset,
    formState: { isDirty },
    control,
    handleSubmit,
  } = form;

  useFetch(
    () => adminClient.realms.getConfigEvents({ realm }),
    (events) => {
      setUserEventsEnabled(events?.eventsEnabled!);
      setEvents(localeSort(events?.enabledEventTypes || [], (e) => e));
    },
    [],
  );

  function loader(first?: number, max?: number) {
    return adminClient.realms.findEvents({
      client,
      user,
      // The admin client wants 'dateFrom' and 'dateTo' to be Date objects, however it cannot actually handle them so we need to cast to any.
      ...(activeFilters as any),
      realm,
      first,
      max,
    });
  }

  function onSubmit() {
    setSearchDropdownOpen(false);
    commitFilters();
  }

  function resetSearch() {
    reset();
    commitFilters();
  }

  function removeFilter(key: keyof UserEventSearchForm) {
    const formValues: UserEventSearchForm = { ...getValues() };
    delete formValues[key];

    reset({ ...defaultValues, ...formValues });
    commitFilters();
  }

  function removeFilterValue(
    key: keyof UserEventSearchForm,
    valueToRemove: EventType,
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
    const newFilters: Partial<UserEventSearchForm> = pickBy(
      getValues(),
      (value) => value !== "" || (Array.isArray(value) && value.length > 0),
    );

    if (user) {
      delete newFilters.user;
    }

    if (client) {
      delete newFilters.client;
    }

    setActiveFilters(newFilters);
    setKey(key + 1);
  }

  const userEventSearchFormDisplay = () => {
    return (
      <FormProvider {...form}>
        <Flex
          direction={{ default: "column" }}
          spaceItems={{ default: "spaceItemsNone" }}
        >
          <FlexItem>
            <DropdownPanel
              buttonText={t("searchUserEventsBtn")}
              setSearchDropdownOpen={setSearchDropdownOpen}
              searchDropdownOpen={searchDropdownOpen}
              marginRight="2.5rem"
              width="15vw"
            >
              <Form
                data-testid="searchForm"
                className="keycloak__events_search__form"
                onSubmit={handleSubmit(onSubmit)}
                isHorizontal
              >
                {!user && (
                  <TextControl
                    name="user"
                    label={t("userId")}
                    data-testid="userId-searchField"
                  />
                )}
                <FormGroup
                  label={t("eventType")}
                  fieldId="kc-eventType"
                  className="keycloak__events_search__form_label"
                >
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <KeycloakSelect
                        className="keycloak__events_search__type_select"
                        data-testid="event-type-searchField"
                        chipGroupProps={{
                          numChips: 1,
                          expandedText: t("hide"),
                          collapsedText: t("showRemaining"),
                        }}
                        variant={SelectVariant.typeaheadMulti}
                        typeAheadAriaLabel="Select"
                        onToggle={(isOpen) => setSelectOpen(isOpen)}
                        selections={field.value}
                        onSelect={(selectedValue) => {
                          const option = selectedValue.toString() as EventType;
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
                        isOpen={selectOpen}
                        aria-labelledby={"eventType"}
                        chipGroupComponent={
                          <ChipGroup>
                            {field.value.map((chip: string) => (
                              <Chip
                                key={chip}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  field.onChange(
                                    field.value.filter(
                                      (val: string) => val !== chip,
                                    ),
                                  );
                                }}
                              >
                                {t(`eventTypes.${chip}.name`)}
                              </Chip>
                            ))}
                          </ChipGroup>
                        }
                      >
                        {events?.map((option) => (
                          <SelectOption key={option} value={option}>
                            {t(`eventTypes.${option}.name`)}
                          </SelectOption>
                        ))}
                      </KeycloakSelect>
                    )}
                  />
                </FormGroup>
                {!client && (
                  <TextControl
                    name="client"
                    label={t("client")}
                    data-testid="client-searchField"
                  />
                )}
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
                <TextControl
                  name="ipAddress"
                  label={t("ipAddress")}
                  data-testid="ipAddress-searchField"
                />
                <ActionGroup>
                  <Button
                    data-testid="search-events-btn"
                    variant="primary"
                    type="submit"
                    isDisabled={!isDirty}
                  >
                    {t("searchUserEventsBtn")}
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
                    keyof UserEventSearchForm,
                    string | EventType[],
                  ];

                  if (
                    (key === "user" && !!user) ||
                    (key === "client" && !!client)
                  ) {
                    return null;
                  }

                  return (
                    <ChipGroup
                      className="pf-v5-u-mt-md pf-v5-u-mr-md"
                      key={key}
                      categoryName={filterLabels[key]}
                      onClick={() => removeFilter(key)}
                      isClosable
                    >
                      {typeof value === "string" ? (
                        <Chip isReadOnly>{value}</Chip>
                      ) : (
                        value.map((entry) => (
                          <Chip
                            key={entry}
                            onClick={() => removeFilterValue(key, entry)}
                          >
                            {t(`eventTypes.${entry}.name`)}
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
    );
  };

  return (
    <>
      {!userEventsEnabled && <EventsBanners type="userEvents" />}
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
        ariaLabelKey="titleEvents"
        toolbarItem={userEventSearchFormDisplay()}
        columns={[
          {
            name: "time",
            displayKey: "time",
            cellRenderer: (row) =>
              formatDate(new Date(row.time!), FORMAT_DATE_AND_TIME),
          },
          ...(!user
            ? [
                {
                  name: "userId",
                  cellRenderer: UserDetailLink,
                },
              ]
            : []),
          {
            name: "type",
            displayKey: "eventType",
            cellRenderer: StatusRow,
          },
          {
            name: "ipAddress",
            displayKey: "ipAddress",
            transforms: [cellWidth(10)],
          },
          ...(!client
            ? [
                {
                  name: "clientId",
                  displayKey: "client",
                },
              ]
            : []),
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyUserEvents")}
            instructions={t("emptyUserEventsInstructions")}
            primaryActionText={t("refresh")}
            onPrimaryAction={() => setKey(key + 1)}
          />
        }
        isSearching={Object.keys(activeFilters).length > 0}
      />
    </>
  );
};
