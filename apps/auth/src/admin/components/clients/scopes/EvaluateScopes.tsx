/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/scopes/EvaluateScopes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";
import { HelpItem, KeycloakSelect, SelectVariant, useFetch, useHelp } from "../../../../shared/keycloak-ui-shared";
import { DataTable } from "@metronome/ui/components/data-table";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { Tabs as UITabs, TabsContent as UITabsContent, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { Question as QuestionCircleIcon } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { ClientSelect } from "../../client/ClientSelect";
import { UserSelect } from "../../users/UserSelect";
import { useAccess } from "../../../context/access/access";
import { useRealm } from "../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { prettyPrintJSON } from "../../../util";
import { GeneratedCodeTab } from "./GeneratedCodeTab";
import { Tabs, Tab, TabContent, TabTitleText } from "../../../../shared/pf-compat"
import { SelectOption } from "../../../../shared/pf-compat"

const ClipboardCopy = ({ value, onChange, isReadOnly, isCode, hoverTip, clickTip, children, variant, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const text = value ?? children ?? "";
  return (
    <div className="flex items-stretch gap-0">
      <UIInput readOnly={isReadOnly} value={String(text)}
        onChange={(e: any) => onChange?.(e, e.target.value)} className="rounded-r-none" />
      <UIButton type="button" variant="outline" className="rounded-l-none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}>
        {copied ? (clickTip ?? "Copied") : (hoverTip ?? "Copy")}
      </UIButton>
    </div>
  );
};
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
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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

export type EvaluateScopesProps = {
  clientId: string;
  protocol: string;
};

const ProtocolMappers = ({
  protocolMappers,
}: {
  protocolMappers: ProtocolMapperRepresentation[];
}) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(key + 1);
  }, [protocolMappers]);
  return (
    <DataTable
      t={t}
      key={key}
      loader={() => Promise.resolve(protocolMappers)}
      ariaLabelKey="effectiveProtocolMappers"
      searchPlaceholderKey="searchForProtocol"
      data-testid="effective-protocol-mappers"
      columns={[
        {
          name: "mapperName",
          displayKey: "name",
        },
        {
          name: "containerName",
          displayKey: "parentClientScope",
        },
        {
          name: "type.category",
          displayKey: "category",
        },
        {
          name: "type.priority",
          displayKey: "priority",
        },
      ]}
    />
  );
};

const EffectiveRoles = ({
  effectiveRoles,
}: {
  effectiveRoles: RoleRepresentation[];
}) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(key + 1);
  }, [effectiveRoles]);

  return (
    <DataTable
      t={t}
      key={key}
      loader={() => Promise.resolve(effectiveRoles)}
      ariaLabelKey="effectiveRoleScopeMappings"
      searchPlaceholderKey="searchForRole"
      data-testid="effective-role-scope-mappings"
      columns={[
        {
          name: "name",
          displayKey: "role",
        },
        {
          name: "containerId",
          displayKey: "origin",
        },
      ]}
    />
  );
};

