/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/FlowTitle.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { GitBranch as CodeBranchIcon, MapPin as MapMarkerIcon, Robot as ProcessAutomationIcon, CheckSquare as TaskIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";
import { useAuthenticationProvider } from "./authentication-provider-context";
import { FlowType } from "./flow-row";


const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);

type FlowTitleProps = {
  id?: string;
  type: FlowType;
  title: string;
  subtitle: string;
  providerId?: string;
};

const FlowIcon = ({ type }: { type: FlowType }) => {
  switch (type) {
    case "condition":
      return <TaskIcon />;
    case "flow":
      return <CodeBranchIcon />;
    case "execution":
      return <ProcessAutomationIcon />;
    case "step":
      return <MapMarkerIcon />;
    default:
      return undefined;
  }
};

function mapTypeToColor(type: FlowType) {
  switch (type) {
    case "condition":
      return "purple";
    case "flow":
      return "green";
    case "execution":
      return "blue";
    case "step":
      return "cyan";
    default:
      return "grey";
  }
}

export const FlowTitle = ({
  id,
  type,
  title,
  subtitle,
  providerId,
}: FlowTitleProps) => {
  const { t } = useTranslation();
  const { providers } = useAuthenticationProvider();
  const helpText =
    providers?.find((p) => p.id === providerId)?.description || subtitle;
  return (
    <div data-testid={title}>
      <span data-id={id} id={`title-id-${id}`}>
        <Label icon={<FlowIcon type={type} />} color={mapTypeToColor(type)}>
          {t(type)}
        </Label>{" "}
        {title}{" "}
        {helpText && <HelpItem helpText={helpText} fieldLabelId={id!} />}
      </span>
    </div>
  );
};
