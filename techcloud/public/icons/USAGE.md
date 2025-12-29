# Using Techcloud Icons

## Quick Start

1. **Export icons from Figma** (see `EXPORT_FROM_FIGMA.md`)
2. **Convert to sprite** (if using individual files):
   ```bash
   cd apps/techcloud/techcloud/public/icons
   python3 convert-to-sprite.py
   ```
3. **Build assets**:
   ```bash
   bench build --app techcloud
   bench --site erpnext.local clear-cache
   bench restart
   ```

## Using Icons in HTML

```html
<!-- Basic usage -->
<svg class="techcloud-icon">
  <use href="#icon-dashboard"></use>
</svg>

<!-- With size -->
<svg class="techcloud-icon icon-lg">
  <use href="#icon-inventory"></use>
</svg>

<!-- With color -->
<svg class="techcloud-icon icon-primary">
  <use href="#icon-customers"></use>
</svg>

<!-- Combined -->
<svg class="techcloud-icon icon-lg icon-primary">
  <use href="#icon-sales"></use>
</svg>
```

## Using Icons in JavaScript

```javascript
// Create icon element
function createIcon(iconName, size = 'md', color = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `techcloud-icon icon-${size} ${color ? 'icon-' + color : ''}`);
  
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${iconName}`);
  
  svg.appendChild(use);
  return svg;
}

// Usage
const dashboardIcon = createIcon('icon-dashboard', 'lg', 'primary');
document.body.appendChild(dashboardIcon);
```

## Using Icons in Frappe Templates

```html
<!-- In Jinja templates -->
<svg class="techcloud-icon">
  <use href="#icon-{{ icon_name }}"></use>
</svg>
```

## Icon Sizes

- `icon-xs`: 12px × 12px
- `icon-sm`: 16px × 16px
- `icon-md`: 20px × 20px (default)
- `icon-lg`: 24px × 24px
- `icon-xl`: 32px × 32px

## Icon Colors

- `icon-primary`: Techcloud blue (#0089FF)
- `icon-secondary`: Gray text color
- `icon-white`: White
- Default: Uses current text color

## Example: Sidebar Navigation

```html
<nav>
  <a href="/dashboard">
    <svg class="techcloud-icon icon-md">
      <use href="#icon-dashboard"></use>
    </svg>
    <span>Dashboard</span>
  </a>
  <a href="/inventory">
    <svg class="techcloud-icon icon-md">
      <use href="#icon-inventory"></use>
    </svg>
    <span>Inventory</span>
  </a>
</nav>
```

## Example: Button with Icon

```html
<button class="btn btn-primary">
  <svg class="techcloud-icon icon-sm">
    <use href="#icon-add"></use>
  </svg>
  Add New
</button>
```

## Troubleshooting

**Icons not showing?**
1. Check that `icons.svg` is included in `hooks.py`:
   ```python
   app_include_icons = "techcloud/public/icons/icons.svg"
   ```
2. Verify the icon ID exists in `icons.svg`
3. Rebuild assets: `bench build --app techcloud`
4. Clear cache: `bench --site erpnext.local clear-cache`

**Icon ID not found?**
- Make sure the icon ID in `icons.svg` matches what you're using
- Icon IDs should be like: `icon-dashboard`, `icon-inventory`
- Check for typos in the ID

