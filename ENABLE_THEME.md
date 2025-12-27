# Enable Techcloud Theme - Quick Guide

## ✅ Quick Setup Summary (Already Applied)

The following has been configured for your site (`erpnext.local`):

- ✅ **Website Theme "Techcloud Theme"** - Created and available in Website Settings dropdown
- ✅ **Desk Theme "Material"** - Added to User desk_theme options  
- ✅ **Administrator desk_theme** - Set to "Material" (applies Techcloud styling)

**To verify everything is set up:**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
themes = frappe.get_all("Website Theme", fields=["name", "theme"])
print("Website Themes:", [t.name for t in themes])
print("Admin desk_theme:", frappe.db.get_value("User", "Administrator", "desk_theme"))
frappe.destroy()
EOF
```

**Expected output:**
- Website Themes: ['Standard', 'Material Theme', 'Techcloud Theme']
- Admin desk_theme: Material

---

## Prerequisites

✅ **Module Structure Fixed:**
- Module folder renamed from `material_theme` to `techcloud`
- All Python imports updated to use `techcloud.*`
- App name set to `techcloud` in pyproject.toml
- techcloud added to `sites/apps.txt`

## ⚠️ IMPORTANT: Fix Import Error First!

**Before proceeding, you MUST create the `.pth` file** (see Step 1 below). Without it, you'll get `ModuleNotFoundError: No module named 'techcloud'` when trying to install or build.

**Quick fix:**
```bash
cd /Users/bhuvanahari/frappe-bench
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
```

This tells Python where to find the techcloud module. **This is the root cause of the import error!**

## Step 1: Create .pth File (REQUIRED FIRST - Fixes Import Error)

**This is the root cause fix!** Python needs the `.pth` file to find the techcloud module.

### 📋 General Syntax Format:
```bash
echo "/path/to/frappe-bench/apps/techcloud" > env/lib/python*/site-packages/techcloud.pth
```

### 💡 Example:
```bash
cd /Users/bhuvanahari/frappe-bench
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
```

**Verify it was created:**
```bash
cat env/lib/python3.10/site-packages/techcloud.pth
```

Should show: `/Users/bhuvanahari/frappe-bench/apps/techcloud`

**Why this is needed:** The `.pth` file tells Python to add the apps/techcloud directory to sys.path, allowing Python to import the techcloud module. Without this, you'll get `ModuleNotFoundError`.

---

## Step 2: Install the App in Site

Now install the app in your site:

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> install-app techcloud
```

### 💡 Example:
```bash
cd /Users/bhuvanahari/frappe-bench
bench --site erpnext.local install-app techcloud
```

**To find your site name:**
```bash
ls sites/ | grep -v "^apps\|^assets\|^common"
```

**Common site name examples:**
- `erpnext.local` (development)
- `erpnext.example.com` (production)
- `site1.local`
- `mysite.local`

**Expected output:**
```
Installing techcloud...
Updating Dashboard for techcloud
```

**Note:** If you still get `ModuleNotFoundError` after creating the `.pth` file, make sure:
1. The `.pth` file path is correct (absolute path)
2. You're using the correct Python version (check with `python3 --version`)
3. The file is in the right location: `env/lib/python3.10/site-packages/` (replace 3.10 with your Python version)

## Step 3: Build the App

### 📋 General Syntax Format:
```bash
bench build --app techcloud
```

### 💡 Example:
```bash
bench build --app techcloud
```

**Alternative:** If you want to build all apps:
```bash
bench build
```

**Expected output:**
```
Done in X.XXs.
Compiling translations for techcloud
```

## Step 4: Enable Developer Mode (if not already enabled)

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> set-config developer_mode 1
```

### 💡 Example:
```bash
bench --site erpnext.local set-config developer_mode 1
```

## Step 5: Add "Material" to Desk Theme Options (For Techcloud App)

**This step adds "Material" as a desk theme option so users can select the Techcloud theme in their User settings.**

**Note:** The desk theme is still called "Material" (this is what the Techcloud app code expects). When users select "Material" as their desk theme, they'll get the Techcloud styling.

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> console
```

