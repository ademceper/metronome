/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/icons/IconMapper.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { Cube as CubeIcon, FacebookLogo as FacebookSquareIcon, GithubLogo as GithubIcon, GitlabLogo as GitlabIcon, GoogleLogo as GoogleIcon, InstagramLogo as InstagramIcon, LinkedinLogo as LinkedinIcon, WindowsLogo as MicrosoftIcon, TwitterLogo as TwitterIcon } from "@phosphor-icons/react"
import { SiBitbucket as BitbucketIcon, SiRedhatopenshift as OpenshiftIcon, SiPaypal as PaypalIcon, SiStackoverflow as StackOverflowIcon } from "@icons-pack/react-simple-icons"


const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
);

type IconMapperProps = {
  icon: string;
};

export const IconMapper = ({ icon }: IconMapperProps) => {
  const SpecificIcon = getIcon(icon);
  return (
    <Icon size="lg">
      <SpecificIcon alt={icon} />
    </Icon>
  );
};

function getIcon(icon: string) {
  switch (icon) {
    case "github":
      return GithubIcon;
    case "facebook":
      return FacebookSquareIcon;
    case "gitlab":
      return GitlabIcon;
    case "google":
      return GoogleIcon;
    case "linkedin":
    case "linkedin-openid-connect":
      return LinkedinIcon;

    case "openshift-v4":
      return OpenshiftIcon;
    case "stackoverflow":
      return StackOverflowIcon;
    case "twitter":
      return TwitterIcon;
    case "microsoft":
      return MicrosoftIcon;
    case "bitbucket":
      return BitbucketIcon;
    case "instagram":
      return InstagramIcon;
    case "paypal":
      return PaypalIcon;
    default:
      return CubeIcon;
  }
}
