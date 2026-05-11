import * as React from "react";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@metronome/ui/components/select";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIssuer, requestVCOffer } from "../lib/api/resources";
import { Page } from "../components/Page";

export const Route = createFileRoute("/oid4vci")({
  component: Oid4Vci,
});

function Oid4Vci() {
  const context = useEnvironment();
  const { t } = useTranslation();
  const initialSelected = t("verifiableCredentialsSelectionDefault");

  const [selected, setSelected] = useState<string>(initialSelected);
  const [qrCode, setQrCode] = useState<string>("");
  const [offerQRVisible, setOfferQRVisible] = useState<boolean>(false);

  const { data: credentialsIssuer } = useQuery({
    queryKey: ["account", "oid4vci", "issuer"],
    queryFn: () => getIssuer(context),
  });

  const selectOptions = useMemo(
    () => credentialsIssuer?.credential_configurations_supported ?? {},
    [credentialsIssuer],
  );
  const dropdownItems = useMemo(
    () => Object.keys(selectOptions),
    [selectOptions],
  );

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
}
