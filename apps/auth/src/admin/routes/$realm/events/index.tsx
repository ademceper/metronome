// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { usePageHeader } from "@metronome/ui/blocks/layout/page-header"
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../../components/routable-tabs/RoutableTabs";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/realm-context";
import helpUrls from "../../../help-urls";
import { toRealmSettings } from "../../../lib/realm-settings";
import { AdminEvents } from "../../../components/events/AdminEvents";
import { UserEvents } from "../../../components/events/UserEvents";
import { toEvents } from "../../../lib/events";
import { Tab, TabTitleText } from "../../../../shared/pf-compat"

const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

function EventsSection() {
  const { t } = useTranslation();
  usePageHeader({ title: t("events"), description: t("eventExplain") });
  const { realm } = useRealm();

  const userEventsTab = useRoutableTab(toEvents({ realm, tab: "user-events" }));
  const adminEventsTab = useRoutableTab(
    toEvents({ realm, tab: "admin-events" }),
  );

  return (
    <>
      <ViewHeader
        titleKey="titleEvents"
        subKey={
          <Trans i18nKey="eventExplain">
            If you want to configure user events, Admin events or Event
            listeners, please enter
            <Link to={toRealmSettings({ realm, tab: "events" })}>
              {t("eventConfig")}
            </Link>
            page realm settings to configure.
          </Trans>
        }
        helpUrl={helpUrls.eventsUrl}
        divider={false}
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <RoutableTabs
          isBox
          defaultLocation={toEvents({ realm, tab: "user-events" })}
        >
          <Tab
            title={<TabTitleText>{t("userEvents")}</TabTitleText>}
            {...userEventsTab}
          >
            <UserEvents />
          </Tab>
          <Tab
            title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
            data-testid="admin-events-tab"
            {...adminEventsTab}
          >
            <AdminEvents />
          </Tab>
        </RoutableTabs>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/events/")({
  component: () => (
    <div className="[&_[data-slot=tabs-list]]:hidden">
      <EventsSection />
    </div>
  ),
})
