import {
  SiApple,
  SiBitbucket,
  SiDiscord,
  SiDropbox,
  SiFacebook,
  SiGithub,
  SiGitlab,
  SiOpenid,
  SiPaypal,
  SiRedhatopenshift,
  SiStackoverflow,
  SiX,
} from "@icons-pack/react-simple-icons"
import { SignIn } from "@phosphor-icons/react"
import { type ComponentType, type SVGProps, useId } from "react"

type BrandIcon = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>

const GoogleIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const InstagramIcon: BrandIcon = (props) => {
  const gradId = `ig-grad-${useId()}`
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id={gradId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        fill={`url(#${gradId})`}
      />
      <circle
        cx="12"
        cy="12"
        r="4.3"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
      <circle cx="17.4" cy="6.6" r="1.1" fill="#fff" />
    </svg>
  )
}

const LinkedinIcon: BrandIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="#0A66C2"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
)

const MicrosoftIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z" />
    <path fill="#7FBA00" d="M24 11.4H12.6V0H24v11.4z" />
    <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
    <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z" />
  </svg>
)

const SlackIcon: BrandIcon = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#E01E5A"
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
    />
    <path
      fill="#36C5F0"
      d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
    />
    <path
      fill="#2EB67D"
      d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
    />
    <path
      fill="#ECB22E"
      d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
    />
  </svg>
)

const ICON_MAP: Record<string, BrandIcon> = {
  google: GoogleIcon,
  github: SiGithub,
  facebook: SiFacebook,
  apple: SiApple,
  twitter: SiX,
  x: SiX,
  linkedin: LinkedinIcon,
  "linkedin-openid-connect": LinkedinIcon,
  gitlab: SiGitlab,
  bitbucket: SiBitbucket,
  microsoft: MicrosoftIcon,
  slack: SlackIcon,
  discord: SiDiscord,
  instagram: InstagramIcon,
  dropbox: SiDropbox,
  paypal: SiPaypal,
  openshift: SiRedhatopenshift,
  "openshift-v3": SiRedhatopenshift,
  "openshift-v4": SiRedhatopenshift,
  stackoverflow: SiStackoverflow,
  openid: SiOpenid,
  oidc: SiOpenid,
}

export function SocialProviderIcon({
  alias,
  iconClasses,
  className,
}: {
  alias: string
  iconClasses?: string
  className?: string
}) {
  const key = alias.toLowerCase()
  const IconComp =
    ICON_MAP[key] ??
    Object.entries(ICON_MAP).find(([k]) => key.includes(k))?.[1]

  if (IconComp) {
    return <IconComp className={className} color="default" aria-hidden />
  }

  if (iconClasses) {
    return <i className={`${iconClasses} ${className ?? ""}`} aria-hidden />
  }

  return <SignIn className={className} aria-hidden />
}
