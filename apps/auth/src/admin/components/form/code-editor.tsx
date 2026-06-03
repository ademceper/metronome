/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/form/CodeEditor.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import CodeEditorComponent from "@uiw/react-textarea-code-editor";
import { useMemo } from "react";

type CodeEditorProps = {
  id?: string;
  "aria-label"?: string;
  "data-testid"?: string;
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  /* The height of the editor in pixels */
  height?: number;
};

const CodeEditor = ({
  onChange,
  height = 128,
  value,
  language,
  ...rest
}: CodeEditorProps) => {
  const codeEditor = useMemo(
    () => (
      <CodeEditorComponent
        padding={15}
        minHeight={height}
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
          fontSize: "16px",
        }}
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
        language={language}
        {...rest}
      />
    ),
    [value, language],
  );

  return (
    <div style={{ height: `${height}px`, overflow: "auto" }}>{codeEditor}</div>
  );
};

export default CodeEditor;
