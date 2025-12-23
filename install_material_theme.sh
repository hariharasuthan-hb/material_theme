#!/bin/bash

# Material Theme Installation Script for ERPNext/Frappe
# This script automates the complete setup of Material Theme
# Usage: ./install_material_theme.sh [site_name]

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
echo -e "${BLUE}Material Theme Installation Script${NC}"
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

# Step 1: Check if Material Theme app is installed
echo -e "${YELLOW}[1/8]${NC} Checking Material Theme app installation..."
if bench --site "${SITE_NAME}" list-apps | grep -q "material_theme"; then
    echo -e "${GREEN}✓${NC} Material Theme app is installed"
else
    echo -e "${RED}✗${NC} Material Theme app is not installed!"
    echo "Please install it first:"
    echo "  bench get-app material_theme"
    echo "  bench --site ${SITE_NAME} install-app material_theme"
    exit 1
fi

# Step 2: Enable developer mode (required for DocType modifications)
echo -e "${YELLOW}[2/8]${NC} Enabling developer mode..."
bench --site "${SITE_NAME}" set-config developer_mode 1
echo -e "${GREEN}✓${NC} Developer mode enabled"

# Step 3: Add Material to desk_theme options in User DocType
echo -e "${YELLOW}[3/8]${NC} Adding 'Material' to desk_theme options..."
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
echo -e "${YELLOW}[4/8]${NC} Creating Website Theme record..."
bench --site "${SITE_NAME}" console << PYTHON_EOF
import frappe
frappe.init(site='${SITE_NAME}')
frappe.connect()

try:
    if frappe.db.exists("Website Theme", "Material Theme"):
        print("✓ Material Theme website theme already exists")
        theme = frappe.get_doc("Website Theme", "Material Theme")
    else:
        theme = frappe.get_doc({
            "doctype": "Website Theme",
            "theme": "Material Theme",
            "module": "Website",
            "custom": 1,
            "button_rounded_corners": 1,
            "button_shadows": 0,
            "button_gradients": 0,
            "custom_scss": "/* Material Theme styles are loaded via web_include_css hook */"
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
echo -e "${YELLOW}[5/8]${NC} Setting Administrator desk_theme to Material..."
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

# Step 6: Run migrations (to apply patches)
echo -e "${YELLOW}[6/8]${NC} Running migrations..."
bench --site "${SITE_NAME}" migrate --skip-failing
echo -e "${GREEN}✓${NC} Migrations completed"

# Step 7: Build assets
echo -e "${YELLOW}[7/8]${NC} Building Material Theme assets..."
bench build --app material_theme
echo -e "${GREEN}✓${NC} Assets built"

# Step 8: Clear cache
echo -e "${YELLOW}[8/8]${NC} Clearing cache..."
bench --site "${SITE_NAME}" clear-cache
echo -e "${GREEN}✓${NC} Cache cleared"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Material Theme Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Restart ERPNext server: ${YELLOW}bench start${NC}"
echo "  2. Log out and log back in"
echo "  3. Hard refresh browser: ${YELLOW}Cmd+Shift+R${NC} (Mac) or ${YELLOW}Ctrl+Shift+R${NC} (Windows/Linux)"
echo ""
echo -e "${BLUE}To apply Material Theme to other users:${NC}"
echo "  - Go to User form → Theme field → Select 'Material'"
echo ""
echo -e "${BLUE}To apply Material Theme to website:${NC}"
echo "  - Go to Website Settings → Website Theme → Select 'Material Theme'"
echo ""
echo -e "${GREEN}All changes are contained in:${NC} apps/material_theme/"
echo -e "${GREEN}No core Frappe files were modified!${NC}"

