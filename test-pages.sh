#!/bin/bash
# VisaHelper Page Testing Script
# Tests all pages and captures screenshots

BASE_URL="http://localhost:3000"
OUTPUT_DIR="/home/manik/.openclaw/workspace/final_visaapp/test-results/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo "Starting VisaHelper Page Testing..."
echo "Output directory: $OUTPUT_DIR"

# Public Pages
PUBLIC_PAGES=(
  "/"
  "/visas"
  "/tracker"
  "/news"
  "/lawyers"
  "/about"
  "/faq"
  "/contact"
  "/legal/privacy"
  "/legal/terms"
)

# Auth Pages
AUTH_PAGES=(
  "/auth/signin"
  "/auth/signup"
  "/auth/forgot-password"
)

# Test function
test_page() {
  local page=$1
  local name=$2
  echo "Testing $name: $page"
  
  # Take screenshot using openclaw browser
  openclaw browser --browser-profile headless open "${BASE_URL}${page}" 2>/dev/null
  sleep 3
  openclaw browser --browser-profile headless screenshot --full-page > "$OUTPUT_DIR/${name}.png" 2>/dev/null
  
  # Check HTTP status
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${page}")
  echo "  Status: $status"
  
  if [ "$status" = "200" ]; then
    echo "  ✓ PASS"
  else
    echo "  ✗ FAIL"
  fi
}

# Test all public pages
echo ""
echo "=== Testing Public Pages ==="
for page in "${PUBLIC_PAGES[@]}"; do
  name=$(echo "$page" | tr '/' '_' | sed 's/^_//')
  [ -z "$name" ] && name="home"
  test_page "$page" "$name"
done

# Test auth pages
echo ""
echo "=== Testing Auth Pages ==="
for page in "${AUTH_PAGES[@]}"; do
  name=$(echo "$page" | tr '/' '_')
  test_page "$page" "$name"
done

echo ""
echo "Testing complete! Screenshots saved to: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"
