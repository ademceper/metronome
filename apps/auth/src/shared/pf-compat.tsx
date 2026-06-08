/* eslint-disable */

// @ts-nocheck

/**
 * Compatibility shims that translate PatternFly's flat
 * `<Tabs><Tab eventKey title>content</Tab></Tabs>` shape into shadcn's split
 * `<Tabs><TabsList><TabsTrigger /></TabsList><TabsContent /></Tabs>` shape.
 * Without this, the Radix RovingFocus assertion fires because TabsTrigger
 * gets rendered outside of TabsList.
 */

import {
  Select as UISelect,
  SelectContent as UISelectContent,
  SelectItem as UISelectItem,
  SelectTrigger as UISelectTrigger,
  SelectValue as UISelectValue,
} from "@metronome/ui/components/select"
import {
  Tabs as UITabs,
  TabsContent as UITabsContent,
  TabsList as UITabsList,
  TabsTrigger as UITabsTrigger,
} from "@metronome/ui/components/tabs"
import { Children, isValidElement, type ReactElement, type ReactNode } from "react"
import { Link } from "react-router-dom"

type AnyProps = Record<string, any>

const collectTabs = (children: ReactNode): ReactElement[] => {
  const out: ReactElement[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const t = (child.type as any)?.__pfTab
    if (t) out.push(child as ReactElement)
  })
  return out
}

export const Tabs = ({
  activeKey,
  defaultActiveKey,
  onSelect,
  children,
  // PF-only props — destructured so they don't leak onto the DOM.
  isBox,
  isFilled,
  component,
  inset,
  unmountOnExit,
  mountOnEnter,
  usePageInsets,
  ...props
}: AnyProps) => {
  const tabs = collectTabs(children)
  if (tabs.length === 0) {
    // Callsite isn't using the PF flat shape — pass-through to shadcn Tabs.
    return (
      <UITabs
        value={activeKey != null ? String(activeKey) : undefined}
        defaultValue={
          defaultActiveKey != null ? String(defaultActiveKey) : undefined
        }
        onValueChange={(v: string) => onSelect?.(undefined, v)}
        {...props}
      >
        {children}
      </UITabs>
    )
  }
  return (
    <UITabs
      value={activeKey != null ? String(activeKey) : undefined}
      defaultValue={
        defaultActiveKey != null ? String(defaultActiveKey) : undefined
      }
      onValueChange={(v: string) => onSelect?.(undefined, v)}
      {...props}
    >
      <UITabsList>
        {tabs.map((tab) => {
          const p: AnyProps = tab.props
          // RoutableTabs / useRoutableTab give each tab an `href` AND
          // an `eventKey` (the pathname). We need an actual navigation
          // on click, not just a Radix state change — wrap the trigger
          // in a router Link so the URL updates and the parent
          // `useLocation` re-derives `activeKey` on its own.
          const navTo: string | undefined = p.href ?? p.eventKey
          return (
            <UITabsTrigger
              key={String(p.eventKey)}
              value={String(p.eventKey)}
              disabled={p.isDisabled || p.isAriaDisabled}
              asChild={!!navTo}
            >
              {navTo ? <Link to={navTo}>{p.title}</Link> : p.title}
            </UITabsTrigger>
          )
        })}
      </UITabsList>
      {tabs.map((tab) => {
        const p: AnyProps = tab.props
        return (
          <UITabsContent key={String(p.eventKey)} value={String(p.eventKey)}>
            {p.children}
          </UITabsContent>
        )
      })}
    </UITabs>
  )
}

export const Tab = (_props: AnyProps) => null
;(Tab as any).__pfTab = true

export const TabContent = ({ children, ...props }: AnyProps) => (
  <div {...props}>{children}</div>
)

export const TabTitleText = ({ children, ...props }: AnyProps) => (
  <span {...props}>{children}</span>
)

export const TabTitleIcon = ({ children, ...props }: AnyProps) => (
  <span aria-hidden="true" {...props}>
    {children}
  </span>
)

/**
 * Select / SelectOption shim. Radix Select forbids an empty-string value on
 * SelectItem (it's reserved as the clear-selection sentinel), but PF callsites
 * commonly use `<SelectOption value="">` for "inherited"/placeholder rows.
 * We translate empty string <-> SELECT_EMPTY internally so the PF API keeps
 * working without callsite changes.
 */

const SELECT_EMPTY = "__pf_empty__"
const toRadixValue = (v: any) => (v === "" || v == null ? SELECT_EMPTY : String(v))
const fromRadixValue = (v: any) => (v === SELECT_EMPTY ? "" : v)

export const Select = ({
  selections,
  onSelect,
  isOpen: _isOpen,
  onToggle: _onToggle,
  placeholderText,
  variant: _variant,
  toggleIcon: _toggleIcon,
  hasInlineFilter: _hasInlineFilter,
  onClear: _onClear,
  toggle: _toggle,
  children,
  className,
  ...props
}: AnyProps) => {
  const raw = Array.isArray(selections) ? selections[0] : selections
  const value = raw != null ? toRadixValue(raw) : undefined
  return (
    <UISelect
      value={value}
      onValueChange={(v: string) => onSelect?.(undefined, fromRadixValue(v))}
      {...props}
    >
      {/* Form selects should fill the column they sit in (PKCE Method,
          Login Theme, …) — without `w-full` the Radix trigger hugs its
          label. */}
      <UISelectTrigger className={`w-full ${className ?? ""}`}>
        <UISelectValue placeholder={placeholderText} />
      </UISelectTrigger>
      <UISelectContent>{children}</UISelectContent>
    </UISelect>
  )
}

export const SelectOption = ({ value, children, ...props }: AnyProps) => {
  const v = toRadixValue(value)
  return (
    <UISelectItem value={v} {...props}>
      {children ?? value}
    </UISelectItem>
  )
}

export const SelectGroup = ({ children, label, ...props }: AnyProps) => (
  <div {...props}>
    {label ? (
      <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
        {label}
      </div>
    ) : null}
    {children}
  </div>
)
