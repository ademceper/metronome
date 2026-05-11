/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/groups/Groups.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { getGroups } from "../api/methods";
import { Group } from "../api/representations";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";


const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const DataListCell = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);
const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemCells = ({ dataListCells, ...props }: any) => (
  <div className="flex flex-1 items-center gap-2" {...props}>{dataListCells}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);

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
    <Page title={t("groups")} description={t("groupDescriptionLabel")}>
      <DataList id="groups-list" aria-label={t("groups")} isCompact>
        <DataListItem
          id="groups-list-header"
          aria-label={t("groupsListHeader")}
        >
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="directMembership-header">
                  <Checkbox
                    label={t("directMembership")}
                    id="directMembership-checkbox"
                    data-testid="directMembership-checkbox"
                    isChecked={directMembership}
                    onChange={(_event, checked) => setDirectMembership(checked)}
                  />
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem
          id="groups-list-columns-names"
          aria-label={t("groupsListColumnsNames")}
        >
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell key="group-name-header" width={2}>
                  <strong>{t("name")}</strong>
                </DataListCell>,
                <DataListCell key="group-path-header" width={2}>
                  <strong>{t("path")}</strong>
                </DataListCell>,
                <DataListCell key="group-direct-membership-header" width={2}>
                  <strong>{t("directMembership")}</strong>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        {groups.map((group, appIndex) => (
          <DataListItem
            id={`${appIndex}-group`}
            key={"group-" + appIndex}
            aria-labelledby="groups-list"
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell
                    data-testid={`group[${appIndex}].name`}
                    width={2}
                    key={"name-" + appIndex}
                  >
                    {group.name}
                  </DataListCell>,
                  <DataListCell
                    id={`${appIndex}-group-path`}
                    width={2}
                    key={"path-" + appIndex}
                  >
                    {group.path}
                  </DataListCell>,
                  <DataListCell
                    id={`${appIndex}-group-directMembership`}
                    width={2}
                    key={"directMembership-" + appIndex}
                  >
                    <Checkbox
                      id={`${appIndex}-checkbox-directMembership`}
                      isChecked={group.id != null}
                      isDisabled={true}
                    />
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    </Page>
  );
};

export default Groups;
