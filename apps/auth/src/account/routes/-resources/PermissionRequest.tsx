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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@metronome/ui/components/table"
import { UserCheck } from "@phosphor-icons/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useAccountClient,
  useUpdateRequest,
} from "../../lib/api"
import type { Permission, Resource } from "../../lib/api"
import { useAccountAlerts } from "../../lib/use-account-alerts"

type PermissionRequestProps = {
  resource: Resource
  refresh: () => void
}

export const PermissionRequest = ({
  resource,
  refresh,
}: PermissionRequestProps) => {
  const { t } = useTranslation()
  const client = useAccountClient()
  const { addAlert, addError } = useAccountAlerts()
  const [open, setOpen] = useState(false)
  const updateRequestMutation = useUpdateRequest()

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false
  ) => {
    try {
      const permissions = await client.resources.permissions(resource._id)
      const { scopes, username } = permissions.find(
        (p: Permission) => p.username === shareRequest.username
      ) || { scopes: [], username: shareRequest.username }

      await updateRequestMutation.mutateAsync({
        resourceId: resource._id,
        username,
        scopes: approve
          ? [...(scopes as string[]), ...(shareRequest.scopes as string[])]
          : (scopes as string[]),
      })
      addAlert(t("shareSuccess"))
      setOpen(false)
      refresh()
    } catch (error) {
      addError("shareError", error)
    }
  }

  return (
    <>
      <Button variant="link" size="sm" onClick={() => setOpen(true)}>
        <UserCheck className="size-5" aria-hidden />
        <Badge variant="secondary" className="ml-1">
          {resource.shareRequests?.length}
        </Badge>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t("permissionRequest", { name: resource.name })}
            </DialogTitle>
          </DialogHeader>
          <Table aria-label={t("resources")}>
            <TableHeader>
              <TableRow>
                <TableHead>{t("requestor")}</TableHead>
                <TableHead>{t("permissionRequests")}</TableHead>
                <TableHead aria-hidden="true" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {resource.shareRequests?.map((shareRequest) => (
                <TableRow key={shareRequest.username}>
                  <TableCell>
                    {shareRequest.firstName} {shareRequest.lastName}{" "}
                    {shareRequest.lastName ? "" : shareRequest.username}
                    <br />
                    <small className="text-muted-foreground text-sm">
                      {shareRequest.email}
                    </small>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {shareRequest.scopes.map((scope) => (
                        <Badge key={scope.toString()} variant="secondary">
                          {scope as string}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveDeny(shareRequest, true)}
                      >
                        {t("accept")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => approveDeny(shareRequest)}
                      >
                        {t("deny")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button variant="link" onClick={() => setOpen(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
