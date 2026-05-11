/* eslint-disable */
// @ts-nocheck

import { createFileRoute, useParams } from "@tanstack/react-router";
import { Suspense, lazy, useMemo, useState } from "react";
import { useEnvironment } from "../../../shared/keycloak-ui-shared";
import { MenuItem } from "../../app/PageNav";
import { joinPath } from "../../lib/joinPath";
import { usePromise } from "../../lib/usePromise";
import fetchContentJson from "../../nav/fetchContent";
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
  const context = useEnvironment();

  const [content, setContent] = useState<MenuItem[]>();
  const { componentId } = useParams({ strict: false }) as {
    componentId?: string;
  };

  usePromise((signal) => fetchContentJson({ signal, context }), setContent);
  const modulePath = useMemo(
    () => findComponent(content || [], componentId!),
    [content, componentId],
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
