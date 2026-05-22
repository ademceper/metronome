import { cn } from "@metronome/ui/lib/utils"
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react"
import { Link, useRouterState } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useEnvironment } from "../../shared/keycloak-ui-shared"
import { type AccountEnvironment } from ".."
import { type MenuItem, navItems } from "../lib/nav-items"

const normalize = (path: string) => "/" + path.replace(/^\/+|\/+$/g, "")

const matchMenuItem = (currentPath: string, menuItem: MenuItem): boolean => {
  if ("path" in menuItem) {
    return currentPath === normalize(menuItem.path)
  }
  return menuItem.children.some((c) => matchMenuItem(currentPath, c))
}

const LeafLink = ({
  menuItem,
  className,
}: {
  menuItem: Extract<MenuItem, { path: string }>
  className?: string
}) => {
  const { t } = useTranslation()
  const target = normalize(menuItem.path)
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  })
  const isActive = currentPath === target

  return (
    <Link
      to={target}
      data-testid={menuItem.path}
      className={cn(
        "flex h-12 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        isActive && "bg-muted font-medium text-foreground",
        className
      )}
    >
      {t(menuItem.label)}
    </Link>
  )
}

const Group = ({
  menuItem,
}: {
  menuItem: Extract<MenuItem, { children: MenuItem[] }>
}) => {
  const { t } = useTranslation()
  const { environment } = useEnvironment<AccountEnvironment>()
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  })
  const isOpenDefault = useMemo(
    () => matchMenuItem(currentPath, menuItem),
    [currentPath, menuItem]
  )
  const [open, setOpen] = useState(isOpenDefault)

  const visibleChildren = menuItem.children.filter((c) =>
    c.isVisible ? environment.features[c.isVisible] : true
  )

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center justify-between rounded-md px-3 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        <span>{t(menuItem.label)}</span>
        <CaretRightIcon
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
      </button>
      {open && (
        <ul className="mt-1 ms-3 flex flex-col gap-0.5 border-s ps-3">
          {visibleChildren.map((child) =>
            "path" in child ? (
              <li key={child.label as string}>
                <LeafLink menuItem={child} />
              </li>
            ) : (
              <Group key={child.label as string} menuItem={child} />
            )
          )}
        </ul>
      )}
    </li>
  )
}

export const PageNav = () => {
  const context = useEnvironment<AccountEnvironment>()

  const visible = navItems.filter((m) =>
    m.isVisible ? context.environment.features[m.isVisible] : true
  )

  return (
    <nav aria-label="account navigation">
      <ul className="flex flex-col gap-0.5">
        {visible.map((item) =>
          "path" in item ? (
            <li key={item.label as string}>
              <LeafLink menuItem={item} />
            </li>
          ) : (
            <Group key={item.label as string} menuItem={item} />
          )
        )}
      </ul>
    </nav>
  )
}
