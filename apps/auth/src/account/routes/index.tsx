import {
  UserProfileFields,
  beerify,
  debeerify,
  setUserProfileServerError,
  useEnvironment,
} from "../../shared/keycloak-ui-shared"
import { Button } from "@metronome/ui/components/button"
import { Form } from "@metronome/ui/components/form"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { TFunction } from "i18next"
import { useEffect } from "react"
import { type ErrorOption, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { type AccountEnvironment } from ".."
import { Page } from "../components/Page"
import type { TFuncKey } from "../i18n/types"
import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../lib/api/methods"
import { UserRepresentation } from "../lib/api/representations"
import { useAccountAlerts } from "../lib/useAccountAlerts"
import { PersonalInfoLoading } from "./-loading/personal-info"

export const Route = createFileRoute("/")({
  component: PersonalInfo,
})

function PersonalInfo() {
  const { t } = useTranslation()
  const context = useEnvironment<AccountEnvironment>()
  const form = useForm<UserRepresentation>({ mode: "onChange" })
  const { handleSubmit, reset, setValue, setError } = form
  const { addAlert } = useAccountAlerts()

  const personalInfo = useQuery({
    queryKey: ["account", "personalInfo"],
    queryFn: ({ signal }) => getPersonalInfo({ signal, context }),
  })
  const supportedLocalesQuery = useQuery({
    queryKey: ["account", "supportedLocales"],
    queryFn: ({ signal }) => getSupportedLocales({ signal, context }),
  })

  useEffect(() => {
    if (!personalInfo.data) return
    reset(personalInfo.data)
    Object.entries(personalInfo.data.attributes || {}).forEach(([k, v]) =>
      setValue(`attributes[${beerify(k)}]`, v)
    )
  }, [personalInfo.data, reset, setValue])

  const save = useMutation({
    mutationFn: async (user: UserRepresentation) => {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ])
      )
      await savePersonalInfo(context, { ...user, attributes })
      const locale = attributes["locale"]?.toString()
      if (locale) {
        window.dispatchEvent(
          new CustomEvent("languageChanged", { detail: { language: locale } })
        )
      }
      await context.keycloak.updateToken()
    },
    onSuccess: () => {
      addAlert(t("accountUpdatedMessage"))
    },
    onError: (error) => {
      addAlert(t("accountUpdatedError"), "danger")
      setUserProfileServerError(
        { responseData: { errors: error as any } },
        (name: string | number, err: unknown) =>
          setError(name as string, err as ErrorOption),
        ((key: TFuncKey, param?: object) => t(key, param as any)) as TFunction
      )
    },
  })

  const userProfileMetadata = personalInfo.data?.userProfileMetadata
  const supportedLocales = supportedLocalesQuery.data ?? []

  if (!userProfileMetadata) {
    return <PersonalInfoLoading />
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a: any) => a.readOnly)
      .reduce((p: boolean, c: boolean) => p && c, true)

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
        <form
          className="space-y-4"
          onSubmit={handleSubmit((user) => save.mutate(user))}
        >
          <UserProfileFields
            form={form}
            userProfileMetadata={userProfileMetadata}
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

          {!allFieldsReadOnly() && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                data-testid="save"
                type="submit"
                id="save-btn"
                size="xl"
                className="flex-1"
                disabled={form.formState.isSubmitting}
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
                onClick={() => reset()}
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
