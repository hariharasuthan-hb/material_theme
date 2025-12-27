# Techcloud App Renaming Guide

## Configuration Changes Completed ✅

The following configuration files have been updated to use "techcloud" instead of "material_theme":

1. **pyproject.toml** - App name changed to "techcloud"
2. **hooks.py** - app_name, app_title, app_description updated
3. **modules.txt** - Module name changed to "Techcloud ERP"
4. **patches.txt** - Patch reference updated
5. **utils.py** - Asset paths changed from `/assets/material_theme/` to `/assets/techcloud/`
6. **utils.py** - Function names updated (update_techcloud_theme_context, etc.)

## Important Note: Module Folder Name

⚠️ **The module folder is still named `material_theme`**. This means:

- **Python imports** still use `material_theme` (e.g., `material_theme.utils.before_request`)
- **Asset paths** now use `techcloud` (e.g., `/assets/techcloud/css/material.css`)
- **App name** in Frappe is now `techcloud`

## Optional: Rename Module Folder

If you want to fully rename everything to "techcloud", you would need to:

1. **Rename the module folder:**
   ```bash
   cd /Users/bhuvanahari/frappe-bench/apps/techcloud
   mv material_theme techcloud
   ```

2. **Update all Python imports** in hooks.py:
   - Change `material_theme.utils` → `techcloud.utils`
   - Change `material_theme.overrides` → `techcloud.overrides`
   - Change `material_theme.patches` → `techcloud.patches`

3. **Update __init__.py files** if they have any references

4. **Rebuild the app:**
   ```bash
   bench build --app techcloud
   bench --site [site_name] clear-cache
   ```

## Current Status

✅ App name: `techcloud`
✅ Asset paths: `/assets/techcloud/`
⚠️ Module folder: `material_theme` (Python imports still use this)
✅ App title: "Techcloud ERP"

## Next Steps

1. **Move assets** (if needed):
   - The CSS/JS files are currently at: `material_theme/public/css/` and `material_theme/public/js/`
   - Frappe will serve them from `/assets/techcloud/` based on app_name
   - No file movement needed - Frappe handles this automatically

2. **Update installation script** (optional):
   - Update `install_material_theme.sh` to reference "techcloud" instead of "material_theme"

3. **Test the app:**
   ```bash
   bench --site [site_name] clear-cache
   bench build --app techcloud
   ```

## Asset Paths

All asset references have been updated to use `/assets/techcloud/`:
- CSS: `/assets/techcloud/css/material.css`
- JS: `/assets/techcloud/js/material.js`
- JS: `/assets/techcloud/js/material-theme-customizer.js`
- JS: `/assets/techcloud/js/theme.js`

These paths will work once you rebuild the app with `bench build --app techcloud`.

