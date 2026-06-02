import { Badge } from "@metronome/ui/components/badge";
import { Button } from "@metronome/ui/components/button";
import {
  LinkSimple as LinkIcon,
  LinkBreak as UnlinkIcon,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

import {
  IconMapper,
  label,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { useUnLinkAccount } from "../../lib/api";
import { LinkedAccount } from "../../lib/api";
import { useAccountAlerts } from "../../lib/use-account-alerts";

type AccountRowProps = {
  account: LinkedAccount;
  isLinked?: boolean;
};

export const AccountRow = ({ account, isLinked = false }: AccountRowProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;
  const { addAlert, addError } = useAccountAlerts();

  const unLink = useUnLinkAccount({
    onSuccess: () => addAlert(t("unLinkSuccess")),
    onError: (error) => addError("unLinkError", error),
  });

  return (
    <div
      id={`${account.providerAlias}-idp`}
      data-testid={`linked-accounts/${account.providerName}`}
      className="flex items-center gap-4 px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 text-muted-foreground">
          <IconMapper icon={account.providerName} />
        </span>
        <span
          id={`${account.providerAlias}-idp-name`}
          className="font-medium text-sm"
        >
          {label(t, account.displayName)}
        </span>
        <Badge variant="outline" id={`${account.providerAlias}-idp-label`}>
          {t(account.social ? "socialLogin" : "systemDefined")}
        </Badge>
        {account.linkedUsername && (
          <span
            id={`${account.providerAlias}-idp-username`}
            className="truncate text-muted-foreground text-sm"
          >
            {account.linkedUsername}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        id={
          isLinked
            ? `${account.providerAlias}-idp-unlink`
            : `${account.providerAlias}-idp-link`
        }
        onClick={async () => {
          if (isLinked) {
            await unLink.mutateAsync(account);
          } else {
            await login({ action: "idp_link:" + account.providerAlias });
          }
        }}
      >
        {isLinked ? (
          <UnlinkIcon className="me-1.5 size-3.5" />
        ) : (
          <LinkIcon className="me-1.5 size-3.5" />
        )}
        {isLinked ? t("unLink") : t("link")}
      </Button>
    </div>
  );
};
