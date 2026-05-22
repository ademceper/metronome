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
  useEnvironment,
} from "../../../shared/keycloak-ui-shared"
import { updatePermissions } from "../../lib/api/resources"
import type { Permission, Resource } from "../../lib/api/representations"
import { useAccountAlerts } from "../../lib/useAccountAlerts"

type EditTheResourceProps = {
  resource: Resource
  permissions?: Permission[]
  onClose: () => void
}

type FormValues = {
  permissions: Permission[]
}

export const EditTheResource = ({
  resource,
  permissions,
  onClose,
}: EditTheResourceProps) => {
  const { t } = useTranslation()
  const context = useEnvironment()
  const { addAlert, addError } = useAccountAlerts()

  const form = useForm<FormValues>()
  const { control, reset, handleSubmit } = form

  const { fields } = useFieldArray<FormValues>({
    control,
    name: "permissions",
  })

  useEffect(() => reset({ permissions }), [])

  const editShares = async ({ permissions }: FormValues) => {
    try {
      await Promise.all(
        permissions.map((permission) =>
          updatePermissions(context, resource._id, [permission])
        )
      )
      addAlert(t("updateSuccess"))
      onClose()
    } catch (error) {
      addError("updateError", error)
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
