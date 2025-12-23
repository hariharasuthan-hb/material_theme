# Material Theme - Quick Start Guide

## Installation (One Command)

```bash
cd /path/to/frappe-bench
./apps/material_theme/install_material_theme.sh erpnext.local
```

## What Gets Installed

✅ Adds "Material" to desk_theme dropdown  
✅ Creates Website Theme record  
✅ Sets Administrator theme to Material  
✅ Builds assets and clears cache  

## After Installation

1. **Restart ERPNext:**
   ```bash
   bench start
   ```

2. **Log out and log back in**

3. **Hard refresh browser:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

## Apply to Other Users

- Go to **User** form → **Theme** field → Select **"Material"**

## Apply to Website

- Go to **Website Settings** → **Website Theme** → Select **"Material Theme"**

## File Locations

**All changes are in:** `apps/material_theme/`

**Key files:**
- `hooks.py` - CSS hooks configuration
- `public/css/material.css` - Main theme CSS
- `utils.py` - Website context updates
- `patches/add_theme_setting_user.py` - Adds Material option

## Production Deployment

1. Copy entire `apps/material_theme/` folder
2. Run installation script on production
3. Restart server
4. Clear cache

**That's it!** No core files modified. ✅