### 💡 Example:
```bash
bench --site erpnext.local console
```

Then run in Python console:
### 📋 General Format:
```python
import frappe
frappe.init(site='<your_site_name>')
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
            print("✓ Added 'Material' to desk_theme options (for Techcloud theme)")
        else:
            print("✓ 'Material' already in desk_theme options")
        break

frappe.destroy()
```

**Alternative: One-liner command (no console needed):**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
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
EOF
```

## Step 6: Create Website Theme Record

**This step creates the "Techcloud Theme" option in the Website Settings dropdown.**

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> console
```

### 💡 Example:
```bash
bench --site erpnext.local console
```

Then run in Python console:
### 📋 General Format:
```python
import frappe
frappe.init(site='<your_site_name>')
frappe.connect()

if frappe.db.exists("Website Theme", "Techcloud Theme"):
    print("✓ Techcloud Theme website theme already exists")
else:
    theme = frappe.get_doc({
        "doctype": "Website Theme",
        "theme": "Techcloud Theme",
        "module": "Website",
        "custom": 1,
        "button_rounded_corners": 1,
        "button_shadows": 0,
        "button_gradients": 0,
        "custom_scss": "/* Techcloud Theme styles are loaded via web_include_css hook */"
    })
    theme.insert()
    frappe.db.commit()
    print("✓ Created Techcloud Theme website theme")

frappe.destroy()
```

**Alternative: One-liner command (no console needed):**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
if not frappe.db.exists("Website Theme", "Techcloud Theme"):
    theme = frappe.get_doc({"doctype": "Website Theme", "theme": "Techcloud Theme", "module": "Website", "custom": 1, "button_rounded_corners": 1, "button_shadows": 0, "button_gradients": 0, "custom_scss": "/* Techcloud Theme styles */"})
    theme.insert()
    frappe.db.commit()
    print("✓ Created Techcloud Theme")
frappe.destroy()
EOF
```

**Verify it was created:**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
themes = frappe.get_all("Website Theme", fields=["name", "theme"])
print("Available Website Themes:")
for t in themes:
    print(f"  - {t.name} ({t.theme})")
frappe.destroy()
EOF
```

**Expected output:**
```
Available Website Themes:
  - Standard (Standard)
  - Material Theme (Material Theme)
  - Techcloud Theme (Techcloud Theme)
```

## Step 7: Set Administrator Desk Theme (Techcloud Theme)

**This sets the Administrator user's desk theme to "Material" (which applies the Techcloud theme styling).**

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> console
```

### 💡 Example:
```bash
bench --site erpnext.local console
```

Then run in Python console:
### 📋 General Format:
```python
import frappe
frappe.init(site='<your_site_name>')
frappe.connect()

frappe.db.set_value("User", "Administrator", "desk_theme", "Material")
frappe.db.commit()
print("✓ Set Administrator desk_theme to Material (Techcloud theme)")

frappe.destroy()
```

**Alternative: One-liner command (no console needed):**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
frappe.db.set_value("User", "Administrator", "desk_theme", "Material")
frappe.db.commit()
print("✓ Set Administrator desk_theme to Material")
frappe.destroy()
EOF
```

**To set for other users:**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
# Replace "user@example.com" with the actual username/email
frappe.db.set_value("User", "user@example.com", "desk_theme", "Material")
frappe.db.commit()
print("✓ Set desk_theme to Material")
frappe.destroy()
EOF
```

## Step 8: Run Migrations

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> migrate
```

### 💡 Example:
```bash
bench --site erpnext.local migrate
```

