/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/Banners.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { Warning as ExclamationTriangleIcon } from "@phosphor-icons/react"
import { useWhoAmI } from "../context/whoami/WhoAmI";
import { useTranslation } from "react-i18next";

const Banner = ({ variant, screenReaderText, children, ...props }: any) => (
  <div className={cn("px-4 py-2 text-sm",
    variant === "warning" && "bg-amber-100 text-amber-900",
    variant === "danger" && "bg-destructive/10 text-destructive",
    (props as any).className)} {...props}>
    {screenReaderText ? <span className="sr-only">{screenReaderText}</span> : null}
    {children}
  </div>
);
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

type WarnBannerProps = {
  msg: string;
  className?: string;
};

type EventsBannerType = "userEvents" | "adminEvents";

const WarnBanner = ({ msg, className }: WarnBannerProps) => {
  const { t } = useTranslation();

  return (
    <Banner
      screenReaderText={t(msg)}
      variant="gold"
      className={className || ""}
    >
      <Flex
        spaceItems={{ default: "spaceItemsSm" }}
        flexWrap={{ default: "wrap" }}
      >
        <FlexItem style={{ whiteSpace: "normal" }}>
          <ExclamationTriangleIcon style={{ marginRight: "0.3rem" }} />
          {t(msg)}
        </FlexItem>
      </Flex>
    </Banner>
  );
};

export const Banners = () => {
  const { whoAmI } = useWhoAmI();

  if (whoAmI.temporary) return <WarnBanner msg="loggedInAsTempAdminUser" />;
};

export const EventsBanners = ({ type }: { type: EventsBannerType }) => {
  const msg =
    type === "userEvents" ? "savingUserEventsOff" : "savingAdminEventsOff";

  return <WarnBanner msg={msg} className="pf-v5-u-mt-md pf-v5-u-mx-md" />;
};
