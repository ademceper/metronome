import type { Feature } from ".."
import type { TFuncKey } from "../i18n/types"

type RootMenuItem = {
  id?: string
  label: TFuncKey
  path: string
  isVisible?: keyof Feature
  modulePath?: string
}

type MenuItemWithChildren = {
  label: TFuncKey
  children: MenuItem[]
  isVisible?: keyof Feature
}

export type MenuItem = RootMenuItem | MenuItemWithChildren

export const navItems: MenuItem[] = [
  { label: "personalInfo", path: "" },
  {
    label: "accountSecurity",
    children: [
      { label: "signingIn", path: "account-security/signing-in" },
      { label: "deviceActivity", path: "account-security/device-activity" },
      {
        label: "linkedAccounts",
        path: "account-security/linked-accounts",
        isVisible: "isLinkedAccountsEnabled",
      },
    ],
  },
  { label: "applications", path: "applications" },
  {
    label: "groups",
    path: "groups",
    isVisible: "isViewGroupsEnabled",
  },
  {
    label: "organizations",
    path: "organizations",
    isVisible: "isViewOrganizationsEnabled",
  },
  {
    label: "resources",
    path: "resources",
    isVisible: "isMyResourcesEnabled",
  },
  {
    label: "oid4vci",
    path: "oid4vci",
    isVisible: "isOid4VciEnabled",
  },
]
