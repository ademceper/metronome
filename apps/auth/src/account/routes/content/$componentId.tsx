import { createFileRoute, useParams } from "@tanstack/react-router";
import { Suspense, lazy, useMemo } from "react";
import { useEnvironment } from "../../../shared/keycloak-ui-shared";
import { MenuItem, navItems } from "../../lib/nav-items";
import { joinPath } from "../../lib/join-path";
import { RouteFallback } from "../-loading/route-fallback";

export const Route = createFileRoute("/content/$componentId")({
  component: ContentComponent,
});

function findComponent(
  content: MenuItem[],
  componentId: string,
): string | undefined {
  for (const item of content) {
    if (
      "path" in item &&
      item.path.endsWith(componentId) &&
      "modulePath" in item
    ) {
      return item.modulePath;
    }
    if ("children" in item) {
      return findComponent(item.children, componentId);
    }
  }
  return undefined;
}

function ContentComponent() {
  const { componentId } = useParams({ strict: false }) as {
    componentId?: string;
  };

  const modulePath = useMemo(
    () => findComponent(navItems, componentId!),
    [componentId],
  );

  return modulePath && <Component modulePath={modulePath} />;
}

type ComponentProps = {
  modulePath: string;
};

const Component = ({ modulePath }: ComponentProps) => {
  const { environment } = useEnvironment();

  const Element = lazy(
    () =>
      import(/* @vite-ignore */ joinPath(environment.resourceUrl, modulePath)),
  );
  return (
    <Suspense fallback={<RouteFallback />}>
      <Element />
    </Suspense>
  );
};
