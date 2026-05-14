#!/usr/bin/env bash
# Idempotently register the notification-spa OIDC client in the tiko realm.
# Use this when Keycloak is already running with a persisted DB so the realm
# import in data/import is not re-run on boot.
#
# Usage: ./infrastructure/keycloak/setup-notification-client.sh
# Prereqs: Keycloak running at localhost:8080, kcadm.sh in PATH or at
#          ./infrastructure/keycloak/bin/kcadm.sh

set -euo pipefail

KC_BIN="${KC_BIN:-./infrastructure/keycloak/bin/kcadm.sh}"
KC_URL="${KC_URL:-http://localhost:8080}"
REALM="${REALM:-tiko}"
CLIENT_ID="notification-spa"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-admin}"

"$KC_BIN" config credentials \
  --server "$KC_URL" \
  --realm master \
  --user "$ADMIN_USER" \
  --password "$ADMIN_PASS"

if "$KC_BIN" get "clients?clientId=$CLIENT_ID" -r "$REALM" | grep -q "\"clientId\""; then
  echo "Client $CLIENT_ID already exists in realm $REALM — skipping create."
else
  echo "Creating client $CLIENT_ID in realm $REALM..."
  "$KC_BIN" create clients -r "$REALM" \
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
