import type { PropsWithChildren, ReactNode } from "react"

type PageProps = {
  title: string
  description: string
  action?: ReactNode
}

export function Page({
  title,
  description,
  action,
  children,
}: PropsWithChildren<PageProps>) {
  return (
    <>
      <section className="border-b bg-card px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1
              className="font-heading font-semibold text-xl"
              data-testid="page-heading"
            >
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </section>
      <section className="bg-card px-6 py-5">{children}</section>
    </>
  )
}
