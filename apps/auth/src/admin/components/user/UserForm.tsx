/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  UserProfileAttributeMetadata,
  UserProfileMetadata,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {
  FormErrorText,
  HelpItem,
  SwitchControl,
  TextControl,
  UserProfileFields,
  ContinueCancelModal,
} from "../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { Controller, FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { DefaultSwitchControl } from "../SwitchControl";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { FormAccess } from "../form/FormAccess";
import { GroupPickerDialog } from "../group/GroupPickerDialog";
import { useAccess } from "../../context/access/access";
import { useWhoAmI } from "../../context/whoami/who-am-i";
import { emailRegexPattern } from "../../util";
import useFormatDate from "../../utils/use-format-date";
import { FederatedUserLink } from "./FederatedUserLink";
import { UserFormFields, toUserFormFields } from "./form-state";
import { toUsers } from "../../lib/user";
import { FixedButtonsGroup } from "../form/FixedButtonGroup";
import { RequiredActionMultiSelect } from "./user-credentials/RequiredActionMultiSelect";
import { useNavigate } from "react-router-dom";
import { CopyToClipboardButton } from "../copy-to-clipboard-button/CopyToClipboardButton";
import { GroupResourceContext } from "../../context/group-resource/group-resource-context";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
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
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

export type BruteForced = {
  isBruteForceProtected?: boolean;
  isLocked?: boolean;
};

export type UserFormProps = {
  form: UseFormReturn<UserFormFields>;
  realm: RealmRepresentation;
  user?: UserRepresentation;
  bruteForce?: BruteForced;
  userProfileMetadata?: UserProfileMetadata;
  save: (user: UserFormFields) => void;
  refresh?: () => void;
  onGroupsUpdate?: (groups: GroupRepresentation[]) => void;
};

