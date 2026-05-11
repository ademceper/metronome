/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/content/ContentComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { Suspense, lazy, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { MenuItem } from "../root/PageNav";
import { ContentComponentParams } from "../routes";
import { joinPath } from "../utils/joinPath";
import { usePromise } from "../utils/usePromise";
import fetchContentJson from "./fetchContent";


const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

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

export const ContentComponent = () => {
  const context = useEnvironment();

  const [content, setContent] = useState<MenuItem[]>();
  const { componentId } = useParams<ContentComponentParams>();

  usePromise((signal) => fetchContentJson({ signal, context }), setContent);
  const modulePath = useMemo(
    () => findComponent(content || [], componentId!),
    [content, componentId],
  );

  return modulePath && <Component modulePath={modulePath} />;
};

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
    <Suspense fallback={<Spinner />}>
      <Element />
    </Suspense>
  );
};

export default ContentComponent;
