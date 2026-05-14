#!/usr/bin/env bash
# Idempotently register the notification-spa OIDC client in the tiko realm.
# Auto-detects the Keycloak runtime:
#   - dockerized: keycloak-keycloakify container (from pnpm --filter auth dev)
#   - native: ./infrastructure/keycloak/bin/kcadm.sh (from pnpm --filter auth dev:local)
#
# Override with env vars:
#   KC_CONTAINER (docker container name) — forces docker mode
#   KC_BIN (path to kcadm.sh) — forces native mode

set -euo pipefail

KC_URL="${KC_URL:-http://localhost:8080}"
REALM="${REALM:-tiko}"
CLIENT_ID="notification-spa"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-admin}"

# Detect mode
if [ -n "${KC_CONTAINER:-}" ]; then
  MODE="docker"
elif [ -n "${KC_BIN:-}" ]; then
  MODE="native"
elif command -v docker >/dev/null && docker ps --format '{{.Names}}' | grep -q '^keycloak-keycloakify$'; then
  MODE="docker"
  KC_CONTAINER="keycloak-keycloakify"
elif [ -x "./infrastructure/keycloak/bin/kcadm.sh" ]; then
  MODE="native"
  KC_BIN="./infrastructure/keycloak/bin/kcadm.sh"
else
  echo "Could not find Keycloak runtime (no keycloak-keycloakify container and no infrastructure/keycloak/bin/kcadm.sh)." >&2
  exit 1
fi

kcadm() {
  if [ "$MODE" = "docker" ]; then
    docker exec "$KC_CONTAINER" /opt/keycloak/bin/kcadm.sh "$@"
  else
    "$KC_BIN" "$@"
  fi
}

echo "Using $MODE Keycloak ($KC_URL, realm=$REALM)..."

kcadm config credentials \
  --server "$KC_URL" \
  --realm master \
  --user "$ADMIN_USER" \
  --password "$ADMIN_PASS"

if kcadm get "clients?clientId=$CLIENT_ID" -r "$REALM" 2>/dev/null | grep -q "\"clientId\""; then
  echo "Client $CLIENT_ID already exists in realm $REALM — skipping create."
else
  echo "Creating client $CLIENT_ID in realm $REALM..."
  kcadm create clients -r "$REALM" \
    -s clientId="$CLIENT_ID" \
    -s name="Notification Dashboard" \
    -s 'redirectUris=["http://localhost:4201/*","http://127.0.0.1:4201/*"]' \
    -s 'webOrigins=["http://localhost:4201","http://127.0.0.1:4201"]' \
    -s rootUrl=http://localhost:4201 \
    -s baseUrl=http://localhost:4201 \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=false \
    -s 'attributes={"pkce.code.challenge.method":"S256","post.logout.redirect.uris":"http://localhost:4201/*##http://127.0.0.1:4201/*"}'
  echo "Created $CLIENT_ID."
fi
