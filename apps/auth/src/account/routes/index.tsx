import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import { Form } from "@metronome/ui/components/form"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import type { TFunction } from "i18next"
import { useEffect, useMemo } from "react"
import { type ErrorOption, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { type AccountEnvironment } from ".."
import {
  UserProfileFields,
  beerify,
  debeerify,
  setUserProfileServerError,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import { Page } from "../components/page"
import type { TFuncKey } from "../i18n/types"
import {
  usePersonalInfo,
  useSavePersonalInfo,
  useSupportedLocales,
} from "../lib/api"
import type {
  UserProfileMetadata,
  User,
} from "../lib/api"
import { useAccountAlerts } from "../lib/use-account-alerts"
import {
  type PersonalInfoFormValues,
  personalInfoSchema,
} from "../schemas/personal-info"
import { PersonalInfoLoading } from "./-loading/personal-info"

export const Route = createFileRoute("/")({
  component: PersonalInfo,
})

function PersonalInfo() {
  const { data, isPending } = usePersonalInfo()
  const { data: supportedLocales = [] } = useSupportedLocales()

  if (isPending || !data?.userProfileMetadata) {
    return <PersonalInfoLoading />
  }

  return (
    <PersonalInfoForm
      initialData={data}
      metadata={data.userProfileMetadata}
      supportedLocales={supportedLocales}
    />
  )
}

type PersonalInfoFormProps = {
  initialData: User
  metadata: UserProfileMetadata
  supportedLocales: string[]
}

function PersonalInfoForm({
  initialData,
  metadata,
  supportedLocales,
}: PersonalInfoFormProps) {
  const { t } = useTranslation()
  const context = useEnvironment<AccountEnvironment>()
  const { addAlert } = useAccountAlerts()

  const schema = useMemo(() => personalInfoSchema(t, metadata), [t, metadata])
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialData as PersonalInfoFormValues,
  })
  const { handleSubmit, reset, setValue, setError } = form

  useEffect(() => {
    reset(initialData as PersonalInfoFormValues)
    Object.entries(initialData.attributes || {}).forEach(([k, v]) =>
      setValue(`attributes.${beerify(k)}` as never, v as never)
    )
  }, [initialData, reset, setValue])

  const save = useSavePersonalInfo({
    onSuccess: (_data, variables) => {
      const locale = (variables as any).attributes?.locale?.toString()
      if (locale) {
        window.dispatchEvent(
          new CustomEvent("languageChanged", { detail: { language: locale } })
        )
      }
      context.keycloak.updateToken()
      addAlert(t("accountUpdatedMessage"))
    },
    onError: (error) => {
      addAlert(t("accountUpdatedError"), "danger")
      setUserProfileServerError(
        { responseData: { errors: error as any } },
        (name: string | number, err: unknown) =>
          setError(name as never, err as ErrorOption),
        ((key: TFuncKey, param?: object) => t(key, param as any)) as TFunction
      )
    },
  })

  const onSubmit = (user: PersonalInfoFormValues) => {
    const attributes = Object.fromEntries(
      Object.entries((user as any).attributes || {}).map(([k, v]) => [
        debeerify(k),
        v,
      ])
    )
    save.mutate({ ...user, attributes } as never)
  }

  const allFieldsReadOnly = metadata.attributes?.every((a: any) => a.readOnly)

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
  } = context.environment.features

  return (
    <Page
      title={t("personalInfo")}
      description={t("personalInfoDescription")}
      action={
        context.environment.features.deleteAccountAllowed ? (
          <Button
            id="delete-account-btn"
            data-testid="delete-account"
            variant="destructive"
            onClick={() => context.keycloak.login({ action: "delete_account" })}
          >
            {t("deleteAccount")}
          </Button>
        ) : undefined
      }
    >
      <Form {...form}>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <UserProfileFields
            form={form as any}
            userProfileMetadata={metadata}
            supportedLocales={supportedLocales}
            currentLocale={context.environment.locale}
            t={
              ((key: unknown, params) =>
                t(key as TFuncKey, params as any)) as TFunction
            }
            renderer={(attribute) => {
              const annotations = attribute.annotations ?? {}
              return attribute.name === "email" &&
                updateEmailFeatureEnabled &&
                updateEmailActionEnabled &&
                annotations["kc.required.action.supported"] &&
                (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
                <Button
                  id="update-email-btn"
                  variant="link"
                  size="sm"
                  onClick={() =>
                    context.keycloak.login({ action: "UPDATE_EMAIL" })
                  }
                >
                  {t("updateEmail")}
                  <ArrowSquareOut className="ml-1 size-4" aria-hidden />
                </Button>
              ) : undefined
            }}
          />

          {!allFieldsReadOnly && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                data-testid="save"
                type="submit"
                id="save-btn"
                size="xl"
                className="flex-1"
                disabled={save.isPending}
              >
                {t("save")}
              </Button>
              <Button
                data-testid="cancel"
                id="cancel-btn"
                type="button"
                variant="outline"
                size="xl"
                className="flex-1"
                onClick={() => reset(initialData as PersonalInfoFormValues)}
              >
                {t("cancel")}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Page>
  )
}
