/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ResourcesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  ContinueCancelModal,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { PencilSimple as EditAltIcon, DotsThreeVertical as EllipsisVIcon, ArrowSquareOut as ExternalLinkAltIcon, Minus as Remove2Icon, Share as ShareAltIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
const ExpandableRowContent = ({ children }: any) => <>{children}</>;
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchPermission, fetchResources, updatePermissions } from "../api";
import { getPermissionRequests } from "../api/methods";
import { Links } from "../api/parse-links";
import { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";
import { EditTheResource } from "./EditTheResource";
import { PermissionRequest } from "./PermissionRequest";
import { ResourceToolbar } from "./ResourceToolbar";
import { ShareTheResource } from "./ShareTheResource";
import { SharedWith } from "./SharedWith";


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
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const OverflowMenu = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const OverflowMenuContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const OverflowMenuControl = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const OverflowMenuDropdownItem = ({ onClick, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} {...props}>{children}</UIDropdownMenuItem>
);
const OverflowMenuGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const OverflowMenuItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

type PermissionDetail = {
  contextOpen?: boolean;
  rowOpen?: boolean;
  shareDialogOpen?: boolean;
  editDialogOpen?: boolean;
  permissions?: Permission[];
};

type ResourcesTabProps = {
  isShared?: boolean;
};

export const ResourcesTab = ({ isShared = false }: ResourcesTabProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [params, setParams] = useState<Record<string, string>>({
    first: "0",
    max: "5",
  });
  const [links, setLinks] = useState<Links | undefined>();
  const [resources, setResources] = useState<Resource[]>();
  const [details, setDetails] = useState<
    Record<string, PermissionDetail | undefined>
  >({});
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    async (signal) => {
      const result = await fetchResources(
        { signal, context },
        params,
        isShared,
      );
      if (!isShared)
        await Promise.all(
          result.data.map(
            async (r) =>
              (r.shareRequests = await getPermissionRequests(r._id, {
                signal,
                context,
              })),
          ),
        );
      return result;
    },
    ({ data, links }) => {
      setResources(data);
      setLinks(links);
    },
    [params, key],
  );

  if (!resources) {
    return <Spinner />;
  }

  const fetchPermissions = async (id: string) => {
    let permissions = details[id]?.permissions || [];
    if (!details[id]) {
      permissions = await fetchPermission({ context }, id);
    }
    return permissions;
  };

  const removeShare = async (resource: Resource) => {
    try {
      const permissions = (await fetchPermissions(resource._id)).map(
        ({ username }) =>
          ({
            username,
            scopes: [],
          }) as Permission,
      )!;
      await updatePermissions(context, resource._id, permissions);
      setDetails({});
      addAlert(t("unShareSuccess"));
    } catch (error) {
      addError("unShareError", error);
    }
  };

  const toggleOpen = async (
    id: string,
    field: keyof PermissionDetail,
    open: boolean,
  ) => {
    const permissions = await fetchPermissions(id);

    setDetails({
      ...details,
      [id]: { ...details[id], [field]: open, permissions },
    });
  };

  return (
    <>
      <ResourceToolbar
        onFilter={(name) => setParams({ ...params, name })}
        count={resources.length}
        first={parseInt(params["first"])}
        max={parseInt(params["max"])}
        onNextClick={() => setParams(links?.next || {})}
        onPreviousClick={() => setParams(links?.prev || {})}
        onPerPageSelect={(first, max) =>
          setParams({ first: `${first}`, max: `${max}` })
        }
        hasNext={!!links?.next}
      />
      <Table aria-label={t("resources")}>
        <Thead>
          <Tr>
            <Th aria-hidden="true" />
            <Th>{t("resourceName")}</Th>
            <Th>{t("application")}</Th>
            <Th aria-hidden={isShared}>
              {!isShared ? t("permissionRequests") : ""}
            </Th>
          </Tr>
        </Thead>
        {resources.map((resource, index) => (
          <Tbody
            key={resource.name}
            isExpanded={details[resource._id]?.rowOpen}
          >
            <Tr>
              <Td
                data-testid={`expand-${resource.name}`}
                expand={
                  !isShared
                    ? {
                        isExpanded: details[resource._id]?.rowOpen || false,
                        rowIndex: index,
                        onToggle: () =>
                          toggleOpen(
                            resource._id,
                            "rowOpen",
                            !details[resource._id]?.rowOpen,
                          ),
                      }
                    : undefined
                }
              />
              <Td
                dataLabel={t("resourceName")}
                data-testid={`row[${index}].name`}
              >
                {resource.name}
              </Td>
              <Td dataLabel={t("application")}>
                <a href={resource.client.baseUrl}>
                  {resource.client.name || resource.client.clientId}{" "}
                  <ExternalLinkAltIcon />
                </a>
              </Td>
              <Td dataLabel={t("permissionRequests")}>
                {resource.shareRequests &&
                  resource.shareRequests.length > 0 && (
                    <PermissionRequest
                      resource={resource}
                      refresh={() => refresh()}
                    />
                  )}
                <ShareTheResource
                  resource={resource}
                  permissions={details[resource._id]?.permissions}
                  open={details[resource._id]?.shareDialogOpen || false}
                  onClose={() => setDetails({})}
                />
                {details[resource._id]?.editDialogOpen && (
                  <EditTheResource
                    resource={resource}
                    permissions={details[resource._id]?.permissions}
                    onClose={() => setDetails({})}
                  />
                )}
              </Td>
              {isShared ? (
                <Td>
                  {resource.scopes.length > 0 && (
                    <ChipGroup categoryName={t("permissions")}>
                      {resource.scopes.map((scope) => (
                        <Chip key={scope.name} isReadOnly>
                          {scope.displayName || scope.name}
                        </Chip>
                      ))}
                    </ChipGroup>
                  )}
                </Td>
              ) : (
                <Td isActionCell>
                  <OverflowMenu breakpoint="lg">
                    <OverflowMenuContent>
                      <OverflowMenuGroup groupType="button">
                        <OverflowMenuItem>
                          <Button
                            data-testid={`share-${resource.name}`}
                            variant="link"
                            onClick={() =>
                              toggleOpen(resource._id, "shareDialogOpen", true)
                            }
                          >
                            <ShareAltIcon /> {t("share")}
                          </Button>
                        </OverflowMenuItem>
                        <OverflowMenuItem>
                          <Dropdown
                            popperProps={{
                              position: "right",
                            }}
                            onOpenChange={(isOpen) =>
                              toggleOpen(resource._id, "contextOpen", isOpen)
                            }
                            toggle={(ref) => (
                              <MenuToggle
                                variant="plain"
                                ref={ref}
                                onClick={() =>
                                  toggleOpen(
                                    resource._id,
                                    "contextOpen",
                                    !details[resource._id]?.contextOpen,
                                  )
                                }
                                isExpanded={details[resource._id]?.contextOpen}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                            isOpen={!!details[resource._id]?.contextOpen}
                          >
                            <DropdownList>
                              <DropdownItem
                                isDisabled={
                                  details[resource._id]?.permissions?.length ===
                                  0
                                }
                                onClick={() =>
                                  toggleOpen(
                                    resource._id,
                                    "editDialogOpen",
                                    true,
                                  )
                                }
                              >
                                <EditAltIcon /> {t("edit")}
                              </DropdownItem>
                              <ContinueCancelModal
                                buttonTitle={
                                  <>
                                    <Remove2Icon /> {t("unShare")}
                                  </>
                                }
                                modalTitle={t("unShare")}
                                continueLabel={t("confirm")}
                                cancelLabel={t("cancel")}
                                component={DropdownItem}
                                onContinue={() => removeShare(resource)}
                                isDisabled={
                                  details[resource._id]?.permissions?.length ===
                                  0
                                }
                              >
                                {t("unShareAllConfirm")}
                              </ContinueCancelModal>
                            </DropdownList>
                          </Dropdown>
                        </OverflowMenuItem>
                      </OverflowMenuGroup>
                    </OverflowMenuContent>
                    <OverflowMenuControl>
                      <Dropdown
                        popperProps={{
                          position: "right",
                        }}
                        onOpenChange={(isOpen) =>
                          toggleOpen(resource._id, "contextOpen", isOpen)
                        }
                        toggle={(ref) => (
                          <MenuToggle
                            variant="plain"
                            ref={ref}
                            isExpanded={details[resource._id]?.contextOpen}
                            onClick={() =>
                              toggleOpen(
                                resource._id,
                                "contextOpen",
                                !details[resource._id]?.contextOpen,
                              )
                            }
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        isOpen={!!details[resource._id]?.contextOpen}
                      >
                        <DropdownList>
                          <OverflowMenuDropdownItem
                            key="share"
                            isShared
                            onClick={() =>
                              toggleOpen(resource._id, "shareDialogOpen", true)
                            }
                          >
                            <ShareAltIcon /> {t("share")}
                          </OverflowMenuDropdownItem>
                          <OverflowMenuDropdownItem
                            key="edit"
                            isShared
                            onClick={() =>
                              toggleOpen(resource._id, "editDialogOpen", true)
                            }
                            isDisabled={
                              details[resource._id]?.permissions?.length === 0
                            }
                          >
                            <EditAltIcon /> {t("edit")}
                          </OverflowMenuDropdownItem>
                          <ContinueCancelModal
                            key="unShare"
                            buttonTitle={
                              <>
                                <Remove2Icon /> {t("unShare")}
                              </>
                            }
                            modalTitle={t("unShare")}
                            continueLabel={t("confirm")}
                            cancelLabel={t("cancel")}
                            component={OverflowMenuDropdownItem}
                            onContinue={() => removeShare(resource)}
                            isDisabled={
                              details[resource._id]?.permissions?.length === 0
                            }
                          >
                            {t("unShareAllConfirm")}
                          </ContinueCancelModal>
                        </DropdownList>
                      </Dropdown>
                    </OverflowMenuControl>
                  </OverflowMenu>
                </Td>
              )}
            </Tr>
            <Tr isExpanded={details[resource._id]?.rowOpen || false}>
              <Td colSpan={4} textCenter>
                <ExpandableRowContent>
                  <SharedWith
                    permissions={details[resource._id]?.permissions}
                  />
                </ExpandableRowContent>
              </Td>
            </Tr>
          </Tbody>
        ))}
      </Table>
    </>
  );
};
