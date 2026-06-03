/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/json-file-upload/FileUploadForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import {
  ChangeEvent,
  DragEvent as ReactDragEvent,
  MouseEvent as ReactMouseEvent,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import CodeEditor from "../form/CodeEditor";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const FileUpload = ({
  id, value, onChange, filename, onFileInputChange, accept, isReadOnly,
  isDisabled, children,
  // PF-only props that mustn't leak onto the DOM <input>.
  type: _type, hideDefaultPreview: _hideDefaultPreview,
  dropzoneProps: _dropzoneProps, isLoading: _isLoading,
  onDataChange: _onDataChange, onTextChange: _onTextChange,
  onClearClick: _onClearClick, onReadStarted: _onReadStarted,
  onReadFinished: _onReadFinished, allowEditingUploadedText: _aut,
  ...props
}: any) => (
  <div className="space-y-2">
    <UIInput
      id={id}
      type="file"
      accept={accept}
      disabled={isDisabled || isReadOnly}
      onChange={(e: any) => {
        const file = e.target.files?.[0];
        onChange?.(e, file?.name ?? "");
        onFileInputChange?.(e, file);
      }}
      {...props}
    />
    {children}
  </div>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const FormHelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-xs", className)} {...props}>{children}</div>
);
const HelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</div>
);
const HelperTextItem = ({ icon, variant, children, ...props }: any) => (
  <p className={cn("text-sm",
    variant === "error" ? "text-destructive" : variant === "warning" ? "text-amber-600" : "text-muted-foreground",
    (props as any).className)} {...props}>
    {icon}{children}
  </p>
);
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;
type DropEvent = any;
type FileUploadProps = React.ComponentProps<typeof FileUpload>;

type FileUploadType = {
  value: string;
  filename: string;
  isLoading: boolean;
  modal: boolean;
};

export type FileUploadEvent =
  | ReactDragEvent<HTMLElement> // User dragged/dropped a file
  | ChangeEvent<HTMLTextAreaElement> // User typed in the TextArea
  | ReactMouseEvent<HTMLButtonElement, MouseEvent>; // User clicked Clear button

export type FileUploadFormProps = Omit<FileUploadProps, "onChange"> & {
  id: string;
  extension: string;
  onChange: (value: string) => void;
  helpText?: string;
  unWrap?: boolean;
  language?: string;
  previewMaxLength?: number;
};

export const FileUploadForm = ({
  id,
  onChange,
  helpText = "helpFileUpload",
  unWrap = false,
  previewMaxLength = 102400, // 100KB
  language,
  extension,
  ...rest
}: FileUploadFormProps) => {
  const { t } = useTranslation();
  const defaultUpload: FileUploadType = {
    value: "",
    filename: "",
    isLoading: false,
    modal: false,
  };
  const [fileUpload, setFileUpload] = useState<FileUploadType>(defaultUpload);
  const removeDialog = () =>
    setFileUpload((prev) => ({ ...prev, modal: false }));

  const handleFileInputChange = (_event: DropEvent, file: File) => {
    setFileUpload((prev) => ({ ...prev, filename: file.name }));
  };

  const handleTextOrDataChange = (value: string) => {
    setFileUpload((prev) => ({ ...prev, value }));
    onChange(value);
  };

  const handleClear = () => {
    setFileUpload((prev) => ({ ...prev, modal: true }));
  };

  return (
    <>
      {fileUpload.modal && (
        <Modal
          variant={ModalVariant.small}
          title={t("clearFile")}
          isOpen
          onClose={removeDialog}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              data-testid="clear-button"
              onClick={() => {
                setFileUpload(defaultUpload);
                onChange("");
              }}
            >
              {t("clear")}
            </Button>,
            <Button
              data-testid="cancel"
              key="cancel"
              variant="link"
              onClick={removeDialog}
            >
              {t("cancel")}
            </Button>,
          ]}
        >
          {t("clearFileExplain")}
        </Modal>
      )}
      {unWrap && (
        <FileUpload
          id={id}
          {...rest}
          type="text"
          value={fileUpload.value}
          filename={fileUpload.filename}
          onFileInputChange={handleFileInputChange}
          onDataChange={(_, value) => handleTextOrDataChange(value)}
          onTextChange={(_, value) => handleTextOrDataChange(value)}
          onClearClick={handleClear}
          onReadStarted={() =>
            setFileUpload((prev) => ({ ...prev, isLoading: true }))
          }
          onReadFinished={() =>
            setFileUpload((prev) => ({ ...prev, isLoading: false }))
          }
          isLoading={fileUpload.isLoading}
          dropzoneProps={{
            accept: { "application/text": [extension] },
          }}
        />
      )}
      {!unWrap && (
        <FormGroup label={t("resourceFile")} fieldId={id + "-filename"}>
          <FileUpload
            data-testid={id}
            id={id}
            {...rest}
            type="text"
            value={fileUpload.value}
            filename={fileUpload.filename}
            onFileInputChange={handleFileInputChange}
            onDataChange={(_, value) => handleTextOrDataChange(value)}
            onTextChange={(_, value) => handleTextOrDataChange(value)}
            onClearClick={handleClear}
            onReadStarted={() =>
              setFileUpload((prev) => ({ ...prev, isLoading: true }))
            }
            onReadFinished={() =>
              setFileUpload((prev) => ({ ...prev, isLoading: false }))
            }
            isLoading={fileUpload.isLoading}
            hideDefaultPreview
          >
            {!rest.hideDefaultPreview &&
              (!fileUpload.value ||
              fileUpload.value.length < previewMaxLength ? (
                <CodeEditor
                  aria-label="File content"
                  value={fileUpload.value}
                  language={language}
                  onChange={(value) => handleTextOrDataChange(value)}
                  readOnly={!rest.allowEditingUploadedText}
                />
              ) : (
                <CodeEditor
                  aria-label="File content"
                  value={t("fileUploadPreviewDisabled")}
                  readOnly
                />
              ))}
          </FileUpload>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>{t(helpText)}</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      )}
    </>
  );
};
