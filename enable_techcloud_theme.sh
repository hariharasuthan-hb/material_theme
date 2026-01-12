#!/bin/bash

# Techcloud Theme Enablement Script
# This script enables the Techcloud theme in your Frappe/ERPNext site
# Usage: ./enable_techcloud_theme.sh [site_name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get site name from argument or use default
SITE_NAME="${1:-erpnext.local}"
BENCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$BENCH_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Techcloud Theme Enablement Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Site: ${GREEN}${SITE_NAME}${NC}"
echo -e "Bench Directory: ${GREEN}${BENCH_DIR}${NC}"
echo ""

# Check if bench command exists
if ! command -v bench &> /dev/null; then
    echo -e "${RED}Error: 'bench' command not found!${NC}"
    echo "Please ensure you're running this from a Frappe bench directory."
    exit 1
fi

# Check if site exists
if [ ! -d "sites/${SITE_NAME}" ]; then
    echo -e "${RED}Error: Site '${SITE_NAME}' does not exist!${NC}"
    echo "Available sites:"
    ls -1 sites/ | grep -v "apps.txt\|apps.json\|common_site_config.json\|assets" || echo "  (none)"
    exit 1
fi

# Check if techcloud app is installed
echo -e "${YELLOW}[1/7]${NC} Checking Techcloud app installation..."
if bench --site "${SITE_NAME}" list-apps | grep -q "techcloud"; then
    echo -e "${GREEN}✓${NC} Techcloud app is installed"
else
    echo -e "${YELLOW}⚠${NC} Techcloud app not found in installed apps"
    echo "Installing techcloud app..."
    bench --site "${SITE_NAME}" install-app techcloud || echo -e "${YELLOW}⚠${NC} App installation skipped (may already be installed)"
fi

# Step 1: Build the app
echo -e "${YELLOW}[2/7]${NC} Building Techcloud app assets..."
bench build --app techcloud
echo -e "${GREEN}✓${NC} Assets built"

# Step 2: Enable developer mode
echo -e "${YELLOW}[3/7]${NC} Enabling developer mode..."
bench --site "${SITE_NAME}" set-config developer_mode 1
echo -e "${GREEN}✓${NC} Developer mode enabled"

# Step 3: Add Material to desk_theme options
echo -e "${YELLOW}[4/7]${NC} Adding 'Material' to desk_theme options..."
bench --site "${SITE_NAME}" console << PYTHON_EOF
import frappe
frappe.init(site='${SITE_NAME}')
frappe.connect()

try:
    user_doctype = frappe.get_doc("DocType", "User")
    for field in user_doctype.fields:
        if field.fieldname == "desk_theme":
            current_options = field.options.split("\n") if field.options else []
            if "Material" not in current_options:
                current_options.append("Material")
                field.options = "\n".join(current_options)
                user_doctype.save(ignore_permissions=True)
                frappe.db.commit()
                print("✓ Added 'Material' to desk_theme options")
            else:
                print("✓ 'Material' already in desk_theme options")
            break
except Exception as e:
    print(f"Error: {e}")
    frappe.db.rollback()

frappe.destroy()
PYTHON_EOF

# Step 4: Create Website Theme record
echo -e "${YELLOW}[5/7]${NC} Creating Website Theme record..."
bench --site "${SITE_NAME}" console << PYTHON_EOF
import frappe
frappe.init(site='${SITE_NAME}')
frappe.connect()

try:
    if frappe.db.exists("Website Theme", "Material Theme"):
        print("✓ Material Theme website theme already exists")
    else:
        theme = frappe.get_doc({
            "doctype": "Website Theme",
            "theme": "Material Theme",
            "module": "Website",
            "custom": 1,
            "button_rounded_corners": 1,
            "button_shadows": 0,
            "button_gradients": 0,
            "custom_scss": "/* Techcloud Theme styles are loaded via web_include_css hook */"
        })
        theme.insert()
        frappe.db.commit()
        print("✓ Created Material Theme website theme")
except Exception as e:
    print(f"Error: {e}")
    frappe.db.rollback()

frappe.destroy()
PYTHON_EOF

# Step 5: Set Administrator desk_theme to Material
echo -e "${YELLOW}[6/7]${NC} Setting Administrator desk_theme to Material..."
bench --site "${SITE_NAME}" console << PYTHON_EOF
import frappe
frappe.init(site='${SITE_NAME}')
frappe.connect()

try:
    if frappe.db.exists("User", "Administrator"):
        frappe.db.set_value("User", "Administrator", "desk_theme", "Material")
        frappe.db.commit()
        admin = frappe.get_doc("User", "Administrator")
        print(f"✓ Set Administrator desk_theme to: {admin.desk_theme}")
    else:
        print("⚠ Administrator user not found")
except Exception as e:
    print(f"Error: {e}")
    frappe.db.rollback()

frappe.destroy()
PYTHON_EOF

# Step 6: Run migrations
echo -e "${YELLOW}[7/7]${NC} Running migrations..."
bench --site "${SITE_NAME}" migrate --skip-failing
echo -e "${GREEN}✓${NC} Migrations completed"

# Step 7: Clear cache
echo -e "${YELLOW}[8/8]${NC} Clearing cache..."
bench --site "${SITE_NAME}" clear-cache
echo -e "${GREEN}✓${NC} Cache cleared"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Techcloud Theme Enabled Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. ${YELLOW}Restart ERPNext:${NC} bench start"
echo -e "2. ${YELLOW}Log out and log back in${NC} to see the theme"
echo -e "3. ${YELLOW}For Website:${NC} Go to Website Settings → Website Theme → Select 'Material Theme'"
echo -e "4. ${YELLOW}Hard refresh browser:${NC} Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)"
echo ""

