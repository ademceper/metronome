import { Checkbox } from "@metronome/ui/components/checkbox";
import { Label } from "@metronome/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Page } from "../components/page";
import { useGroups } from "../lib/api/hooks";
import { Group } from "../lib/api/representations";

export const Route = createFileRoute("/groups")({
  component: Groups,
});

function expandParents(groups: Group[]): Group[] {
  const out = [...groups];
  const paths = new Set(out.map(({ path }) => path));
  for (const el of [...out]) {
    let parentPath = el.path.slice(0, el.path.lastIndexOf("/"));
    while (parentPath && !paths.has(parentPath)) {
      const parent: Group = {
        name: parentPath.slice(parentPath.lastIndexOf("/") + 1),
        path: parentPath,
      };
      out.push(parent);
      paths.add(parentPath);
      parentPath = parentPath.slice(0, parentPath.lastIndexOf("/"));
    }
  }
  return out;
}

function Groups() {
  const { t } = useTranslation();
  const [directMembership, setDirectMembership] = useState(false);

  const { data: fetched = [] } = useGroups();
  const groups = useMemo(
    () => (directMembership ? fetched : expandParents(fetched)),
    [fetched, directMembership]
  );

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
}
