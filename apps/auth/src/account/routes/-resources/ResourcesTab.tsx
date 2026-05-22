import { Badge } from "@metronome/ui/components/badge";
import { Button } from "@metronome/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu";
import {
  PencilSimple as EditIcon,
  DotsThreeVertical as EllipsisIcon,
  ArrowSquareOut as ExternalLinkIcon,
  Minus as RemoveIcon,
  Share as ShareIcon,
  CaretRight as CaretIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ContinueCancelModal,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { useResources, useUnshareResource } from "../../lib/api-client";
import { accountKeys } from "../../lib/api-client";
import { fetchPermission } from "../../lib/api-client";
import { Permission, Resource } from "../../lib/api-client";
import { useAccountAlerts } from "../../lib/use-account-alerts";
import { ResourcesTabLoading } from "../-loading/resources";
import { EditTheResource } from "./EditTheResource";
import { PermissionRequest } from "./PermissionRequest";
import { ResourceToolbar } from "./ResourceToolbar";
import { ShareTheResource } from "./ShareTheResource";
import { SharedWith } from "./SharedWith";

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
  const qc = useQueryClient();

  const [params, setParams] = useState<Record<string, string>>({
    first: "0",
    max: "5",
  });
  const [details, setDetails] = useState<
    Record<string, PermissionDetail | undefined>
  >({});

  const { data } = useResources(
    { query: params, isShared },
    { withPermissionRequests: !isShared }
  );

  const resources = data?.data;
  const links = data?.links;

  const removeShare = useUnshareResource({
    onSuccess: () => {
      setDetails({});
      addAlert(t("unShareSuccess"));
    },
    onError: (error) => addError("unShareError", error),
  });

  const refresh = () =>
    qc.invalidateQueries({ queryKey: accountKeys.resources() });

  if (!resources) {
    return <ResourcesTabLoading />;
  }

  const fetchPermissions = async (id: string) => {
    let permissions = details[id]?.permissions || [];
    if (!details[id]) {
      permissions = await fetchPermission({ context }, id);
    }
    return permissions;
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

  const cols = isShared
    ? "grid-cols-[2fr_2fr_2fr]"
    : "grid-cols-[2rem_2fr_2fr_2fr_max-content]";

  return (
    <div className="space-y-3">
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

      <div className="overflow-hidden rounded-md border">
        <div
          className={`grid ${cols} items-center gap-2 border-b bg-muted/40 px-4 py-3 font-medium text-sm`}
        >
          {!isShared && <span aria-hidden />}
          <span>{t("resourceName")}</span>
          <span>{t("application")}</span>
          <span>{isShared ? t("permissions") : t("permissionRequests")}</span>
          {!isShared && <span aria-hidden />}
        </div>
        <div className="divide-y">
          {resources.map((resource, index) => {
            const detail = details[resource._id];
            return (
              <div key={resource.name}>
                <div
                  className={`grid ${cols} items-center gap-2 px-4 py-3 text-sm`}
                >
                  {!isShared && (
                    <button
                      type="button"
                      data-testid={`expand-${resource.name}`}
                      onClick={() =>
                        toggleOpen(
                          resource._id,
                          "rowOpen",
                          !detail?.rowOpen,
                        )
                      }
                      aria-expanded={detail?.rowOpen}
                      className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <CaretIcon
                        className={[
                          "size-3.5 transition-transform",
                          detail?.rowOpen ? "rotate-90" : "",
                        ].join(" ")}
                      />
                    </button>
                  )}
                  <span
                    data-testid={`row[${index}].name`}
                    className="truncate"
                  >
                    {resource.name}
                  </span>
                  <a
                    href={resource.client.baseUrl}
                    className="inline-flex items-center gap-1 truncate text-foreground hover:underline"
                  >
                    <span className="truncate">
                      {resource.client.name || resource.client.clientId}
                    </span>
                    <ExternalLinkIcon className="size-3.5" />
                  </a>
                  <div className="flex flex-wrap items-center gap-1">
                    {isShared ? (
                      resource.scopes.length > 0 && (
                        <>
                          <span className="text-muted-foreground text-xs">
                            {t("permissions")}:
                          </span>
                          {resource.scopes.map((scope) => (
                            <Badge
                              key={scope.name}
                              variant="secondary"
                              className="font-normal"
                            >
                              {scope.displayName || scope.name}
                            </Badge>
                          ))}
                        </>
                      )
                    ) : (
                      <>
                        {resource.shareRequests &&
                          resource.shareRequests.length > 0 && (
                            <PermissionRequest
                              resource={resource}
                              refresh={() => refresh()}
                            />
                          )}
                        <ShareTheResource
                          resource={resource}
                          permissions={detail?.permissions}
                          open={detail?.shareDialogOpen || false}
                          onClose={() => setDetails({})}
                        />
                        {detail?.editDialogOpen && (
                          <EditTheResource
                            resource={resource}
                            permissions={detail?.permissions}
                            onClose={() => setDetails({})}
                          />
                        )}
                      </>
                    )}
                  </div>
                  {!isShared && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-testid={`share-${resource.name}`}
                        onClick={() =>
                          toggleOpen(resource._id, "shareDialogOpen", true)
                        }
                      >
                        <ShareIcon className="me-1.5 size-3.5" />
                        {t("share")}
                      </Button>
                      <DropdownMenu
                        open={!!detail?.contextOpen}
                        onOpenChange={(isOpen: boolean) =>
                          toggleOpen(resource._id, "contextOpen", isOpen)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t("actions")}
                          >
                            <EllipsisIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={detail?.permissions?.length === 0}
                            onClick={() =>
                              toggleOpen(resource._id, "editDialogOpen", true)
                            }
                          >
                            <EditIcon className="me-2 size-3.5" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <ContinueCancelModal
                            buttonTitle={
                              <>
                                <RemoveIcon className="me-2 size-3.5" />
                                {t("unShare")}
                              </>
                            }
                            modalTitle={t("unShare")}
                            continueLabel={t("confirm")}
                            cancelLabel={t("cancel")}
                            component={DropdownMenuItem}
                            onContinue={() => removeShare.mutate(resource)}
                            isDisabled={detail?.permissions?.length === 0}
                          >
                            {t("unShareAllConfirm")}
                          </ContinueCancelModal>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
                {detail?.rowOpen && (
                  <div className="border-t bg-muted/30 px-4 py-3 text-sm">
                    <SharedWith permissions={detail?.permissions} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
