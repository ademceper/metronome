/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/groups/Groups.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Checkbox } from "@metronome/ui/components/checkbox";
import { Label } from "@metronome/ui/components/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { getGroups } from "../api/methods";
import { Group } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";

export const Groups = () => {
  const { t } = useTranslation();
  const context = useEnvironment();

  const [groups, setGroups] = useState<Group[]>([]);
  const [directMembership, setDirectMembership] = useState(false);

  usePromise(
    (signal) => getGroups({ signal, context }),
    (groups) => {
      if (!directMembership) {
        groups.forEach((el) =>
          getParents(
            el,
            groups,
            groups.map(({ path }) => path),
          ),
        );
      }
      setGroups(groups);
    },
    [directMembership],
  );

  const getParents = (el: Group, groups: Group[], groupsPaths: string[]) => {
    const parentPath = el.path.slice(0, el.path.lastIndexOf("/"));
    if (parentPath && !groupsPaths.includes(parentPath)) {
      el = {
        name: parentPath.slice(parentPath.lastIndexOf("/") + 1),
        path: parentPath,
      };
      groups.push(el);
      groupsPaths.push(parentPath);

      getParents(el, groups, groupsPaths);
    }
  };

  return (
    <Page
      title={t("groups")}
      description={t("groupDescriptionLabel")}
      action={
        <div className="flex items-center gap-2">
          <Checkbox
            id="directMembership-checkbox"
            data-testid="directMembership-checkbox"
            checked={directMembership}
            onCheckedChange={(checked: boolean) =>
              setDirectMembership(checked)
            }
          />
          <Label htmlFor="directMembership-checkbox" className="text-sm">
            {t("directMembership")}
          </Label>
        </div>
      }
    >
      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[2fr_2fr_max-content] items-center gap-4 border-b bg-muted/40 px-4 py-3 font-medium text-sm">
          <span>{t("name")}</span>
          <span>{t("path")}</span>
          <span>{t("directMembership")}</span>
        </div>
        <div className="divide-y">
          {groups.map((group, appIndex) => (
            <div
              key={"group-" + appIndex}
              id={`${appIndex}-group`}
              className="grid grid-cols-[2fr_2fr_max-content] items-center gap-4 px-4 py-3 text-sm"
            >
              <span data-testid={`group[${appIndex}].name`}>{group.name}</span>
              <span
                id={`${appIndex}-group-path`}
                className="truncate text-muted-foreground"
              >
                {group.path}
              </span>
              <Checkbox
                id={`${appIndex}-checkbox-directMembership`}
                checked={group.id != null}
                disabled
              />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
};

export default Groups;
