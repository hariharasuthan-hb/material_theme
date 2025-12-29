# Techcloud Theme Icons

This folder contains SVG icons for the Techcloud ERP theme.

## How to Export Icons from Figma

1. **Open the Figma Design**: https://www.figma.com/design/HeNnCfW6Q7EQ9u0z0bkZKF/ERP-Amax?node-id=0-1&p=f

2. **Select Icons to Export**:
   - Select the icon frame/component in Figma
   - In the right sidebar, go to the "Export" section
   - Choose "SVG" format
   - Click "Export [icon-name]"

3. **Export All Icons**:
   - For multiple icons, select all icon frames
   - Use "Export" → "SVG" for each, or
   - Use Figma plugins like "SVG Export" to batch export

4. **Save Individual Icons**:
   - Save each icon as `icon-[name].svg` in this folder
   - Example: `icon-dashboard.svg`, `icon-inventory.svg`, etc.

5. **Create SVG Sprite** (Recommended):
   - Combine all icons into a single `icons.svg` file
   - Use the format shown in `icons.svg` template
   - Each icon should have a unique `id` attribute

## Icon Naming Convention

- Use lowercase with hyphens: `icon-dashboard`, `icon-inventory`
- Keep names descriptive and consistent
- Match the icon names used in the Figma design

## Usage in Theme

Icons are included via the `app_include_icons` hook in `hooks.py`:

```python
app_include_icons = "techcloud/public/icons/icons.svg"
```

Then use icons in HTML/JSX:

```html
<svg class="icon">
  <use href="#icon-dashboard"></use>
</svg>
```

Or in JavaScript:

```javascript
const icon = `<svg class="icon"><use href="#icon-dashboard"></use></svg>`;
```

