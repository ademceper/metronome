import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { RiCalendarEventLine, RiExternalLinkLine, RiLogoutBoxRLine, RiSignpostFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { SELF_HOSTED_UPGRADE_REDIRECT_URL } from '../../config';
import { openInNewTab } from '../url';
import { UserAvatar } from './icons';
import { useUser } from './index';

const JWT_STORAGE_KEY = 'self-hosted-jwt'; // As defined in components.tsx

export function UserButton() {
  const { user } = useUser() as {
    user: { firstName?: string; lastName?: string; emailAddresses?: { emailAddress: string }[] } | undefined;
  };
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!user) return null;

  const userName = `${user.firstName} ${user.lastName}`;

  const handleLogout = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);

    if (typeof window !== 'undefined') {
      (window as any).Clerk = { ...((window as any).Clerk || {}), loggedIn: false };
    }

    queryClient.clear();
    navigate('/auth/sign-in');
  };

  return (
    <div className="shrink-0">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={buttonRef}
            variant="secondary"
            size="sm"
            className="size-6 rounded-full bg-background p-0 hover:bg-accent focus:outline-hidden focus:ring-0 focus-visible:shadow-none"
          >
            <Avatar className="size-6 border">
              <AvatarImage src={`${window.location.origin}/images/avatar.svg`} alt={userName} />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-75 border bg-popover text-popover-foreground shadow-sm"
          sideOffset={5}
        >
          <div className="flex items-center gap-3 p-3">
            <UserAvatar className="rounded-full" />
            <span className="truncate text-sm font-medium text-foreground">{userName}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={() => openInNewTab(SELF_HOSTED_UPGRADE_REDIRECT_URL + '?utm_campaign=user_button_learn_more')}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <RiSignpostFill className="size-3.5 shrink-0 text-muted-foreground" />
              <span>Learn more about Novu Cloud</span>
              <RiExternalLinkLine className="m-1 ml-auto size-3 shrink-0 text-muted-foreground" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={() => openInNewTab(SELF_HOSTED_UPGRADE_REDIRECT_URL + '?utm_campaign=user_button_contact_sales')}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <RiCalendarEventLine className="size-3.5 shrink-0 text-muted-foreground" />
              <span>Contact Sales</span>
              <RiExternalLinkLine className="m-1 ml-auto size-3 shrink-0 text-muted-foreground" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={handleLogout}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <RiLogoutBoxRLine className="size-3.5 shrink-0 text-muted-foreground" />
              <span>Logout</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
