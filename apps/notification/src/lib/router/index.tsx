// react-router-dom compatibility shim backed by @tanstack/react-router.
//
// The notification app was migrated from react-router-dom v7 to TanStack
// file-based routing. The route tree itself lives under src/routes/ and is
// bootstrapped in src/main.tsx; this file exists so the ~234 call sites that
// use useNavigate/useParams/Link/etc. don't have to change. A vite alias
// rewrites `react-router-dom` -> this module so existing imports keep
// resolving through this single translation point.

import {
  Link as TLink,
  Navigate as TNavigate,
  Outlet,
  useBlocker as tUseBlocker,
  useLocation as tUseLocation,
  useMatches,
  useNavigate as tUseNavigate,
  useParams as tUseParams,
  useRouter as tUseRouter,
  useRouterState,
} from '@tanstack/react-router';
import {
  type AnchorHTMLAttributes,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';

export { Outlet };

// ─── Navigation ────────────────────────────────────────────────────────────

type To =
  | string
  | number
  | { pathname?: string; search?: string; hash?: string };

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
  relative?: 'route' | 'path';
};

/**
 * useNavigate(): RR returns a function that takes (to, opts) where `to` can
 * be a string path, a partial location object, or a negative number for
 * relative back-navigation. TanStack's navigate takes an options object — we
 * translate to it.
 */
