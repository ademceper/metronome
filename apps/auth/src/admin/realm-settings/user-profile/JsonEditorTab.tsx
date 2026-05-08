/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/JsonEditorTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useAlerts } from "../../../shared/keycloak-ui-shared";
import {
  ActionGroup,
  Button,
  Form,
  PageSection,
} from "../../../shared/@patternfly/react-core";
import CodeEditor from "../../components/form/CodeEditor";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { prettyPrintJSON } from "../../util";
import { useUserProfile } from "./UserProfileContext";

export const JsonEditorTab = () => {
  const { config, save, isSaving } = useUserProfile();
  const { t } = useTranslation();
  const { addError } = useAlerts();
  const [code, setCode] = useState(prettyPrintJSON(config));

  function resetCode() {
    setCode(config ? prettyPrintJSON(config) : "");
  }

  async function handleSave() {
    const value = code;

    if (!value) {
      return;
    }

    try {
      await save(JSON.parse(value));
    } catch (error) {
      addError("invalidJsonError", error);
      return;
    }
  }

  return (
    <PageSection variant="light">
      <CodeEditor
        language="json"
        value={code}
        onChange={(value) => setCode(value ?? "")}
        height={480}
      />
      <Form>
        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            onClick={handleSave}
            isDisabled={isSaving}
          >
            {t("save")}
          </Button>
          <Button variant="link" onClick={resetCode} isDisabled={isSaving}>
            {t("revert")}
          </Button>
        </ActionGroup>
      </Form>
    </PageSection>
  );
};