## Step 9: Clear Cache

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> clear-cache
```

### 💡 Example:
```bash
bench --site erpnext.local clear-cache
```

## Step 10: Apply Theme in UI

### For App/Admin Interface (Desk Theme):
1. **Log out and log back in** to ERPNext
2. The Techcloud theme (shown as "Material" in the UI) should automatically apply if you set it in Step 7
3. For other users: 
   - Go to **User** form → **Theme** field → Select **"Material"**
   - Or use the command in Step 7 to set it programmatically
4. **Note:** The theme option is called "Material" but it applies the Techcloud theme styling

### For Website:
1. Go to **Website Settings** → **Website Theme** dropdown
2. You should now see **"Techcloud Theme"** in the list (along with Standard and Material Theme)
3. Select **"Techcloud Theme"**
4. Click **Save**
5. Clear cache:
   - **Format:** `bench --site <your_site_name> clear-cache`
   - **Example:** `bench --site erpnext.local clear-cache`

**Note:** If "Techcloud Theme" doesn't appear in the dropdown:
- Make sure you completed Step 6 (Create Website Theme Record)
- Refresh the page (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
- Check that the theme was created using the verify command in Step 6

---

## Step 11: Verify Everything is Set Up Correctly

**Run this verification command to check all settings:**

### 📋 General Syntax Format:
```bash
bench --site <your_site_name> console
```

### 💡 Example:
```bash
bench --site erpnext.local console
```

Then run in Python console:
```python
import frappe
frappe.init(site='erpnext.local')
frappe.connect()

# Check Website Themes
themes = frappe.get_all("Website Theme", fields=["name", "theme"])
print("Available Website Themes:")
for t in themes:
    print(f"  - {t.name} ({t.theme})")

# Check Administrator desk_theme
admin_theme = frappe.db.get_value("User", "Administrator", "desk_theme")
print(f"\nAdministrator desk_theme: {admin_theme}")

# Check if Material is in desk_theme options
user_doctype = frappe.get_doc("DocType", "User")
for field in user_doctype.fields:
    if field.fieldname == "desk_theme":
        options = field.options.split("\n") if field.options else []
        print(f"\ndesk_theme options: {options}")
        if "Material" in options:
            print("✓ 'Material' is in desk_theme options")
        else:
            print("✗ 'Material' is NOT in desk_theme options")
        break

frappe.destroy()
```

**Alternative: One-liner verification command:**
```bash
bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()
themes = frappe.get_all("Website Theme", fields=["name", "theme"])
print("=== Website Themes ===")
for t in themes:
    print(f"  - {t.name} ({t.theme})")
admin_theme = frappe.db.get_value("User", "Administrator", "desk_theme")
print(f"\n=== Administrator Settings ===")
print(f"desk_theme: {admin_theme}")
user_doctype = frappe.get_doc("DocType", "User")
for field in user_doctype.fields:
    if field.fieldname == "desk_theme":
        options = field.options.split("\n") if field.options else []
        print(f"desk_theme options: {', '.join(options)}")
        break
frappe.destroy()
EOF
```

**Expected output:**
```
=== Website Themes ===
  - Standard (Standard)
  - Material Theme (Material Theme)
  - Techcloud Theme (Techcloud Theme)

