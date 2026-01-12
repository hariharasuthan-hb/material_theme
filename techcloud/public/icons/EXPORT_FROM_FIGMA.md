# Step-by-Step Guide: Export Icons from Figma

## Method 1: Export Individual Icons (Recommended for First Time)

1. **Open Figma Design**:
   - Go to: https://www.figma.com/design/HeNnCfW6Q7EQ9u0z0bkZKF/ERP-Amax?node-id=0-1&p=f
   - Make sure you have access to the design file

2. **Select an Icon**:
   - Click on the icon you want to export
   - Make sure it's selected (highlighted)

3. **Export as SVG**:
   - Look at the right sidebar
   - Scroll to the "Export" section
   - Click the "+" button to add an export setting
   - Select "SVG" from the format dropdown
   - Click "Export [icon-name]"
   - Save it to: `apps/techcloud/techcloud/public/icons/icon-[name].svg`

4. **Repeat for All Icons**:
   - Do this for each icon you need
   - Use descriptive names: `icon-dashboard.svg`, `icon-inventory.svg`, etc.

## Method 2: Batch Export Using Figma Plugin

1. **Install SVG Export Plugin**:
   - In Figma, go to Menu → Plugins → Browse plugins
   - Search for "SVG Export" or "Batch Export"
   - Install the plugin

2. **Select All Icons**:
   - Select all icon frames/components you want to export
   - Run the plugin
   - Choose export location: `apps/techcloud/techcloud/public/icons/`

3. **Plugin will export all selected icons as individual SVG files**

## Method 3: Manual Copy-Paste (For SVG Sprite)

1. **Select Icon in Figma**:
   - Click on the icon
   - Right-click → "Copy as SVG" or "Copy/Paste as SVG"

2. **Paste into Text Editor**:
   - Open the SVG code
   - Extract the `<path>` or `<g>` elements

3. **Add to icons.svg**:
   - Open `apps/techcloud/techcloud/public/icons/icons.svg`
   - Add a new `<symbol>` entry:
   ```xml
   <symbol id="icon-[name]" viewBox="0 0 24 24">
     <!-- Paste the path/g elements here -->
   </symbol>
   ```

## Converting Individual SVGs to Sprite Format

If you exported individual SVG files, convert them to sprite format:

1. **Open each SVG file**:
   - Look for the `viewBox` attribute (e.g., `viewBox="0 0 24 24"`)
   - Copy the `<path>` or `<g>` content

2. **Add to icons.svg**:
   ```xml
   <symbol id="icon-[name]" viewBox="0 0 24 24">
     <!-- Paste path/g content here -->
   </symbol>
   ```

3. **Example**:
   If you have `icon-dashboard.svg`:
   ```xml
   <!-- Original SVG -->
   <svg viewBox="0 0 24 24">
     <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
   </svg>
   
   <!-- Converted to symbol -->
   <symbol id="icon-dashboard" viewBox="0 0 24 24">
     <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
   </symbol>
   ```

## Icon Naming Best Practices

- Use lowercase with hyphens: `icon-dashboard`, `icon-inventory`
- Be descriptive: `icon-user-profile` not `icon-up`
- Match Figma component names when possible
- Keep names consistent across the theme

## After Exporting

1. **Update icons.svg**:
   - Add all icons to the sprite file
   - Ensure each has a unique `id`

2. **Build Assets**:
   ```bash
   bench build --app techcloud
   bench --site erpnext.local clear-cache
   bench restart
   ```

3. **Use Icons**:
   ```html
   <svg class="icon">
     <use href="#icon-dashboard"></use>
   </svg>
   ```

