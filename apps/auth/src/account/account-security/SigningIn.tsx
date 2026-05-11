/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/SigningIn.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon, Warning as ExclamationTriangleIcon, Info as InfoAltIcon } from "@phosphor-icons/react"
import { CSSProperties, Fragment, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { getCredentials } from "../api/methods";
import {
  CredentialContainer,
  CredentialMetadataRepresentation,
} from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { Page } from "../components/page/Page";
import type { TFuncKey } from "../i18n-type";
import { formatDate } from "../utils/formatDate";
import { usePromise } from "../utils/usePromise";
import { AccountEnvironment } from "..";


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
const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const DataListAction = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
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
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
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

type MobileLinkProps = {
  title: string;
  onClick: () => void;
  testid?: string;
};

const MobileLink = ({ title, onClick, testid }: MobileLinkProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dropdown
        popperProps={{
          position: "right",
        }}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        toggle={(toggleRef) => (
          <MenuToggle
            className="pf-v5-u-display-none-on-lg"
            ref={toggleRef}
            variant="plain"
            onClick={() => setOpen(!open)}
            isExpanded={open}
          >
            <EllipsisVIcon />
          </MenuToggle>
        )}
        isOpen={open}
      >
        <DropdownItem key="1" onClick={onClick}>
          {title}
        </DropdownItem>
      </Dropdown>
      <Button
        variant="link"
        onClick={onClick}
        className="pf-v5-u-display-none pf-v5-u-display-inline-flex-on-lg"
        data-testid={testid}
      >
        {title}
      </Button>
    </>
  );
};

