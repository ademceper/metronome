const MOCK_TOKEN = 'local-no-auth';

export function getJwtToken(): string | null {
  return MOCK_TOKEN;
}

export function isJwtValid(_token: string | null): boolean {
  return true;
}
