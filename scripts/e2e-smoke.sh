#!/usr/bin/env bash
set -euo pipefail

API_URL=${API_URL:-http://localhost:8080/api}
ADMIN_USER=${ADMIN_USER:-admin}
ADMIN_PASS=${ADMIN_PASS:-Admin@123}

echo "API_URL=$API_URL"

json() {
  key="$1"; shift
  printf '{'
  local first=1
  while [ "$#" -gt 0 ]; do
    [ $first -eq 1 ] || printf ','
    first=0
    printf '"%s":"%s"' "$1" "$2"
    shift 2
  done
  printf '}'
}

extract_json_value() {
  local key="$1"; shift
  sed -n "s/.*\"$key\":\"\([^"]*\)\".*/\1/p"
}

echo "1) Login as admin"
LOGIN_RES=$(curl -sf -H 'Content-Type: application/json' -d "$(json usernameOrEmail "$ADMIN_USER" password "$ADMIN_PASS")" "$API_URL/auth/login")
TOKEN=$(echo "$LOGIN_RES" | extract_json_value token)
echo "Token acquired: ${#TOKEN} bytes"

AUTH_HEADER=("Authorization: Bearer $TOKEN")

echo "2) Create product"
PROD_NAME="TestProduct-$(date +%s)"
CREATE_RES=$(curl -sf -H 'Content-Type: application/json' -H "${AUTH_HEADER[@]}" \
  -d "$(json name "$PROD_NAME" category "Demo" description "E2E item" price "9.99" stockQuantity "5" threshold "2")" \
  "$API_URL/products")
PROD_ID=$(echo "$CREATE_RES" | extract_json_value id)
echo "Created product: $PROD_ID"

echo "3) Increase stock"
curl -sf -H "${AUTH_HEADER[@]}" -X POST "$API_URL/products/$PROD_ID/increase?qty=3" >/dev/null

echo "4) Record sale"
curl -sf -H 'Content-Type: application/json' -H "${AUTH_HEADER[@]}" \
  -d "$(json productId "$PROD_ID" quantity "2")" "$API_URL/sales" >/dev/null

echo "5) List products"
curl -sf -H "${AUTH_HEADER[@]}" "$API_URL/products?page=0&size=10" >/dev/null

echo "6) Reports JSON"
curl -sf -H "${AUTH_HEADER[@]}" "$API_URL/reports/stock" >/dev/null
curl -sf -H "${AUTH_HEADER[@]}" "$API_URL/reports/sales?period=weekly" >/dev/null

echo "7) Download exports (written to /tmp)"
curl -sf -H "${AUTH_HEADER[@]}" -o /tmp/stock.xlsx "$API_URL/reports/stock.xlsx"
curl -sf -H "${AUTH_HEADER[@]}" -o /tmp/sales.xlsx "$API_URL/reports/sales.xlsx?period=weekly"
curl -sf -H "${AUTH_HEADER[@]}" -o /tmp/stock.pdf "$API_URL/reports/stock.pdf"
curl -sf -H "${AUTH_HEADER[@]}" -o /tmp/sales.pdf "$API_URL/reports/sales.pdf?period=weekly"
echo "Saved: /tmp/stock.xlsx /tmp/sales.xlsx /tmp/stock.pdf /tmp/sales.pdf"

echo "8) Audit logs"
curl -sf -H "${AUTH_HEADER[@]}" "$API_URL/audit" >/dev/null

echo "OK: All smoke tests passed"

