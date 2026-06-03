/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/evaluate/Results.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react"
import {
  Table,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
import { KeyboardEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type EvaluationResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/evaluationResultRepresentation";
import type PolicyEvaluationResponse from "@keycloak/keycloak-admin-client/lib/defs/policyEvaluationResponse";
import { FixedButtonsGroup } from "../../../form/FixedButtonGroup";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import useToggle from "../../../../utils/use-toggle";
import { AuthorizationDataModal } from "../AuthorizationDataModal";
import { AuthorizationEvaluateResource } from "../AuthorizationEvaluateResource";
import { Select, SelectOption } from "../../../../../shared/pf-compat"


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
const Divider = (props: any) => <UISeparator {...props} />;
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

type ResultProps = {
  evaluateResult: PolicyEvaluationResponse;
  refresh: () => void;
  back: () => void;
};

enum ResultsFilter {
  All = "ALL",
  StatusDenied = "STATUS_DENIED",
  StatusPermitted = "STATUS_PERMITTED",
}

function filterResults(
  results: EvaluationResultRepresentation[],
  filter: ResultsFilter,
) {
  switch (filter) {
    case ResultsFilter.StatusPermitted:
      return results.filter(({ status }) => status === "PERMIT");
    case ResultsFilter.StatusDenied:
      return results.filter(({ status }) => status === "DENY");
    default:
      return results;
  }
}

export const Results = ({ evaluateResult, refresh, back }: ResultProps) => {
  const { t } = useTranslation();

  const [filterDropdownOpen, toggleFilterDropdown] = useToggle();

  const [filter, setFilter] = useState(ResultsFilter.All);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const confirmSearchQuery = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirmSearchQuery();
    }
  };

  const filteredResources = useMemo(
    () =>
      filterResults(evaluateResult.results!, filter).filter(
        ({ resource }) => resource?.name?.includes(searchQuery) ?? false,
      ),
    [evaluateResult.results, filter, searchQuery],
  );

  const noEvaluatedData = evaluateResult.results!.length === 0;
  const noFilteredData = filteredResources.length === 0;

  return (
    <PageSection>
      <Toolbar>
        <ToolbarGroup className="providers-toolbar">
          <ToolbarItem>
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  name={"inputGroupName"}
                  id={"inputGroupName"}
                  type="search"
                  aria-label={t("search")}
                  placeholder={t("search")}
                  onChange={(_event, val) => setSearchInput(val)}
                  onKeyDown={handleKeyDown}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  variant={ButtonVariant.control}
                  aria-label={t("search")}
                  onClick={() => confirmSearchQuery()}
                >
                  <SearchIcon />
                </Button>
              </InputGroupItem>
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Select
              data-testid="filter-type-select"
              isOpen={filterDropdownOpen}
              className="kc-filter-type-select"
              toggle={(ref) => (
                <MenuToggle
                  ref={ref}
                  onClick={toggleFilterDropdown}
                  isExpanded={filterDropdownOpen}
                  style={{ width: "300px" }}
                >
                  {filter}
                </MenuToggle>
              )}
              onSelect={(_, value) => {
                setFilter(value as ResultsFilter);
                toggleFilterDropdown();
                refresh();
              }}
              selected={filter}
            >
              <SelectList>
                <SelectOption
                  data-testid="all-results-option"
                  value={ResultsFilter.All}
                >
                  {t("allResults")}
                </SelectOption>
                <SelectOption
                  data-testid="result-permit-option"
                  value={ResultsFilter.StatusPermitted}
                >
                  {t("resultPermit")}
                </SelectOption>
                <SelectOption
                  data-testid="result-deny-option"
                  value={ResultsFilter.StatusDenied}
                >
                  {t("resultDeny")}
                </SelectOption>
              </SelectList>
            </Select>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      {!noFilteredData && (
        <Table aria-label={t("evaluationResults")}>
          <Thead>
            <Tr>
              <Th aria-hidden="true" />
              <Th>{t("resource")}</Th>
              <Th>{t("overallResults")}</Th>
              <Th>{t("scopes")}</Th>
              <Th aria-hidden="true" />
            </Tr>
          </Thead>
          {filteredResources.map((resource, rowIndex) => (
            <AuthorizationEvaluateResource
              key={rowIndex}
              rowIndex={rowIndex}
              resource={resource}
              evaluateResults={evaluateResult.results}
            />
          ))}
        </Table>
      )}
      {(noFilteredData || noEvaluatedData) && (
        <>
          <Divider />
          <ListEmptyState
            isSearchVariant
            message={t("noSearchResults")}
            instructions={t("noSearchResultsInstructions")}
          />
        </>
      )}
      <Form>
        <FixedButtonsGroup name="authorization">
          <Button data-testid="authorization-eval" id="back-btn" onClick={back}>
            {t("back")}
          </Button>{" "}
          <Button
            data-testid="authorization-reevaluate"
            id="reevaluate-btn"
            variant="secondary"
            onClick={refresh}
          >
            {t("reevaluate")}
          </Button>{" "}
          <AuthorizationDataModal data={evaluateResult.rpt!} />
        </FixedButtonsGroup>
      </Form>
    </PageSection>
  );
};
