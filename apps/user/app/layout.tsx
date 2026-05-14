import { Geist, Geist_Mono } from "next/font/google"

import "@metronome/ui/globals.css"
import { AppSidebar } from "@metronome/ui/blocks/app-sidebar"
import { SidebarInset, SidebarProvider } from "@metronome/ui/components/sidebar"
import { TooltipProvider } from "@metronome/ui/components/tooltip"
import { cn } from "@metronome/ui/lib/utils"
import { AppHeader } from "@/components/app-header"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <AppHeader />
                  {children}
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