export const EvaluateScopes = ({ clientId, protocol }: EvaluateScopesProps) => {
  const { adminClient } = useAdminClient();

  const prefix = "openid";
  const { t } = useTranslation();
  const { enabled } = useHelp();
  const { realm } = useRealm();
  const mapperTypes = useServerInfo().protocolMapperTypes![protocol];

  const [selectableScopes, setSelectableScopes] = useState<
    ClientScopeRepresentation[]
  >([]);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([prefix]);
  const [activeTab, setActiveTab] = useState(0);

  const [key, setKey] = useState("");
  const refresh = () => setKey(`${new Date().getTime()}`);
  const [effectiveRoles, setEffectiveRoles] = useState<RoleRepresentation[]>(
    [],
  );
  const [protocolMappers, setProtocolMappers] = useState<
    ProtocolMapperRepresentation[]
  >([]);
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [idToken, setIdToken] = useState("");

  const tabContent1 = useRef(null);
  const tabContent2 = useRef(null);
  const tabContent3 = useRef(null);
  const tabContent4 = useRef(null);
  const tabContent5 = useRef(null);

  const form = useForm();
  const { watch } = form;
  const selectedAudience: string[] = watch("targetAudience");

  const { hasAccess } = useAccess();
  const hasViewUsers = hasAccess("view-users");

  useFetch(
    () => adminClient.clients.listOptionalClientScopes({ id: clientId }),
    (optionalClientScopes) => setSelectableScopes(optionalClientScopes),
    [],
  );

  useFetch(
    async () => {
      const scope = selected.join(" ");
      const effectiveRoles = await adminClient.clients.evaluatePermission({
        id: clientId,
        roleContainer: realm,
        scope,
        type: "granted",
      });

      const mapperList = (await adminClient.clients.evaluateListProtocolMapper({
        id: clientId,
        scope,
      })) as ({
        type: ProtocolMapperTypeRepresentation;
      } & ProtocolMapperRepresentation)[];

      return {
        mapperList,
        effectiveRoles,
      };
    },
    ({ mapperList, effectiveRoles }) => {
      setEffectiveRoles(effectiveRoles);
      mapperList.map((mapper) => {
        mapper.type = mapperTypes.find(
          (type) => type.id === mapper.protocolMapper,
        )!;
      });

      setProtocolMappers(mapperList);
      refresh();
    },
    [selected],
  );

  useFetch(
    async () => {
      const scope = selected.join(" ");
      const user = form.getValues("user");
      if (user.length === 0) {
        return [];
      }
      const audience = selectedAudience.join(" ");

      return await Promise.all([
        adminClient.clients.evaluateGenerateAccessToken({
          id: clientId,
          userId: user[0],
          scope,
          audience,
        }),
        adminClient.clients.evaluateGenerateUserInfo({
          id: clientId,
          userId: user[0],
          scope,
        }),
        adminClient.clients.evaluateGenerateIdToken({
          id: clientId,
          userId: user[0],
          scope,
        }),
      ]);
    },
    ([accessToken, userInfo, idToken]) => {
      setAccessToken(prettyPrintJSON(accessToken));
      setUserInfo(prettyPrintJSON(userInfo));
      setIdToken(prettyPrintJSON(idToken));
    },
    [form.getValues("user"), selected, selectedAudience],
  );

  return (
    <>
      <PageSection variant="light">
        {enabled && (
          <TextContent className="keycloak__section_intro__help">
            <Text>
              <QuestionCircleIcon /> {t("evaluateExplain")}
            </Text>
          </TextContent>
        )}
        <Form isHorizontal>
          <FormGroup
            label={t("scopeParameter")}
            fieldId="scopeParameter"
            labelIcon={
              <HelpItem
                helpText={t("scopeParameterHelp")}
                fieldLabelId="scopeParameter"
              />
            }
          >
            <Split hasGutter>
              <SplitItem isFilled>
                <KeycloakSelect
                  toggleId="scopeParameter"
                  variant={SelectVariant.typeaheadMulti}
                  typeAheadAriaLabel={t("scopeParameter")}
                  onToggle={() => setIsScopeOpen(!isScopeOpen)}
                  isOpen={isScopeOpen}
                  selections={selected}
                  onSelect={(value) => {
                    const option = value as string;
                    if (selected.includes(option)) {
                      if (option !== prefix) {
                        setSelected(selected.filter((item) => item !== option));
                      }
                    } else {
                      setSelected([...selected, option]);
                    }
                  }}
                  aria-labelledby={t("scopeParameter")}
                  placeholderText={t("scopeParameterPlaceholder")}
                >
                  {selectableScopes.map((option, index) => (
                    <SelectOption key={index} value={option.name}>
                      {option.name}
                    </SelectOption>
                  ))}
                </KeycloakSelect>
              </SplitItem>
              <SplitItem>
                <ClipboardCopy className="keycloak__scopes_evaluate__clipboard-copy">
                  {selected.join(" ")}
                </ClipboardCopy>
              </SplitItem>
            </Split>
          </FormGroup>
          {hasViewUsers && (
            <FormProvider {...form}>
              <UserSelect
                name="user"
                label="users"
                helpText={t("userHelp")}
                defaultValue=""
                variant={SelectVariant.typeahead}
                isRequired
              />
            </FormProvider>
          )}
          <FormProvider {...form}>
            <ClientSelect
              name="targetAudience"
              label={t("targetAudience")}
              helpText={t("targetAudienceHelp")}
              defaultValue={[]}
              variant="typeaheadMulti"
              placeholderText={t("targetAudiencePlaceHolder")}
            />
          </FormProvider>
        </Form>
      </PageSection>

      <Grid hasGutter className="keycloak__scopes_evaluate__tabs">
        <GridItem span={8}>
          <TabContent
            aria-labelledby="pf-tab-0-effectiveProtocolMappers"
            eventKey={0}
            id="effectiveProtocolMappers"
            ref={tabContent1}
          >
            <ProtocolMappers protocolMappers={protocolMappers} />
          </TabContent>
          <TabContent
            aria-labelledby="pf-tab-0-effectiveRoleScopeMappings"
            eventKey={1}
            id="effectiveRoleScopeMappings"
            ref={tabContent2}
            hidden
          >
            <EffectiveRoles effectiveRoles={effectiveRoles} />
          </TabContent>
          <TabContent
            aria-labelledby={t("generatedAccessToken")}
            eventKey={2}
            id="tab-generated-access-token"
            ref={tabContent3}
            hidden
          >
            <GeneratedCodeTab
              text={accessToken}
              user={form.getValues("user")}
              label="generatedAccessToken"
            />
          </TabContent>
          <TabContent
            aria-labelledby={t("generatedIdToken")}
            eventKey={3}
            id="tab-generated-id-token"
            ref={tabContent4}
            hidden
          >
            <GeneratedCodeTab
              text={idToken}
              user={form.getValues("user")}
              label="generatedIdToken"
            />
          </TabContent>
          <TabContent
            aria-labelledby={t("generatedUserInfo")}
            eventKey={4}
            id="tab-generated-user-info"
            ref={tabContent5}
            hidden
          >
            <GeneratedCodeTab
              text={userInfo}
              user={form.getValues("user")}
              label="generatedUserInfo"
            />
          </TabContent>
        </GridItem>
        <GridItem span={4}>
          <Tabs
            id="tabs"
            key={key}
            isVertical
            activeKey={activeTab}
            onSelect={(_, key) => setActiveTab(key as number)}
          >
            <Tab
              id="effectiveProtocolMappers"
              aria-controls="effectiveProtocolMappers"
              data-testid="effective-protocol-mappers-tab"
              eventKey={0}
              title={
                <TabTitleText>
                  {t("effectiveProtocolMappers")}{" "}
                  <HelpItem
                    fieldLabelId="effectiveProtocolMappers"
                    helpText={t("effectiveProtocolMappersHelp")}
                    noVerticalAlign={false}
                    unWrap
                  />
                </TabTitleText>
              }
              tabContentRef={tabContent1}
            />
            <Tab
              id="effectiveRoleScopeMappings"
              aria-controls="effectiveRoleScopeMappings"
              data-testid="effective-role-scope-mappings-tab"
              eventKey={1}
              title={
                <TabTitleText>
                  {t("effectiveRoleScopeMappings")}{" "}
                  <HelpItem
                    fieldLabelId="effectiveRoleScopeMappings"
                    helpText={t("effectiveRoleScopeMappingsHelp")}
                    noVerticalAlign={false}
                    unWrap
                  />
                </TabTitleText>
              }
              tabContentRef={tabContent2}
            ></Tab>
            <Tab
              id="generatedAccessToken"
              aria-controls="generatedAccessToken"
              data-testid="generated-access-token-tab"
              eventKey={2}
              title={
                <TabTitleText>
                  {t("generatedAccessToken")}{" "}
                  <HelpItem
                    fieldLabelId="generatedAccessToken"
                    helpText={t("generatedAccessTokenHelp")}
                    noVerticalAlign={false}
                    unWrap
                  />
                </TabTitleText>
              }
              tabContentRef={tabContent3}
            />
            <Tab
              id="generatedIdToken"
              aria-controls="generatedIdToken"
              data-testid="generated-id-token-tab"
              eventKey={3}
              title={
                <TabTitleText>
                  {t("generatedIdToken")}{" "}
                  <HelpItem
                    fieldLabelId="generatedIdToken"
                    helpText={t("generatedIdTokenHelp")}
                    noVerticalAlign={false}
                    unWrap
                  />
                </TabTitleText>
              }
              tabContentRef={tabContent4}
            />
            <Tab
              id="generatedUserInfo"
              aria-controls="generatedUserInfo"
              data-testid="generated-user-info-tab"
              eventKey={4}
              title={
                <TabTitleText>
                  {t("generatedUserInfo")}{" "}
                  <HelpItem
                    fieldLabelId="generatedUserInfo"
                    helpText={t("generatedUserInfoHelp")}
                    noVerticalAlign={false}
                    unWrap
                  />
                </TabTitleText>
              }
              tabContentRef={tabContent5}
            />
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
};