export const SigningIn = () => {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const { login } = context.keycloak;

  const [credentials, setCredentials] = useState<CredentialContainer[]>();

  usePromise(
    (signal) => getCredentials({ signal, context }),
    setCredentials,
    [],
  );

  const credentialRowCells = (
    credMetadata: CredentialMetadataRepresentation,
  ) => {
    const credential = credMetadata.credential;
    const maxWidth = {
      "--pf-v5-u-max-width--MaxWidth": "300px",
    } as CSSProperties;
    const items = [
      <DataListCell
        key="title"
        data-testrole="label"
        className="pf-v5-u-max-width"
        style={maxWidth}
      >
        {t(credential.userLabel) || t(credential.type as TFuncKey)}
      </DataListCell>,
    ];

    if (credential.createdDate) {
      items.push(
        <DataListCell
          key={"created" + credential.id}
          data-testrole="created-at"
        >
          <Trans
            i18nKey="credentialCreatedAt"
            values={{
              date: formatDate(
                new Date(credential.createdDate),
                context.environment.locale,
              ),
            }}
          >
            <strong className="pf-v5-u-mr-md"></strong>
          </Trans>
        </DataListCell>,
      );
    }
    if (
      credMetadata.infoMessage ||
      credMetadata.infoProperties ||
      (credMetadata.warningMessageTitle &&
        credMetadata.warningMessageDescription)
    ) {
      items.push(
        <DataListCell
          key={"warning-message" + credential.id}
          data-testrole="warning-message"
        >
          <>
            {credMetadata.infoMessage && (
              <p>
                <InfoAltIcon />{" "}
                {t(
                  credMetadata.infoMessage.key,
                  credMetadata.infoMessage.parameters?.reduce(
                    (acc, val, idx) => ({ ...acc, [idx]: val }),
                    {},
                  ),
                )}
              </p>
            )}
            {credMetadata.infoProperties && (
              <Split className="pf-v5-u-mb-lg">
                <SplitItem>
                  <InfoAltIcon />
                </SplitItem>
                <SplitItem isFilled className="pf-v5-u-ml-xs">
                  <DescriptionList
                    isHorizontal
                    horizontalTermWidthModifier={{
                      "2xl": "15ch",
                    }}
                  >
                    {credMetadata.infoProperties.map((prop) => (
                      <DescriptionListGroup key={prop.key}>
                        <DescriptionListTerm>{t(prop.key)}</DescriptionListTerm>
                        <DescriptionListDescription>
                          {prop.parameters ? prop.parameters[0] : ""}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    ))}
                  </DescriptionList>
                </SplitItem>
              </Split>
            )}
            {credMetadata.warningMessageTitle &&
              credMetadata.warningMessageDescription && (
                <>
                  <p>
                    <ExclamationTriangleIcon />{" "}
                    {t(
                      credMetadata.warningMessageTitle.key,
                      credMetadata.warningMessageTitle.parameters?.reduce(
                        (acc, val, idx) => ({ ...acc, [idx]: val }),
                        {},
                      ),
                    )}
                  </p>
                  <p>
                    {t(
                      credMetadata.warningMessageDescription.key,
                      credMetadata.warningMessageDescription.parameters?.reduce(
                        (acc, val, idx) => ({ ...acc, [idx]: val }),
                        {},
                      ),
                    )}
                  </p>
                </>
              )}
          </>
        </DataListCell>,
      );
    }
    return items;
  };

  if (!credentials) {
    return <Spinner />;
  }

  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category)),
  ];

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      {credentialUniqueCategories.map((category) => (
        <PageSection key={category} variant="light" className="pf-v5-u-px-0">
          <Title headingLevel="h2" size="xl" id={`${category}-categ-title`}>
            {t(category as TFuncKey)}
          </Title>
          {credentials
            .filter((cred) => cred.category == category)
            .map((container) => (
              <Fragment key={container.type}>
                <Split className="pf-v5-u-mt-lg pf-v5-u-mb-lg">
                  <SplitItem>
                    <Title
                      headingLevel="h3"
                      size="md"
                      className="pf-v5-u-mb-md"
                      data-testid={`${container.type}/help`}
                    >
                      <span
                        className="cred-title pf-v5-u-display-block"
                        data-testid={`${container.type}/title`}
                      >
                        {t(container.displayName as TFuncKey)}
                      </span>
                    </Title>
                    <span data-testid={`${container.type}/help-text`}>
                      {t(container.helptext as TFuncKey)}
                    </span>
                  </SplitItem>
                  {container.createAction && (
                    <SplitItem isFilled>
                      <div className="pf-v5-u-float-right">
                        <MobileLink
                          onClick={() =>
                            login({
                              action: container.createAction,
                            })
                          }
                          title={t("setUpNew", {
                            name: t(
                              `${container.type}-display-name` as TFuncKey,
                            ),
                          })}
                          testid={`${container.type}/create`}
                        />
                      </div>
                    </SplitItem>
                  )}
                </Split>

                <DataList
                  aria-label="credential list"
                  className="pf-v5-u-mb-xl"
                  data-testid={`${container.type}/credential-list`}
                >
                  {container.userCredentialMetadatas.length === 0 && (
                    <EmptyRow
                      message={t("notSetUp", {
                        name: t(container.displayName as TFuncKey),
                      })}
                      data-testid={`${container.type}/not-set-up`}
                    />
                  )}

                  {container.userCredentialMetadatas.map((meta) => (
                    <DataListItem key={meta.credential.id}>
                      <DataListItemRow id={`cred-${meta.credential.id}`}>
                        <DataListItemCells
                          className="pf-v5-u-py-0"
                          dataListCells={[
                            ...credentialRowCells(meta),
                            <DataListAction
                              key="action"
                              id={`action-${meta.credential.id}`}
                              aria-label={t("updateCredAriaLabel")}
                              aria-labelledby={`cred-${meta.credential.id}`}
                            >
                              {container.removeable && (
                                <Button
                                  variant="danger"
                                  data-testrole="remove"
                                  onClick={async () => {
                                    await login({
                                      action:
                                        "delete_credential:" +
                                        meta.credential.id,
                                    });
                                  }}
                                >
                                  {t("delete")}
                                </Button>
                              )}
                              {container.updateAction && (
                                <Button
                                  variant="secondary"
                                  onClick={async () => {
                                    await login({
                                      action: container.updateAction,
                                    });
                                  }}
                                  data-testrole="update"
                                >
                                  {t("update")}
                                </Button>
                              )}
                            </DataListAction>,
                          ]}
                        />
                      </DataListItemRow>
                    </DataListItem>
                  ))}
                </DataList>
              </Fragment>
            ))}
        </PageSection>
      ))}
    </Page>
  );
};

export default SigningIn;
