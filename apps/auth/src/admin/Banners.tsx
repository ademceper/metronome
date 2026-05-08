/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/Banners.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Banner, Flex, FlexItem } from "../shared/@patternfly/react-core";
import { ExclamationTriangleIcon } from "../shared/@patternfly/react-icons";
import { useWhoAmI } from "./context/whoami/WhoAmI";
import { useTranslation } from "react-i18next";

import style from "./banners.module.css";

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
      className={className || style.banner}
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
