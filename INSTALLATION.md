# Material Theme Installation Guide

## Overview

This guide explains how to install and configure Material Theme for ERPNext/Frappe. All changes are contained within the `material_theme` app folder - **no core Frappe files are modified**.

## Prerequisites

- ERPNext/Frappe bench installed and running
- Material Theme app installed in your bench
- Site created and ERPNext installed

## Quick Installation

### Automated Installation (Recommended)

```bash
cd /path/to/frappe-bench
./apps/material_theme/install_material_theme.sh [site_name]
```

**Example:**
```bash
./apps/material_theme/install_material_theme.sh erpnext.local
```

The script will automatically:
1. ✅ Check Material Theme app installation
2. ✅ Enable developer mode
3. ✅ Add "Material" to desk_theme options
4. ✅ Create Website Theme record
5. ✅ Set Administrator desk_theme to Material
6. ✅ Run migrations
7. ✅ Build assets
8. ✅ Clear cache

### Manual Installation

If you prefer to install manually, follow these steps:

#### Step 1: Enable Developer Mode

```bash
bench --site [site_name] set-config developer_mode 1
```

#### Step 2: Add Material to desk_theme Options

```bash
bench --site [site_name] console
```

Then run:
```python
import frappe
frappe.init(site='[site_name]')
frappe.connect()

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
        break

frappe.destroy()
```

#### Step 3: Create Website Theme Record

```bash
bench --site [site_name] console
```

Then run:
```python
import frappe
frappe.init(site='[site_name]')
frappe.connect()

if frappe.db.exists("Website Theme", "Material Theme"):
    print("Material Theme website theme already exists")
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

frappe.destroy()
```

#### Step 4: Set Administrator Theme

```bash
bench --site [site_name] console
```

Then run:
```python
import frappe
frappe.init(site='[site_name]')
frappe.connect()

frappe.db.set_value("User", "Administrator", "desk_theme", "Material")
frappe.db.commit()
print("✓ Set Administrator desk_theme to Material")

frappe.destroy()
```

#### Step 5: Build Assets and Clear Cache

```bash
bench build --app material_theme
bench --site [site_name] clear-cache
```

## Applying Material Theme

### For App/Admin Interface

1. **Log out and log back in** to ERPNext
2. Material Theme should automatically apply if Administrator's `desk_theme` is set to "Material"
3. For other users:
   - Go to **User** form → **Theme** field → Select **"Material"**

### For Website

1. Go to **Website Settings** → **Website Theme** → Select **"Material Theme"**
2. Save
3. Clear website cache: `bench --site [site_name] clear-cache`

## Verification

### Check if Material Theme is Active

1. **App Interface:**
   - Check User form → Theme field should show "Material"
   - Visual: Sidebar selected items should have colored background with shadow

2. **Website:**
   - Check Website Settings → Website Theme should be "Material Theme"
   - Visual: Material Design colors and typography should be visible

### Verify CSS is Loading

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by `material.css`
4. You should see `/assets/material_theme/css/material.css` loaded

## File Structure

All Material Theme files are contained in:
```
apps/material_theme/
├── material_theme/
│   ├── hooks.py          # App configuration (app_include_css, web_include_css)
│   ├── utils.py          # Website context update function
│   ├── public/
│   │   └── css/
│   │       └── material.css  # Main Material Theme CSS
│   └── patches/
│       └── add_theme_setting_user.py  # Patch to add Material option
└── install_material_theme.sh  # Installation script
```

## Production Deployment

### What to Include

**Required:**
- Entire `apps/material_theme/` folder (contains all theme files)

**Optional:**
- Website Theme database record (can be recreated using installation script)

### Deployment Steps

1. Copy `apps/material_theme/` folder to production bench
2. Run installation script: `./apps/material_theme/install_material_theme.sh [site_name]`
3. Restart ERPNext server
4. Clear cache: `bench --site [site_name] clear-cache`

### Important Notes

- ✅ **All changes are in Material Theme app folder only**
- ✅ **No core Frappe files are modified**
- ✅ **CSS loads automatically via hooks (app_include_css, web_include_css)**
- ✅ **Theme applies to both app interface and website**

## Troubleshooting

### Theme Not Applying

1. **Check User Theme Setting:**
   ```bash
   bench --site [site_name] console
   ```
   ```python
   import frappe
   frappe.init(site='[site_name]')
   frappe.connect()
   user = frappe.get_doc("User", "Administrator")
   print(f"desk_theme: {user.desk_theme}")
   frappe.destroy()
   ```

2. **Rebuild Assets:**
   ```bash
   bench build --app material_theme
   bench --site [site_name] clear-cache
   ```

3. **Hard Refresh Browser:**
   - Mac: `Cmd+Shift+R`
   - Windows/Linux: `Ctrl+Shift+R`

4. **Check Browser Console:**
   - Open DevTools (F12) → Console tab
   - Look for CSS loading errors

### Material Option Not in Dropdown

Run the installation script again or manually add Material to desk_theme options (Step 2 in Manual Installation).

## Support

For issues or questions:
- Check Material Theme repository: https://github.com/itrostack/material_theme
- Review ERPNext documentation: https://frappeframework.com/docs

