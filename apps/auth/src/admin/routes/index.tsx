// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react";
import iconSvgUrl from "../assets/icon.svg";
import FeatureRepresentation, {
  FeatureType,
} from "@keycloak/keycloak-admin-client/lib/defs/featureRepresentation";
import {
  HelpItem,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Card as UICard, CardContent as UICardContent, CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { KeycloakSpinner } from "../../shared/keycloak-ui-shared";
import {
  RoutableTabs,
  useRoutableTab,
} from "../components/routable-tabs/RoutableTabs";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import helpUrls from "../help-urls";
import useLocaleSort, { mapByKey } from "../utils/useLocaleSort";
import { ProviderInfo } from "../components/dashboard/ProviderInfo";
import { DashboardTab, toDashboard } from "../lib/dashboard";
import { Tab, TabTitleText } from "../../shared/pf-compat"

const ActionList = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);

const ActionListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Brand = ({ src, alt, heights, widths, className, ...props }: any) => (
  <img src={src} alt={alt} className={cn("h-auto", className)} {...props} />
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
const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const CardTitle = (props: any) => <UICardTitle {...props} />;
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
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
const EmptyStateHeader = ({ titleText, headingLevel = "h4", icon, children, ...props }: any) => (
  <div className="flex flex-col items-center gap-2" {...props}>
    {icon}
    {titleText ? React.createElement(headingLevel, { className: "font-medium text-base" }, titleText) : null}
    {children}
  </div>
);
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const List = ({ variant, children, className, ...props }: any) => (
  <ul className={cn("space-y-1 text-sm", variant === "inline" ? "flex flex-wrap gap-2" : "list-disc pl-5", className)} {...props}>
    {children}
  </ul>
);
const ListItem = ({ children, ...props }: any) => <li {...props}>{children}</li>;
const ListVariant = { inline: "inline" } as const;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
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
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

const EmptyDashboard = () => {
  const { environment } = useEnvironment();

  const { t } = useTranslation();
  const { realm, realmRepresentation: realmInfo } = useRealm();

  const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

  return (
    <PageSection variant="light">
      <EmptyState variant="lg">
        <Brand
          src={iconSvgUrl}
          alt="Keycloak icon"
          className="keycloak__dashboard_icon"
        />
        <EmptyStateHeader titleText={<>{t("welcome")}</>} headingLevel="h2" />
        <EmptyStateHeader titleText={realmDisplayInfo} headingLevel="h1" />
        <EmptyStateBody>{t("introduction")}</EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
};

type FeatureItemProps = {
  feature: FeatureRepresentation;
};

const FeatureItem = ({ feature }: FeatureItemProps) => {
  const { t } = useTranslation();
  const color =
    feature.type === FeatureType.Default ||
    feature.type === FeatureType.DisabledByDefault
      ? "green"
      : feature.type === FeatureType.Preview ||
          feature.type === FeatureType.PreviewDisabledByDefault
        ? "blue"
        : feature.type === FeatureType.Experimental
          ? "orange"
          : feature.type === FeatureType.Deprecated
            ? "grey"
            : "red";
  return (
    <ListItem className="pf-v5-u-mb-sm">
      {feature.name}&nbsp;
      <Label color={color}>{t(feature.type.toLowerCase())}</Label>
      {feature.deprecated && feature.type !== FeatureType.Deprecated && (
        <>
          &nbsp;
          <Label color="grey">{t("deprecated")}</Label>
        </>
      )}
    </ListItem>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { realm, realmRepresentation: realmInfo } = useRealm();
  const serverInfo = useServerInfo();
  const localeSort = useLocaleSort();

  const sortedFeatures = useMemo(
    () => localeSort(serverInfo.features ?? [], mapByKey("name")),
    [serverInfo.features],
  );

  const disabledFeatures = useMemo(
    () => sortedFeatures.filter((f) => !f.enabled) || [],
    [serverInfo.features],
  );

  const enabledFeatures = useMemo(
    () => sortedFeatures.filter((f) => f.enabled) || [],
    [serverInfo.features],
  );

  const useTab = (tab: DashboardTab) =>
    useRoutableTab(
      toDashboard({
        realm,
        tab,
      }),
    );

  const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

  const welcomeTab = useTab("welcome");
  const infoTab = useTab("info");
  const providersTab = useTab("providers");

  if (Object.keys(serverInfo).length === 0) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <PageSection variant="light">
        <TextContent className="pf-v5-u-mr-sm">
          <Text component="h1">{t("realmNameTitle", { name: realm })}</Text>
        </TextContent>
      </PageSection>
      <PageSection variant="light" className="pf-v5-u-p-0">
        <RoutableTabs
          data-testid="dashboard-tabs"
          defaultLocation={toDashboard({
            realm,
            tab: "welcome",
          })}
          isBox
          mountOnEnter
        >
          <Tab
            id="welcome"
            data-testid="welcomeTab"
            title={<TabTitleText>{t("welcomeTabTitle")}</TabTitleText>}
            {...welcomeTab}
          >
            <PageSection variant="light">
              <div className="pf-v5-l-grid pf-v5-u-ml-lg">
                <div className="pf-v5-l-grid__item pf-m-12-col">
                  <Title
                    data-testid="welcomeTitle"
                    className="pf-v5-u-font-weight-bold"
                    headingLevel="h2"
                    size="3xl"
                  >
                    {t("welcomeTo", { realmDisplayInfo })}
                  </Title>
                </div>
                <div className="pf-v5-l-grid__item keycloak__dashboard_welcome_tab">
                  <Text component={TextVariants.h3}>{t("welcomeText")}</Text>
                </div>
                <div className="pf-v5-l-grid__item pf-m-10-col pf-v5-u-mt-md">
                  <Button
                    className="pf-v5-u-px-lg pf-v5-u-py-sm"
                    component="a"
                    href={helpUrls.documentation}
                    target="_blank"
                    variant="primary"
                  >
                    {t("viewDocumentation")}
                  </Button>
                </div>
                <ActionList className="pf-v5-u-mt-sm">
                  <ActionListItem>
                    <Button
                      component="a"
                      href={helpUrls.guides}
                      target="_blank"
                      variant="tertiary"
                    >
                      {t("viewGuides")}
                    </Button>
                  </ActionListItem>
                  <ActionListItem>
                    <Button
                      component="a"
                      href={helpUrls.community}
                      target="_blank"
                      variant="tertiary"
                    >
                      {t("joinCommunity")}
                    </Button>
                  </ActionListItem>
                  <ActionListItem>
                    <Button
                      component="a"
                      href={helpUrls.blog}
                      target="_blank"
                      variant="tertiary"
                    >
                      {t("readBlog")}
                    </Button>
                  </ActionListItem>
                </ActionList>
              </div>
            </PageSection>
          </Tab>
          <Tab
            id="info"
            data-testid="infoTab"
            title={<TabTitleText>{t("serverInfo")}</TabTitleText>}
            {...infoTab}
          >
            <PageSection variant="light">
              <Grid hasGutter>
                <GridItem lg={2} sm={12}>
                  <Card className="keycloak__dashboard_card">
                    <CardTitle>{t("serverInfo")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("version")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.systemInfo?.version}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                    <CardTitle>{t("cpu")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("processorCount")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.cpuInfo?.processorCount}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                    <CardTitle>{t("memory")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("totalMemory")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.memoryInfo?.totalFormated}
                          </DescriptionListDescription>
                          <DescriptionListTerm>
                            {t("freeMemory")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.memoryInfo?.freeFormated}
                          </DescriptionListDescription>
                          <DescriptionListTerm>
                            {t("usedMemory")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.memoryInfo?.usedFormated}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem lg={10} sm={12}>
                  <Card className="keycloak__dashboard_card">
                    <CardTitle>{t("profile")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("enabledFeatures")}{" "}
                            <HelpItem
                              fieldLabelId="enabledFeatures"
                              helpText={t("infoEnabledFeatures")}
                            />
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            <List variant={ListVariant.inline}>
                              {enabledFeatures.map((feature) => (
                                <FeatureItem
                                  key={feature.name}
                                  feature={feature}
                                />
                              ))}
                            </List>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("disabledFeatures")}{" "}
                            <HelpItem
                              fieldLabelId="disabledFeatures"
                              helpText={t("infoDisabledFeatures")}
                            />
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            <List variant={ListVariant.inline}>
                              {disabledFeatures.map((feature) => (
                                <FeatureItem
                                  key={feature.name}
                                  feature={feature}
                                />
                              ))}
                            </List>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </PageSection>
          </Tab>
          <Tab
            id="providers"
            data-testid="providersTab"
            title={<TabTitleText>{t("providerInfo")}</TabTitleText>}
            {...providersTab}
          >
            <ProviderInfo />
          </Tab>
        </RoutableTabs>
      </PageSection>
    </>
  );
};

function DashboardSection() {
  const { realm } = useRealm();
  const isMasterRealm = realm === "master";
  return (
    <>
      {!isMasterRealm && <EmptyDashboard />}
      {isMasterRealm && <Dashboard />}
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Dashboard,
})
