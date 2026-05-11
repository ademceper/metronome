/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ResourceToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@metronome/ui/components/button";
import { Input } from "@metronome/ui/components/input";
import {
  CaretLeft as PrevIcon,
  CaretRight as NextIcon,
  MagnifyingGlass as SearchIcon,
} from "@phosphor-icons/react";

type ResourceToolbarProps = {
  onFilter: (nameFilter: string) => void;
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (max: number, first: number) => void;
  hasNext: boolean;
};

export const ResourceToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onFilter,
  hasNext,
}: ResourceToolbarProps) => {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");

  const page = Math.round(first / max) + 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="relative w-full max-w-xs">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          aria-label={t("filterByName")}
          placeholder={t("filterByName")}
          value={nameFilter}
          className="ps-8"
          onChange={(e) => setNameFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onFilter(nameFilter);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPreviousClick((page - 1) * max)}
        >
          <PrevIcon className="size-3.5" />
        </Button>
        <span className="text-muted-foreground text-sm">{page}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onNextClick((page - 1) * max)}
        >
          <NextIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};
