/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/oid4vci/Oid4Vci.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@metronome/ui/components/select";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIssuer, requestVCOffer } from "../api";
import { CredentialsIssuer } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";

export const Oid4Vci = () => {
  const context = useEnvironment();
  const { t } = useTranslation();
  const initialSelected = t("verifiableCredentialsSelectionDefault");

  const [selected, setSelected] = useState<string>(initialSelected);
  const [qrCode, setQrCode] = useState<string>("");
  const [offerQRVisible, setOfferQRVisible] = useState<boolean>(false);
  const [credentialsIssuer, setCredentialsIssuer] =
    useState<CredentialsIssuer>();

  usePromise(() => getIssuer(context), setCredentialsIssuer);

  const selectOptions = useMemo(() => {
    if (typeof credentialsIssuer !== "undefined") {
      return credentialsIssuer.credential_configurations_supported;
    }
    return {};
  }, [credentialsIssuer]);

  const dropdownItems = useMemo(() => {
    if (typeof selectOptions !== "undefined") {
      return Array.from(Object.keys(selectOptions));
    }
    return [];
  }, [selectOptions]);

  useEffect(() => {
    if (initialSelected !== selected && credentialsIssuer !== undefined) {
      requestVCOffer(context, selectOptions[selected], credentialsIssuer).then(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            const result = reader.result;
            if (typeof result === "string") {
              setQrCode(result);
              setOfferQRVisible(true);
            }
          };
        },
      );
    }
  }, [selected]);

  return (
    <Page
      title={t("verifiableCredentialsTitle")}
      description={t("verifiableCredentialsDescription")}
    >
      <div className="space-y-6">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger
            data-testid="menu-toggle"
            className="w-full max-w-md"
          >
            <SelectValue placeholder={initialSelected} />
          </SelectTrigger>
          <SelectContent>
            {dropdownItems.map((option) => (
              <SelectItem
                key={option}
                value={option}
                data-testid={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {offerQRVisible && (
          <div className="flex justify-center">
            <img
              width="500"
              height="500"
              src={qrCode}
              alt="credential offer QR code"
              data-testid="qr-code"
              className="rounded-md border"
            />
          </div>
        )}
      </div>
    </Page>
  );
};

export default Oid4Vci;
