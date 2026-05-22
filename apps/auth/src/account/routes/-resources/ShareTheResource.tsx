import { Badge } from "@metronome/ui/components/badge"
import { Button } from "@metronome/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@metronome/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@metronome/ui/components/form"
import { Input } from "@metronome/ui/components/input"
import { X } from "@phosphor-icons/react"
import { useEffect } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  SelectControl,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared"
import { updateRequest } from "../../lib/api/resources"
import type { Permission, Resource } from "../../lib/api/representations"
import { useAccountAlerts } from "../../lib/useAccountAlerts"
import { SharedWith } from "./SharedWith"

type ShareTheResourceProps = {
  resource: Resource
  permissions?: Permission[]
  open: boolean
  onClose: () => void
}

type FormValues = {
  permissions: string[]
  usernames: { value: string }[]
}

export const ShareTheResource = ({
  resource,
  permissions,
  open,
  onClose,
}: ShareTheResourceProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()
  const form = useForm<FormValues>()
  const {
    control,
    reset,
    formState: { isValid },
    setError,
    clearErrors,
    handleSubmit,
  } = form
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "usernames",
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" })
    }
  }, [fields])

  const watchFields = useWatch({
    control,
    name: "usernames",
    defaultValue: [],
  })

  const isAddDisabled = watchFields.every(
    ({ value }) => value.trim().length === 0
  )

  const addShare = async ({ usernames, permissions }: FormValues) => {
    try {
      await Promise.all(
        usernames
          .filter(({ value }) => value !== "")
          .map(({ value: username }) =>
            updateRequest(context, resource._id, username, permissions)
          )
      )
      addAlert(t("shareSuccess"))
      onClose()
    } catch (error) {
      addError("shareError", error)
    }
    reset({})
  }

  const validateUser = async () => {
    const userOrEmails = fields.map((f) => f.value).filter((f) => f !== "")
    const userPermission = permissions
      ?.map((p) => [p.username, p.email])
      .flat()

    const hasUsers = userOrEmails.length > 0
    const alreadyShared =
      userOrEmails.filter((u) => userPermission?.includes(u)).length !== 0

    if (!hasUsers || alreadyShared) {
      setError("usernames", {
        message: !hasUsers ? t("required") : t("resourceAlreadyShared"),
      })
    } else {
      clearErrors()
    }

    return hasUsers && !alreadyShared
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("shareTheResource", { name: resource.name })}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="share-form"
            className="space-y-4"
            onSubmit={handleSubmit(addShare)}
          >
            <FormField
              control={control}
              name={`usernames.${fields.length - 1}.value`}
              rules={{ validate: validateUser }}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          variant="floating"
                          label={
                            <>
                              {t("shareUser")}
                              <span className="ml-0.5 text-destructive">*</span>
                            </>
                          }
                          id="users"
                          data-testid="users"
                        />
                      </FormControl>
                    </div>
                    <Button
                      type="button"
                      size="xl"
                      data-testid="add"
                      onClick={() => append({ value: "" })}
                      disabled={isAddDisabled}
                    >
                      {t("add")}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.length > 1 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted-foreground text-xs">
                  {t("shareWith")}:
                </span>
                {fields.map(
                  (field, index) =>
                    index !== fields.length - 1 && (
                      <Badge
                        key={field.id}
                        variant="secondary"
                        className="gap-1"
                      >
                        {field.value}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          aria-label={t("remove")}
                          className="hover:text-foreground"
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </Badge>
                    )
                )}
              </div>
            )}

            <SelectControl
              name="permissions"
              variant="typeaheadMulti"
              controller={{ defaultValue: [] }}
              options={resource.scopes.map(({ name, displayName }) => ({
                key: name,
                value: displayName || name,
              }))}
            />

            <SharedWith permissions={permissions} />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="link"
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="share-form"
            data-testid="done"
            disabled={!isValid}
          >
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
