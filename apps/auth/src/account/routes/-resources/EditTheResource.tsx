import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@metronome/ui/components/dialog"
import { Form } from "@metronome/ui/components/form"
import { Fragment, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  SelectControl,
  TextControl,
} from "../../../shared/keycloak-ui-shared"
import { useUpdatePermissions } from "../../lib/api/hooks"
import type { Permission, Resource } from "../../lib/api/representations"
import { useAccountAlerts } from "../../lib/use-account-alerts"
import {
  type EditTheResourceFormValues,
  editTheResourceSchema,
} from "../../schemas/edit-the-resource"

type EditTheResourceProps = {
  resource: Resource
  permissions?: Permission[]
  onClose: () => void
}

export const EditTheResource = ({
  resource,
  permissions,
  onClose,
}: EditTheResourceProps) => {
  const { t } = useTranslation()
  const { addAlert, addError } = useAccountAlerts()

  const form = useForm<EditTheResourceFormValues>({
    resolver: zodResolver(editTheResourceSchema()),
    defaultValues: { permissions: [] },
  })
  const { control, reset, handleSubmit } = form

  const { fields } = useFieldArray<EditTheResourceFormValues>({
    control,
    name: "permissions",
  })

  useEffect(() => {
    if (permissions) {
      reset({
        permissions: permissions as EditTheResourceFormValues["permissions"],
      })
    }
  }, [permissions])

  const update = useUpdatePermissions({
    onError: (error) => addError("updateError", error),
  })

  const editShares = async ({ permissions }: EditTheResourceFormValues) => {
    try {
      await Promise.all(
        permissions.map((permission) =>
          update.mutateAsync({
            resourceId: resource._id,
            permissions: [permission as Permission],
          })
        )
      )
      addAlert(t("updateSuccess"))
      onClose()
    } catch {
      /* error already reported via onError */
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editTheResource", { name: resource.name })}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-form"
            className="space-y-4"
            onSubmit={handleSubmit(editShares)}
          >
            {fields.map((p, index) => (
              <Fragment key={p.id}>
                <TextControl
                  name={`permissions.${index}.username`}
                  label={t("user")}
                  isDisabled
                />
                <SelectControl
                  id={`permissions-${p.id}`}
                  name={`permissions.${index}.scopes`}
                  label="permissions"
                  variant="typeaheadMulti"
                  controller={{ defaultValue: [] }}
                  options={resource.scopes.map(({ name, displayName }) => ({
                    key: name,
                    value: displayName || name,
                  }))}
                />
              </Fragment>
            ))}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-form" id="done">
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
