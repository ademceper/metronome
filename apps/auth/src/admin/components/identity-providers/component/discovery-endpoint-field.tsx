/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/component/DiscoveryEndpointField.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import debouncePromise from "p-debounce";
import { ReactNode, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem, TextControl } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";


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
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

type DiscoveryEndpointFieldProps = {
  id: string;
  fileUpload: ReactNode;
  children: (readOnly: boolean) => ReactNode;
};

export const DiscoveryEndpointField = ({
  id,
  fileUpload,
  children,
}: DiscoveryEndpointFieldProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [discovery, setDiscovery] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] =
    useState<Record<string, string>>();

  const setupForm = (result: Record<string, string>) => {
    Object.keys(result).map((k) => setValue(`config.${k}`, result[k]));
  };

  const discover = async (fromUrl: string) => {
    setDiscovering(true);
    try {
      const result = await adminClient.identityProviders.importFromUrl({
        providerId: id,
        fromUrl,
      });
      setupForm(result);
      setDiscoveryResult(result);
    } catch (error) {
      return (error as Error).message;
    } finally {
      setDiscovering(false);
    }
  };

  const discoverDebounced = useMemo(() => debouncePromise(discover, 1000), []);

  return (
    <>
      <FormGroup
        label={t(
          id === "oidc" ? "useDiscoveryEndpoint" : "useEntityDescriptor",
        )}
        fieldId="kc-discovery-endpoint"
        labelIcon={
          <HelpItem
            helpText={t(
              id === "oidc"
                ? "useDiscoveryEndpointHelp"
                : "useEntityDescriptorHelp",
            )}
            fieldLabelId="discoveryEndpoint"
          />
        }
      >
        <Switch
          id="kc-discovery-endpoint-switch"
          label={t("on")}
          labelOff={t("off")}
          isChecked={discovery}
          onChange={(_event, checked) => {
            clearErrors("discoveryError");
            setDiscovery(checked);
          }}
          aria-label={t(
            id === "oidc" ? "useDiscoveryEndpoint" : "useEntityDescriptor",
          )}
        />
      </FormGroup>
      {discovery && (
        <>
          <div style={{ display: "none" }} data-testid="playwright-result">
            {errors.discoveryError || errors.discoveryEndpoint
              ? "error"
              : !discoveryResult
                ? "default"
                : "success"}
          </div>
          <TextControl
            name="discoveryEndpoint"
            label={t(
              id === "oidc" ? "discoveryEndpoint" : "samlEntityDescriptor",
            )}
            labelIcon={t(
              id === "oidc"
                ? "discoveryEndpointHelp"
                : "samlEntityDescriptorHelp",
            )}
            type="url"
            placeholder={
              id === "oidc"
                ? "https://hostname/realms/master/.well-known/openid-configuration"
                : ""
            }
            validated={
              errors.discoveryError || errors.discoveryEndpoint
                ? "error"
                : !discoveryResult
                  ? "default"
                  : "success"
            }
            customIcon={discovering ? <Spinner isInline /> : undefined}
            rules={{
              required: t("required"),
              validate: (value: string) => discoverDebounced(value),
            }}
          />
        </>
      )}
      {!discovery && fileUpload}
      {discovery && !errors.discoveryError && children(true)}
      {!discovery && children(false)}
    </>
  );
};