=== Administrator Settings ===
desk_theme: Material
desk_theme options: Light, Dark, Automatic, Material
```

**If everything shows correctly:**
- ✅ Website Theme "Techcloud Theme" is available
- ✅ Administrator desk_theme is set to "Material"
- ✅ "Material" is in desk_theme options

**If something is missing:**
- Re-run the corresponding step (Step 5, 6, or 7)
- Then run this verification again

## Troubleshooting Build Errors

### ❌ ERROR: `ModuleNotFoundError: No module named 'techcloud'`

This error is **100% clear** and **not related to Material Theme or CSS** 👍  
It's a **bench/app registration problem**.

**What it means:** Bench is trying to build an app called `techcloud`, but Python cannot find `apps/techcloud/techcloud`

---

### ✅ STEP-BY-STEP FIX (FOLLOW IN ORDER)

#### 0️⃣ CREATE .pth FILE (MOST IMPORTANT - DO THIS FIRST!)

**This is the root fix!** Create the `.pth` file that tells Python where to find the module:

**Format:**
```bash
echo "/path/to/frappe-bench/apps/techcloud" > env/lib/python*/site-packages/techcloud.pth
```

**Example:**
```bash
cd /Users/bhuvanahari/frappe-bench
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
```

**Verify:**
```bash
cat env/lib/python3.10/site-packages/techcloud.pth
```

Should show the absolute path to `apps/techcloud`.

**Find your Python version:**
```bash
python3 --version
# Then use: env/lib/python3.X/site-packages/ (replace X with your version)
```

---

#### 1️⃣ Check if app exists physically

```bash
ls apps/
```

Look for `techcloud` folder.

**❌ If NOT present:**
- You **cannot build it**
- Use: `bench build` (no `--app` flag)

---

#### 2️⃣ If folder EXISTS, check structure

```bash
ls apps/techcloud
```

You MUST see:
```text
techcloud/
pyproject.toml
```

Then check inside:
```bash
ls apps/techcloud/techcloud
```

You MUST see:
```text
__init__.py
hooks.py
utils.py
```

**❌ If `techcloud/techcloud` missing:**
- App is broken/incomplete
- Fix folder structure first

---

#### 3️⃣ Check apps.txt

```bash
cat sites/apps.txt
```

If you see `techcloud` but Python can't import it → **bench will ALWAYS fail**

**🔧 Fix:**
1. **First, create the `.pth` file** (see step 0️⃣ above)
2. Then techcloud should be importable
3. If still failing, temporarily remove from apps.txt:
```bash
# Remove techcloud from apps.txt temporarily
sed -i '' '/^techcloud$/d' sites/apps.txt

# Create .pth file first, then add back
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
echo "techcloud" >> sites/apps.txt
```

---

#### 4️⃣ Check if app is installed on site

**Format:**
```bash
bench --site <your_site_name> list-apps
```

**Example:**
```bash
bench --site erpnext.local list-apps
```

If `techcloud` appears but folder is missing → uninstall it:

**Format:**
```bash
bench --site <your_site_name> uninstall-app techcloud
```

**Example:**
```bash
bench --site erpnext.local uninstall-app techcloud
```

---

#### 5️⃣ Clear Python cache (IMPORTANT)

```bash
find apps/techcloud -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
find apps/techcloud -name "*.pyc" -delete 2>/dev/null
```

---

#### 6️⃣ Run correct build command

**✅ Correct (recommended):**
```bash
bench build
```

**❌ Don't use unless app exists and is properly set up:**
```bash
bench build --app techcloud
```

---

### ✅ WHY THIS HAPPENS

Bench does this internally:
```python
import techcloud
```

Python looks for:
```text
apps/techcloud/techcloud/__init__.py
```

**The Problem:** Python doesn't know where `apps/techcloud` is because it's not in `sys.path`.

**The Solution:** The `.pth` file in `env/lib/python*/site-packages/` tells Python to add `apps/techcloud` to the import path.

**Without .pth file:** Python can't find the module → 💥 `ModuleNotFoundError`

**With .pth file:** Python can import the module → ✅ Works!

---

### ✅ QUICK DECISION TABLE

| Situation                    | Solution                                    |
| ---------------------------- | ------------------------------------------- |
| Missing .pth file           | Create `env/lib/python*/site-packages/techcloud.pth` |
| App does not exist           | `bench build` (builds all apps)             |
| App exists but broken        | Fix folder structure first                  |
| .pth file exists but still fails | Check Python version matches .pth location |
| App installed wrongly        | `uninstall-app techcloud` then reinstall   |

---

### 🧠 FINAL SAFE COMMANDS (COPY–PASTE)

```bash
cd /Users/bhuvanahari/frappe-bench

# Step 1: Create .pth file (CRITICAL - fixes import error)
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth

# Step 2: Verify .pth file was created
cat env/lib/python3.10/site-packages/techcloud.pth

