# Icon Verification Checklist

## ✅ Setup Complete

1. **Icons File**: `icons.svg` contains 15+ professional icons
2. **Hooks Configuration**: `app_include_icons` is set in `hooks.py`
3. **Auto-Icon Script**: `techcloud-icons.js` automatically adds icons to navigation
4. **CSS Styles**: Icon styles are defined in `material.css`
5. **Debug Helper**: `icon-debug.js` for troubleshooting

## 🔍 How to Verify Icons Are Working

### Step 1: Build Assets
```bash
bench build --app techcloud
bench --site erpnext.local clear-cache
bench restart
```

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `window.checkTechcloudIcons()`
4. You should see:
   - Number of icon symbols found (should be 15+)
   - List of available icons
   - Sidebar links and their icon status

### Step 3: Visual Check
Visit these pages and verify icons appear:

1. **My Account Page** (`/me`):
   - ✓ Sidebar should show icons next to: HOME, ADDRESSES, NEWSLETTER, MY ACCOUNT
   - ✓ "Edit Profile" should have pencil icon
   - ✓ "Reset Password" and "Manage Apps" should have arrow icons

2. **Dashboard** (after login):
   - ✓ Sidebar navigation should have icons

### Step 4: Check Icon Loading
In browser DevTools → Network tab:
- Filter by "icons.svg"
- Reload page
- Verify `icons.svg` loads with status 200

### Step 5: Inspect Elements
1. Right-click on a sidebar link (e.g., "MY ACCOUNT")
2. Select "Inspect"
3. You should see:
   ```html
   <a href="/me" class="...">
     <svg class="techcloud-icon icon-sm">
       <use href="#icon-account"></use>
     </svg>
     MY ACCOUNT
   </a>
   ```

## 🐛 Troubleshooting

### Icons Not Showing?

1. **Check if icons.svg is loaded**:
   ```javascript
   // In browser console
   document.querySelectorAll('svg[style*="display: none"] symbol').length
   // Should return 15+
   ```

2. **Check if script is running**:
   ```javascript
   // In browser console
   document.querySelectorAll('.techcloud-icon').length
   // Should return number of icons on page
   ```

3. **Verify hook is set**:
   - Check `apps/techcloud/techcloud/hooks.py`
   - Line should have: `app_include_icons = "techcloud/public/icons/icons.svg"`

4. **Check for JavaScript errors**:
   - Open Console tab
   - Look for red errors
   - Common issues:
     - `Cannot read property 'querySelector'` → Script running too early
     - `#icon-xxx not found` → Icon ID mismatch

### Icons Showing But Wrong Size?

- Check CSS is loaded: `apps/techcloud/techcloud/public/css/material.css`
- Verify `.techcloud-icon` styles are applied
- Check browser DevTools → Elements → Computed styles

### Icons Not Matching Text?

- Icons are matched by text content
- Check `techcloud-icons.js` → `iconMap` object
- Add new mappings if needed

## 📋 Icon Mapping Reference

Current mappings in `techcloud-icons.js`:
- `home` → `icon-home`
- `addresses` / `address` → `icon-addresses`
- `newsletter` → `icon-newsletter`
- `my account` / `account` → `icon-account`
- `dashboard` → `icon-dashboard`
- `inventory` → `icon-inventory`
- `customers` / `customer` → `icon-customers`
- `sales` → `icon-sales`
- `reports` / `report` → `icon-reports`
- `settings` / `setting` → `icon-settings`
- `logout` / `log out` / `sign out` → `icon-logout`

## ✅ Expected Results

After proper setup, you should see:
- ✓ Icons appear next to all sidebar navigation items
- ✓ Icons are properly sized (18px for sidebar)
- ✓ Icons change color on hover (blue when active)
- ✓ Icons are aligned properly with text
- ✓ No console errors
- ✓ Icons load quickly (no flicker)

## 🎨 Customization

To add more icons:
1. Export from Figma as SVG
2. Add to `icons.svg` as `<symbol>` element
3. Add mapping to `iconMap` in `techcloud-icons.js`
4. Rebuild: `bench build --app techcloud`

