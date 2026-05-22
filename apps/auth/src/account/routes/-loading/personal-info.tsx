import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../../shared/keycloak-ui-shared";
import { Page } from "../../components/page";
import { AccountEnvironment } from "../..";

export function PersonalInfoLoading() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  return (
    <Page
      title={t("personalInfo")}
      description={t("personalInfoDescription")}
      action={
        context.environment.features.deleteAccountAllowed ? (
          <Skeleton className="h-9 w-32" />
        ) : undefined
      }
    >
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-12 flex-1 rounded-md" />
          <Skeleton className="h-12 flex-1 rounded-md" />
        </div>
      </div>
    </Page>
  );
}
