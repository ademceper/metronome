// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import {
  ClientScopeDefaultOptionalType,
  changeScope,
} from "../../../components/client-scope/client-scope-types";
import { ViewHeader } from "../../../components/view-header/view-header";
import { useRealm } from "../../../context/realm-context/realm-context";
import { convertFormValuesToObject } from "../../../util";
import { ScopeForm } from "../../../components/client-scopes/details/scope-form";
import { toClientScope } from "../../../lib/client-scopes";

const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

function CreateClientScope() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const onSubmit = async (formData: ClientScopeDefaultOptionalType) => {
    const clientScope = convertFormValuesToObject({
      ...formData,
      name: formData.name?.trim().replace(/ /g, "_"),
    });

    try {
      await adminClient.clientScopes.create(clientScope);

      const scope = await adminClient.clientScopes.findOneByName({
        name: clientScope.name!,
      });

      if (!scope) {
        throw new Error(t("notFound"));
      }

      await changeScope(
        adminClient,
        { ...clientScope, id: scope.id },
        clientScope.type,
      );

      addAlert(t("createClientScopeSuccess", AlertVariant.success));

      navigate(
        toClientScope({
          realm,
          id: scope.id!,
          tab: "settings",
        }),
      );
    } catch (error) {
      addError("createClientScopeError", error);
    }
  };

  return (
    <>
      <ViewHeader titleKey="createClientScope" />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <PageSection variant="light">
          <ScopeForm save={onSubmit} />
        </PageSection>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/client-scopes/new")({
  component: CreateClientScope,
})