export const UserForm = ({
  form,
  realm,
  user,
  bruteForce: { isBruteForceProtected, isLocked } = {
    isBruteForceProtected: false,
    isLocked: false,
  },
  userProfileMetadata,
  save,
  refresh,
  onGroupsUpdate,
}: UserFormProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const { addAlert, addError } = useAlerts();
  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-users");
  const canViewFederationLink = hasAccess("view-realm");
  const { whoAmI } = useWhoAmI();

  const { handleSubmit, setValue, control, reset, formState } = form;
  const { errors } = formState;

  const [selectedGroups, setSelectedGroups] = useState<GroupRepresentation[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(isLocked);
  const navigate = useNavigate();

  useEffect(() => {
    setValue("requiredActions", user?.requiredActions || []);
  }, [user, setValue]);

  const unLockUser = async () => {
    try {
      await adminClient.users.update({ id: user!.id! }, { enabled: true });
      addAlert(t("unlockSuccess"), AlertVariant.success);
      if (refresh) {
        refresh();
      }
    } catch (error) {
      addError("unlockError", error);
    }
  };

  const deleteItem = (id: string) => {
    setSelectedGroups(selectedGroups.filter((item) => item.name !== id));
    onGroupsUpdate?.(selectedGroups);
  };

  const addChips = async (groups: GroupRepresentation[]): Promise<void> => {
    setSelectedGroups([...selectedGroups!, ...groups]);
    onGroupsUpdate?.([...selectedGroups!, ...groups]);
  };

  const addGroups = async (groups: GroupRepresentation[]): Promise<void> => {
    const newGroups = groups;

    newGroups.forEach(async (group) => {
      try {
        await adminClient.users.addToGroup({
          id: user!.id!,
          groupId: group.id!,
        });
        addAlert(t("addedGroupMembership"), AlertVariant.success);
      } catch (error) {
        addError("addedGroupMembershipError", error);
      }
    });
  };

  const toggleModal = () => {
    setOpen(!open);
  };

  const onFormReset = () => {
    if (user?.id) {
      reset(toUserFormFields(user));
    } else {
      navigate(toUsers({ realm: realm.realm! }));
    }
  };

  const allFieldsReadOnly = () =>
    user?.userProfileMetadata?.attributes &&
    !user?.userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true);

  const handleEmailVerificationReset = async () => {
    try {
      save(
        toUserFormFields({
          ...user,
          requiredActions: user?.requiredActions?.filter(
            (action) => action !== "UPDATE_EMAIL",
          ),
          attributes: {
            ...user?.attributes,
            "kc.email.pending": "",
          },
        }),
      );
      if (refresh) {
        refresh();
      }
    } catch (error) {
      addError("emailPendingVerificationUpdateError", error);
    }
  };

  return (
    <FormAccess
      isHorizontal
      onSubmit={handleSubmit(save)}
      role="query-users"
      fineGrainedAccess={user?.access?.manage}
      className="pf-v5-u-mt-lg"
    >
      <FormProvider {...form}>
        {open && (
          <GroupResourceContext value={adminClient.groups}>
            <GroupPickerDialog
              type="selectMany"
              text={{
                title: "selectGroups",
                ok: "join",
              }}
              canBrowse={isManager}
              onConfirm={async (groups) => {
                if (user?.id) {
                  await addGroups(groups || []);
                } else {
                  await addChips(groups || []);
                }

                setOpen(false);
              }}
              onClose={() => setOpen(false)}
              filterGroups={selectedGroups}
            />
          </GroupResourceContext>
        )}
        {user?.id && (
          <>
            <FormGroup label={t("id")} fieldId="kc-id" isRequired>
              <InputGroup>
                <InputGroupItem isFill>
                  <TextInput
                    id={user.id}
                    aria-label={t("userID")}
                    value={user.id}
                    readOnly
                  />
                </InputGroupItem>
                <InputGroupItem>
                  <CopyToClipboardButton
                    id={`user-${user.id}`}
                    text={user.id}
                    label={t("userID")}
                    variant="control"
                  />
                </InputGroupItem>
              </InputGroup>
            </FormGroup>
            <FormGroup
              label={t("createdAt")}
              fieldId="kc-created-at"
              isRequired
            >
              <TextInput
                value={formatDate(new Date(user.createdTimestamp!))}
                id="kc-created-at"
                readOnly
              />
            </FormGroup>
          </>
        )}
        <RequiredActionMultiSelect
          name="requiredActions"
          label="requiredUserActions"
          help="requiredUserActionsHelp"
        />
        {user?.federationLink && canViewFederationLink && (
          <FormGroup
            label={t("federationLink")}
            labelIcon={
              <HelpItem
                helpText={t("federationLinkHelp")}
                fieldLabelId="federationLink"
              />
            }
          >
            <FederatedUserLink user={user} />
          </FormGroup>
        )}
        {userProfileMetadata ? (
          <>
            <DefaultSwitchControl
              name="emailVerified"
              label={t("emailVerified")}
              labelIcon={t("emailVerifiedHelp")}
            />
            {user?.attributes?.["kc.email.pending"] && (
              <Alert
                variant={AlertVariant.warning}
                isInline
                isPlain
                title={t("emailPendingVerificationAlertTitle")}
              >
                {t("userNotYetConfirmedNewEmail", {
                  email: user.attributes!["kc.email.pending"],
                })}
                <ContinueCancelModal
                  buttonTitle={t("emailPendingVerificationResetAction")}
                  modalTitle={t("confirmEmailPendingVerificationAction")}
                  continueLabel={t("confirm")}
                  cancelLabel={t("cancel")}
                  buttonVariant="link"
                  onContinue={handleEmailVerificationReset}
                >
                  {t("emailPendingVerificationActionMessage")}
                </ContinueCancelModal>
              </Alert>
            )}
            <UserProfileFields
              form={form}
              userProfileMetadata={{
                ...userProfileMetadata,
                attributes: userProfileMetadata.attributes?.filter(
                  (attribute: UserProfileAttributeMetadata) => {
                    return attribute.name !== "kc.email.pending";
                  },
                ),
              }}
              hideReadOnly={!user}
              supportedLocales={realm.supportedLocales || []}
              currentLocale={whoAmI.locale}
              t={
                ((key: unknown, params) =>
                  t(key as string, params as any)) as TFunction
              }
            />
          </>
        ) : (
          <>
            {!realm.registrationEmailAsUsername && (
              <TextControl
                name="username"
                label={t("username")}
                readOnly={
                  !!user?.id &&
                  !realm.editUsernameAllowed &&
                  realm.editUsernameAllowed !== undefined
                }
                rules={{
                  required: t("required"),
                }}
              />
            )}
            <TextControl
              name="email"
              label={t("email")}
              type="email"
              rules={{
                pattern: {
                  value: emailRegexPattern,
                  message: t("emailInvalid"),
                },
              }}
            />
            <SwitchControl
              name="emailVerified"
              label={t("emailVerified")}
              labelIcon={t("emailVerifiedHelp")}
              labelOn={t("yes")}
              labelOff={t("no")}
            />
            <TextControl name="firstName" label={t("firstName")} />
            <TextControl name="lastName" label={t("lastName")} />
          </>
        )}
        {isBruteForceProtected && (
          <FormGroup
            label={t("temporaryLocked")}
            fieldId="temporaryLocked"
            labelIcon={
              <HelpItem
                helpText={t("temporaryLockedHelp")}
                fieldLabelId="temporaryLocked"
              />
            }
          >
            <Switch
              data-testid="user-locked-switch"
              id="temporaryLocked"
              onChange={async (_event, value) => {
                await unLockUser();
                setLocked(value);
              }}
              isChecked={locked}
              isDisabled={!locked}
              label={t("on")}
              labelOff={t("off")}
            />
          </FormGroup>
        )}
        {!user?.id && (
          <FormGroup
            label={t("groups")}
            fieldId="kc-groups"
            labelIcon={
              <HelpItem helpText={t("groupsHelp")} fieldLabelId="groups" />
            }
          >
            <Controller
              name="groups"
              defaultValue={[]}
              control={control}
              render={() => (
                <InputGroup>
                  <InputGroupItem>
                    <ChipGroup categoryName={" "}>
                      {selectedGroups.map((currentChip) => (
                        <Chip
                          key={currentChip.id}
                          onClick={() => deleteItem(currentChip.name!)}
                        >
                          {currentChip.path}
                        </Chip>
                      ))}
                    </ChipGroup>
                  </InputGroupItem>
                  <InputGroupItem>
                    <Button
                      id="kc-join-groups-button"
                      onClick={toggleModal}
                      variant="secondary"
                      data-testid="join-groups-button"
                    >
                      {t("joinGroups")}
                    </Button>
                  </InputGroupItem>
                </InputGroup>
              )}
            />
            {errors.requiredActions && (
              <FormErrorText message={t("required")} />
            )}
          </FormGroup>
        )}
      </FormProvider>
      <FixedButtonsGroup
        name="user-creation"
        saveText={user?.id ? t("save") : t("create")}
        reset={onFormReset}
        resetText={user?.id ? t("revert") : t("cancel")}
        isDisabled={allFieldsReadOnly()}
        isSubmit
      />
    </FormAccess>
  );
};
