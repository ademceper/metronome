// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { cn } from "@metronome/ui/lib/utils";
import { Wizard, WizardFooter, WizardStep, useWizardContext } from "../../../../shared/wizard";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../../components/form/form-access";
import { ViewHeader } from "../../../components/view-header/view-header";
import { useRealm } from "../../../context/realm-context/realm-context";
import { convertFormValuesToObject } from "../../../util";
import { FormFields } from "../../../components/clients/client-details";
import { toClient } from "../../../lib/clients";
import { toClients } from "../../../lib/clients";
import { CapabilityConfig } from "../../../components/clients/add/capability-config";
import { GeneralSettings } from "../../../components/clients/add/general-settings";
import { LoginSettings } from "../../../components/clients/add/login-settings";
import { useState } from "react";

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

const NewClientFooter = (newClientForm: any) => {
  const { t } = useTranslation();
  const { trigger } = newClientForm;
  const { activeStep, goToNextStep, goToPrevStep, close } = useWizardContext();

  const forward = async (onNext: () => void) => {
    if (!(await trigger())) {
      return;
    }
    onNext?.();
  };

  return (
    <WizardFooter
      activeStep={activeStep}
      onNext={() => forward(goToNextStep)}
      onBack={goToPrevStep}
      onClose={close}
      isBackDisabled={activeStep.index === 1}
      backButtonText={t("back")}
      nextButtonText={t("next")}
      cancelButtonText={t("cancel")}
    />
  );
};

function NewClientForm() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const navigate = useNavigate();
  const [saving, setSaving] = useState<boolean>(false);

  const { addAlert, addError } = useAlerts();
  const form = useForm<FormFields>({
    defaultValues: {
      protocol: "openid-connect",
      clientId: "",
      name: "",
      description: "",
      publicClient: true,
      authorizationServicesEnabled: false,
      serviceAccountsEnabled: false,
      implicitFlowEnabled: false,
      directAccessGrantsEnabled: false,
      standardFlowEnabled: true,
      frontchannelLogout: true,
      attributes: {
        saml_idp_initiated_sso_url_name: "",
      },
    },
  });
  const { getValues, watch } = form;
  const protocol = watch("protocol");

  const save = async () => {
    if (saving) return;
    setSaving(true);
    const client = convertFormValuesToObject(getValues());
    try {
      const newClient = await adminClient.clients.create({
        ...client,
        clientId: client.clientId?.trim(),
      });
      addAlert(t("createClientSuccess"), AlertVariant.success);
      navigate(toClient({ realm, clientId: newClient.id, tab: "settings" }));
    } catch (error) {
      addError("createClientError", error);
    } finally {
      setSaving(false);
    }
  };

  const title = t("createClient");
  return (
    <>
      <ViewHeader titleKey="createClient" subKey="clientsExplain" />
      <PageSection variant="light">
        <FormProvider {...form}>
          <Wizard
            onClose={() => navigate(toClients({ realm }))}
            navAriaLabel={`${title} steps`}
            onSave={save}
            isProgressive
            footer={<NewClientFooter {...form} />}
          >
            <WizardStep
              name={t("generalSettings")}
              id="generalSettings"
              key="generalSettings"
            >
              <GeneralSettings />
            </WizardStep>
            <WizardStep
              name={t("capabilityConfig")}
              id="capabilityConfig"
              key="capabilityConfig"
              isHidden={protocol === "saml"}
            >
              <CapabilityConfig protocol={protocol} />
            </WizardStep>
            <WizardStep
              name={t("loginSettings")}
              id="loginSettings"
              key="loginSettings"
              footer={{
                backButtonText: t("back"),
                nextButtonText: t("save"),
                cancelButtonText: t("cancel"),
              }}
            >
              <FormAccess isHorizontal role="manage-clients">
                <LoginSettings protocol={protocol} />
              </FormAccess>
            </WizardStep>
          </Wizard>
        </FormProvider>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/add-client")({
  component: NewClientForm,
})
