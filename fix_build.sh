#!/bin/bash

# Fix Build Error for Techcloud App
# This script fixes the build error by installing the app in the site

set -e

SITE_NAME="${1:-erpnext.local}"
BENCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$BENCH_DIR"

echo "=========================================="
echo "Fixing Techcloud App Build Error"
echo "=========================================="
echo ""
echo "Site: ${SITE_NAME}"
echo ""

# Step 1: Add techcloud to apps.txt if not present
echo "[1/3] Checking apps.txt..."
if ! grep -q "^techcloud$" sites/apps.txt; then
    echo "techcloud" >> sites/apps.txt
    echo "✓ Added techcloud to apps.txt"
else
    echo "✓ techcloud already in apps.txt"
fi

# Step 2: Install the app in the site
echo "[2/3] Installing techcloud app in site..."
bench --site "${SITE_NAME}" install-app techcloud || {
    echo "⚠ App installation may have failed, but continuing..."
}

# Step 3: Try building again
echo "[3/3] Building techcloud app..."
bench build --app techcloud

echo ""
echo "=========================================="
echo "Build fix completed!"
echo "=========================================="
echo ""
echo "If build still fails, you may need to rename the module folder:"
echo "  cd apps/techcloud"
echo "  mv material_theme techcloud"
echo "  # Then update imports in hooks.py"
echo ""

