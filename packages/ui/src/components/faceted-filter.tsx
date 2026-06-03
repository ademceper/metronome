"use client"

import { Badge } from "@metronome/ui/components/badge"
import { Button } from "@metronome/ui/components/button"
import { Input } from "@metronome/ui/components/input"
import { Label } from "@metronome/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@metronome/ui/components/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@metronome/ui/components/radio-group"
import { cn } from "@metronome/ui/lib/utils"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  KeyReturnIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react"
import * as React from "react"

export type FacetedFilterValueType = "single" | "multi" | "text"
export type FacetedFilterSize = "default" | "small"

export interface FacetedFilterOption {
  label: string
  value: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface FacetedFilterProps {
  title?: string
  type?: FacetedFilterValueType
  size?: FacetedFilterSize
  options?: FacetedFilterOption[]
  selected?: string[]
  onSelect?: (values: string[]) => void
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  icon?: React.ComponentType<{ className?: string }>
  hideTitle?: boolean
  hidePlusIcon?: boolean
  hideSearch?: boolean
  hideClear?: boolean
  className?: string
  trailingNode?: React.ReactNode
  disabled?: boolean
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  isLoading?: boolean
}

const SIZES = {
  default: {
    trigger: "h-8",
    input: "h-8",
    badge: "px-2 py-0.5 text-xs",
  },
  small: {
    trigger: "h-7 px-1 py-1 pl-1.5",
    input: "h-6 text-xs",
    badge: "px-2 py-0 text-xs",
  },
} as const

function useKeyboardNavigation({
  options,
  onSelect,
  initialSelectedValue,
}: {
  options: FacetedFilterOption[]
  onSelect: (value: string) => void
  initialSelectedValue?: string
}) {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (options.length === 0) return
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            const opt = options[focusedIndex]
            if (opt) onSelect(opt.value)
          }
          break
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, options, onSelect])

  React.useEffect(() => {
    if (!initialSelectedValue) return
    const index = options.findIndex(
      (option) => option.value === initialSelectedValue
    )
    if (index !== -1) setFocusedIndex(index)
  }, [initialSelectedValue, options])

  return { focusedIndex, setFocusedIndex }
}

function FilterBadge({
  content,
  size,
  className,
}: {
  content: React.ReactNode
  size: FacetedFilterSize
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md bg-muted/40 font-normal text-foreground shadow-none transition-colors duration-200 hover:bg-muted",
        SIZES[size].badge,
        className
      )}
    >
      {content}
    </Badge>
  )
}

function ClearButton({
  onClick,
  label = "Reset",
  className,
}: {
  onClick: () => void
  label?: string
  className?: string
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-4 justify-center px-0 font-normal text-muted-foreground text-xs hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {label}
    </Button>
  )
}