# Step 3: Check app exists
ls apps/techcloud/techcloud/

# Step 4: Ensure techcloud is in apps.txt
echo "techcloud" >> sites/apps.txt

# Step 5: Install the app
bench --site erpnext.local install-app techcloud

# Step 6: Build
bench build --app techcloud

# Step 7: Restart
bench restart
```

---

### 🔍 DIAGNOSTIC COMMANDS

If you want help, paste the output of:
```bash
# Check if .pth file exists
ls -la env/lib/python*/site-packages/techcloud.pth

# Check app structure
ls apps/techcloud/techcloud/

# Check apps.txt
cat sites/apps.txt

# Check Python version
python3 --version
```

**Most common issue:** Missing `.pth` file. If it doesn't exist, create it:
```bash
echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
```
(Replace `3.10` with your Python version from `python3 --version`)

---

## ✅ Summary: The Complete Fix

**The root cause:** Missing `.pth` file prevents Python from finding the techcloud module.

**The solution (3 steps):**

1. **Create .pth file:**
   ```bash
   echo "/Users/bhuvanahari/frappe-bench/apps/techcloud" > env/lib/python3.10/site-packages/techcloud.pth
   ```

2. **Install the app:**
   ```bash
   bench --site erpnext.local install-app techcloud
   ```

3. **Build:**
   ```bash
   bench build --app techcloud
   ```

**That's it!** The `.pth` file is the key - it tells Python where to find your app module.

## Verification

1. **Check User Theme:**
   - Go to User form → Theme field should show "Material"

2. **Check Website Theme:**
   - Go to Website Settings → Website Theme should be "Material Theme"

3. **Visual Check:**
   - App interface should show Material Design styling
   - Website should show Material Design colors and typography

4. **Check CSS Loading:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Filter by `material.css` or `techcloud`
   - You should see `/assets/techcloud/css/material.css` loaded with status 200
   - If CSS is NOT loading, see troubleshooting section below

## Troubleshooting: CSS Not Loading

### ❌ Issue: CSS file `/assets/techcloud/css/material.css` not appearing in Network tab

**Symptoms:**
- Theme is set correctly (Website Theme = "Techcloud Theme", Desk Theme = "Material")
- CSS file is not loading in browser Network tab
- Techcloud styling is not applying

**Root Cause:**
The theme name check in `techcloud/utils.py` was checking for `"Material Theme"` instead of `"Techcloud Theme"`, causing the CSS to not be added to the page context.

**Fix Applied:**
The code in `apps/techcloud/techcloud/utils.py` has been updated to check for the correct theme name:

**Before (incorrect):**
```python
is_techcloud_theme = theme and theme.name == "Material Theme"
```

**After (correct):**
```python
is_techcloud_theme = theme and theme.name == "Techcloud Theme"
```

**Verification:**
After the fix, you should see in the browser Network tab:
- ✅ `/assets/techcloud/css/material.css` - Status 200
- ✅ `/assets/techcloud/js/material.js` - Status 200
- ✅ `/assets/techcloud/js/material-theme-customizer.js` - Status 200
- ✅ `/assets/techcloud/js/theme.js` - Status 200

**If CSS still not loading after fix:**
1. Restart bench: `bench restart`
2. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Clear cache: `bench --site erpnext.local clear-cache`
4. Check Error Log in ERPNext for "Techcloud CSS Debug" messages
5. Verify Website Theme is set to "Techcloud Theme" (not "Material Theme")
6. Verify Desk Theme is set to "Material" (for desk/app pages)

---

## Current App Configuration

- **App Name:** `techcloud`
- **Module Folder:** `apps/techcloud/techcloud/`
- **Asset Paths:** `/assets/techcloud/`
- **Python Imports:** `techcloud.*`
- **apps.txt:** Contains `techcloud`
- **Website Theme Name:** "Techcloud Theme" (must match in utils.py)
- **Desk Theme Name:** "Material" (applies Techcloud styling)