export function useNavigate() {
  const navigate = tUseNavigate();
  const router = tUseRouter();
  return useCallback(
    (to: To, opts?: NavigateOptions) => {
      if (typeof to === 'number') {
        router.history.go(to);
        return;
      }
      if (typeof to === 'string') {
        navigate({
          to,
          replace: opts?.replace,
          state: opts?.state as never,
        });
        return;
      }
      const path = `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
      navigate({
        to: path,
        replace: opts?.replace,
        state: opts?.state as never,
      });
    },
    [navigate, router]
  );
}

// ─── Router (for analytics/blocker that read router state) ─────────────────

export function useRouter() {
  const router = tUseRouter();
  const state = useRouterState();
  return Object.assign(router, { state });
}

// ─── Params ────────────────────────────────────────────────────────────────

/**
 * useParams(): RR returns a loose Record<string, string>. TanStack params
 * are strictly typed per-route; we fall back to merged params via
 * { strict: false } so call sites that index by string still work.
 */
export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): T {
  return tUseParams({ strict: false }) as unknown as T;
}

// ─── Search params ─────────────────────────────────────────────────────────

type SearchParamsInit =
  | string
  | URLSearchParams
  | Record<string, string | string[]>
  | string[][];
type SetURLSearchParams = (
  nextInit: SearchParamsInit | ((prev: URLSearchParams) => SearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

/**
 * useSearchParams(): returns the [URLSearchParams, setter] tuple shape RR
 * exposes. TanStack stores search as a typed object; we serialize to/from
 * URLSearchParams so the API matches.
 */
export function useSearchParams(
  defaultInit?: SearchParamsInit
): [URLSearchParams, SetURLSearchParams] {
  const location = tUseLocation();
  const navigate = tUseNavigate();

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    const raw = (location.search ?? {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(raw)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, String(v));
      } else {
        params.set(key, String(value));
      }
    }
    if (params.toString() === '' && defaultInit) {
      return new URLSearchParams(defaultInit as never);
    }
    return params;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const setSearchParams: SetURLSearchParams = useCallback(
    (nextInit, opts) => {
      const next =
        typeof nextInit === 'function' ? nextInit(searchParams) : nextInit;
      const params = new URLSearchParams(next as never);
      const obj: Record<string, string | string[]> = {};
      for (const key of new Set(Array.from(params.keys()))) {
        const all = params.getAll(key);
        obj[key] = all.length > 1 ? all : (all[0] ?? '');
      }
      navigate({
        to: location.pathname,
        search: obj as never,
        replace: opts?.replace,
      });
    },
    [navigate, location.pathname, searchParams]
  );

  return [searchParams, setSearchParams];
}

export function createSearchParams(init?: SearchParamsInit): URLSearchParams {
  return new URLSearchParams(init as never);
}

// ─── Location ──────────────────────────────────────────────────────────────

type Location = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
};

/**
 * useLocation(): TanStack returns a parsed location; RR returns one with a
 * string `search` (and `state`, `key`). We rebuild that shape so .search
 * indexing still works as a string.
 */
export function useLocation(): Location {
  const loc = tUseLocation();
  const search = useMemo(() => {
    const raw = (loc.search ?? {}) as Record<string, unknown>;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, String(v));
      } else {
        params.set(key, String(value));
      }
    }
    const s = params.toString();
    return s ? `?${s}` : '';
  }, [loc.search]);

  return {
    pathname: loc.pathname,
    search,
    hash: loc.hash ?? '',
    state: (loc as { state?: unknown }).state,
    key: (loc as { key?: string }).key ?? 'default',
  };
}

// ─── Matches ───────────────────────────────────────────────────────────────

/**
 * useMatch(pattern): RR returns null or a match object with params for the
 * requested pattern. We approximate by scanning the active match tree for a
 * routeId that ends with the requested pattern.
 */
export function useMatch(pattern: string) {
  const matches = useMatches();
  const hit = matches.find(
    (m) => m.routeId === pattern || m.routeId.endsWith(pattern)
  );
  if (!hit) return null;
  return {
    params: (hit as { params?: Record<string, string> }).params ?? {},
    pathname: (hit as { pathname?: string }).pathname ?? '',
    pathnameBase: (hit as { pathname?: string }).pathname ?? '',
    route: { path: hit.routeId },
  };
}

export const useNavigationType = (): 'POP' | 'PUSH' | 'REPLACE' => 'PUSH';

// ─── Block ────────────────────────────────────────────────────────────────

/**
 * useBlocker compat: RR's blocker exposes a state machine; for our usages a
 * thin wrapper around TanStack's blocker (no state, just a confirm hook) is
 * enough.
 */
export function useBlocker(
  shouldBlock:
    | boolean
    | ((args: {
        currentLocation: Location;
        nextLocation: Location;
      }) => boolean)
) {
  const enabled = typeof shouldBlock === 'function' ? true : !!shouldBlock;
  tUseBlocker({
    shouldBlockFn: () => enabled,
    enableBeforeUnload: enabled,
  });
  return {
    state: enabled ? ('blocked' as const) : ('unblocked' as const),
    proceed: () => undefined,
    reset: () => undefined,
  };
}

// ─── Link ──────────────────────────────────────────────────────────────────

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  reloadDocument?: boolean;
  relative?: 'route' | 'path';
  children?: ReactNode;
};

/**
 * Link: RR's <Link to="..."/> accepts a string path; TanStack's Link needs
 * a typed `to`. We bypass the typed routes via `as never` and rely on
 * runtime resolution.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function CompatLink(
  { to, replace, state, reloadDocument, relative: _relative, children, ...rest },
  ref
): ReactElement {
  if (reloadDocument) {
    return (
      <a ref={ref} href={to} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <TLink
      ref={ref}
      to={to as never}
      replace={replace}
      state={state as never}
      {...rest}
    >
      {children}
    </TLink>
  );
});

// ─── Navigate ──────────────────────────────────────────────────────────────

export function Navigate({
  to,
  replace,
  state,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}) {
  return (
    <TNavigate to={to as never} replace={replace} state={state as never} />
  );
}

// ─── Sentry hooks (RR-style entrypoints kept inert) ───────────────────────

export function createRoutesFromChildren(): unknown[] {
  return [];
}
export function matchRoutes(): unknown[] {
  return [];
}

// ─── Route error / outlet helpers ──────────────────────────────────────────

/**
 * useRouteError: TanStack handles route errors via errorComponent on the
 * route; pages that still call useRouteError() get null. The error UIs have
 * been re-wired through TanStack's errorComponent so this is a safety net.
 */
export function useRouteError(): unknown {
  return null;
}

export function useOutlet(): ReactNode {
  return <Outlet />;
}