function FilterInput({
  inputRef,
  value,
  onChange,
  placeholder,
  size,
  showEnterIcon,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  size: FacetedFilterSize
  showEnterIcon?: boolean
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full border-none! text-muted-foreground shadow-none! ring-0! placeholder:text-muted-foreground",
          SIZES[size].input
        )}
      />
      {showEnterIcon && (
        <div className="pointer-events-none shrink-0 rounded-md border p-0.5">
          <KeyReturnIcon className="size-3 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

function BaseFilterContent({
  inputRef,
  title,
  onClear,
  size,
  hideSearch,
  hideClear,
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  showNavigationFooter,
  showEnterIcon,
  children,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  title?: string
  onClear: () => void
  size: FacetedFilterSize
  hideSearch?: boolean
  hideClear?: boolean
  searchValue?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchPlaceholder?: string
  showNavigationFooter?: boolean
  showEnterIcon?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full justify-between rounded-t-md bg-muted/40 px-2 py-1">
        {title ? (
          <div className="font-medium text-muted-foreground text-xs uppercase leading-4">
            {title}
          </div>
        ) : null}
        {!hideClear && <ClearButton onClick={onClear} />}
      </div>

      {!hideSearch && onSearchChange && (
        <FilterInput
          inputRef={inputRef}
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          size={size}
          showEnterIcon={showEnterIcon}
        />
      )}

      <div className="max-h-[160px] overflow-y-auto">{children}</div>

      {showNavigationFooter && (
        <div className="flex justify-between rounded-b-md border-t bg-background p-1">
          <div className="flex items-center gap-0.5">
            <div className="pointer-events-none shrink-0 rounded-md border bg-background p-1 shadow-xs">
              <ArrowUpIcon className="size-3 text-muted-foreground" />
            </div>
            <div className="pointer-events-none shrink-0 rounded-md border bg-background p-1 shadow-xs">
              <ArrowDownIcon className="size-3 text-muted-foreground" />
            </div>
            <span className="ml-1.5 font-normal text-muted-foreground text-xs">
              Navigate
            </span>
          </div>
          <div className="pointer-events-none shrink-0 rounded-md border bg-background p-1 shadow-xs">
            <KeyReturnIcon className="size-3 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

function MultiFilterContent({
  inputRef,
  title,
  options,
  selectedValues,
  onSelect,
  onClear,
  searchQuery,
  onSearchChange,
  size,
  hideSearch,
  hideClear,
  isLoading,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  title?: string
  options: FacetedFilterOption[]
  selectedValues: Set<string>
  onSelect: (value: string) => void
  onClear: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  size: FacetedFilterSize
  hideSearch?: boolean
  hideClear?: boolean
  isLoading?: boolean
}) {
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    options,
    onSelect,
  })

  return (
    <BaseFilterContent
      inputRef={inputRef}
      title={title}
      onClear={onClear}
      size={size}
      hideSearch={hideSearch}
      hideClear={hideClear}
      searchValue={searchQuery}
      onSearchChange={(e) => onSearchChange(e.target.value)}
      searchPlaceholder={`Search ${title}...`}
      showNavigationFooter
    >
      <div className="flex flex-col gap-1 p-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-muted-foreground text-xs">Loading...</span>
          </div>
        ) : options.length === 0 && searchQuery ? (
          <div className="flex items-center justify-center p-4">
            <span className="text-muted-foreground text-xs">
              No results found
            </span>
          </div>
        ) : (
          options.map((option, index) => {
            const isSelected = selectedValues.has(option.value)
            const isFocused = index === focusedIndex
            const Icon = option.icon
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "flex w-full cursor-pointer items-center rounded-md p-1 text-left hover:bg-muted",
                  isSelected && "bg-muted",
                  isFocused && "ring-1 ring-border"
                )}
              >
                {Icon ? (
                  <Icon className="mr-2 size-4 text-muted-foreground" />
                ) : null}
                <span className="font-normal text-foreground text-xs">
                  {option.label}
                </span>
                {isSelected ? (
                  <CheckIcon className="ml-auto size-2.5 text-foreground" />
                ) : null}
              </button>
            )
          })
        )}
      </div>
    </BaseFilterContent>
  )
}

function SingleFilterContent({
  inputRef,
  title,
  options,
  selectedValues,
  onSelect,
  onClear,
  searchQuery,
  onSearchChange,
  size,
  hideSearch,
  hideClear,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  title?: string
  options: FacetedFilterOption[]
  selectedValues: Set<string>
  onSelect: (value: string) => void
  onClear: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  size: FacetedFilterSize
  hideSearch?: boolean
  hideClear?: boolean
}) {
  const currentValue = Array.from(selectedValues)[0] ?? ""
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    options,
    onSelect,
    initialSelectedValue: currentValue,
  })

  return (
    <BaseFilterContent
      inputRef={inputRef}
      title={title}
      onClear={onClear}
      size={size}
      hideSearch={hideSearch}
      hideClear={hideClear}
      searchValue={searchQuery}
      onSearchChange={(e) => onSearchChange(e.target.value)}
      searchPlaceholder={`Search ${title}...`}
      showNavigationFooter
    >
      <RadioGroup
        value={currentValue}
        onValueChange={onSelect}
        className="flex flex-col gap-1 p-1"
      >
        {options.map((option, index) => {
          const isFocused = index === focusedIndex
          const Icon = option.icon
          return (
            <div
              key={option.value}
              className={cn(
                "flex items-center justify-between rounded-md p-1.5",
                isFocused && "bg-muted ring-1 ring-border",
                option.disabled && "cursor-default"
              )}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={() => !option.disabled && onSelect(option.value)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  disabled={option.disabled}
                />
                <Label
                  className={cn(
                    "font-medium text-xs",
                    option.disabled && "cursor-default"
                  )}
                  htmlFor={option.value}
                >
                  {option.label}
                </Label>
              </div>
              {Icon ? <Icon /> : null}
            </div>
          )
        })}
      </RadioGroup>
    </BaseFilterContent>
  )
}

function TextFilterContent({
  inputRef,
  value,
  onChange,
  onClear,
  placeholder,
  size,
  hideSearch,
  hideClear,
  title,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  placeholder?: string
  size: FacetedFilterSize
  hideSearch?: boolean
  hideClear?: boolean
  title?: string
}) {
  return (
    <BaseFilterContent
      inputRef={inputRef}
      title={title}
      onClear={onClear}
      size={size}
      hideSearch={hideSearch}
      hideClear={hideClear}
      searchValue={value}
      onSearchChange={onChange}
      searchPlaceholder={placeholder}
      showEnterIcon
    />
  )
}

export function FacetedFilter({
  title,
  type = "multi",
  size = "default",
  options = [],
  selected = [],
  onSelect,
  value = "",
  onChange,
  placeholder,
  open,
  onOpenChange,
  icon: Icon,
  hideTitle,
  hidePlusIcon,
  hideSearch,
  hideClear,
  className,
  trailingNode,
  disabled,
  searchQuery: controlledSearchQuery,
  onSearchQueryChange,
  isLoading,
}: FacetedFilterProps) {
  const [internalSearchQuery, setInternalSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const isSearchControlled =
    controlledSearchQuery !== undefined && onSearchQueryChange !== undefined
  const searchQuery = isSearchControlled
    ? controlledSearchQuery
    : internalSearchQuery
  const setSearchQuery = isSearchControlled
    ? onSearchQueryChange
    : setInternalSearchQuery

  const selectedValues = React.useMemo(() => new Set(selected), [selected])
  const sizes = SIZES[size]

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = (selectedValue: string) => {
    if (type === "single") {
      onSelect?.([selectedValue])
      return
    }
    const next = new Set(selectedValues)
    if (next.has(selectedValue)) next.delete(selectedValue)
    else next.add(selectedValue)
    onSelect?.(Array.from(next))
  }

  const handleClear = () => {
    if (type === "text") onChange?.("")
    else onSelect?.([])
    setSearchQuery("")
  }

  const renderTriggerContent = () => {
    if (type === "text" && value) {
      return <FilterBadge content={value} size={size} />
    }
    if (selectedValues.size === 0) return null

    const selectedCount = selectedValues.size
    const selectedItems = options.filter((option) =>
      selectedValues.has(option.value)
    )

    return (
      <>
        <div className="lg:hidden">
          <FilterBadge content={selectedCount} size={size} />
        </div>
        <div className="hidden space-x-1 lg:flex">
          {selectedCount > 2 && type === "multi" ? (
            <FilterBadge content={`${selectedCount} selected`} size={size} />
          ) : (
            selectedItems.map((option) => (
              <FilterBadge
                key={option.value}
                content={option.label}
                size={size}
              />
            ))
          )}
        </div>
      </>
    )
  }

  const isEmpty = type === "text" ? !value : selectedValues.size === 0

  const shouldShowClear = React.useMemo(() => {
    if (hideClear) return false
    if (type === "text") return Boolean(value)
    return !isEmpty
  }, [hideClear, type, value, isEmpty])

  const renderContent = () => {
    const commonProps = {
      inputRef,
      title,
      size,
      onClear: handleClear,
      hideSearch,
      hideClear: !shouldShowClear,
    }

    if (type === "text") {
      return (
        <TextFilterContent
          {...commonProps}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      )
    }

    const filterProps = {
      ...commonProps,
      options: filteredOptions,
      selectedValues,
      onSelect: handleSelect,
      searchQuery,
      onSearchChange: (v: string) => setSearchQuery(v),
    }

    return type === "single" ? (
      <SingleFilterContent {...filterProps} />
    ) : (
      <MultiFilterContent {...filterProps} isLoading={isLoading} />
    )
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-10 rounded-lg bg-background px-3 text-muted-foreground ring-0 ring-offset-0 transition-colors duration-200 ease-out hover:bg-muted/50 hover:text-foreground",
            sizes.trigger,
            isEmpty && "border-dashed px-1.5",
            className
          )}
        >
          <div className="flex items-center gap-1">
            {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
            {isEmpty && !hidePlusIcon ? (
              <PlusCircleIcon className="size-4 text-muted-foreground" />
            ) : null}
            {(isEmpty || !hideTitle) && (
              <span
                className={cn(
                  "font-normal text-xs",
                  isEmpty ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {title}
              </span>
            )}
            {!isEmpty && renderTriggerContent()}
            {trailingNode}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[245px] p-0" align="start">
        {renderContent()}
      </PopoverContent>
    </Popover>
  )
}
