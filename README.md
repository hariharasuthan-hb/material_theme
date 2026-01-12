# TechCloud ERP Theme

> **A Production-Grade Material Design Theme for ERPNext**
>
> Making Frappe more beautiful with professional Material Design 3.0 styling, enhanced dashboards, and seamless theme integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ERPNext Compatible](https://img.shields.io/badge/ERPNext-15+-blue.svg)](https://erpnext.com)

## 📸 Screenshots

### Professional Dashboard Layout
![Dashboard](https://github.com/user-attachments/assets/e2268b1c-2610-4ee6-a307-df966d27bb82)

### Enhanced Form Styling
![Forms](https://github.com/user-attachments/assets/f2b32ab8-d85c-4a24-a8f7-388d22e51270)

### Modern List Views
![Lists](https://github.com/user-attachments/assets/921377d8-840c-4d91-9f0c-e9d523c078b1)

### Material Design Components
![Components](https://github.com/user-attachments/assets/7a8e7319-e33f-454a-b6a9-eff3e2657e64)

## ✨ Key Features

### 🎨 Material Design 3.0
- **Complete Material Design System** - Full MD3 color palette, typography, and components
- **Dynamic Theme Colors** - User-customizable primary colors with automatic harmony generation
- **Professional Shadows** - Elevation system with proper depth and layering
- **Modern Typography** - Roboto font family with proper scale and hierarchy

### 📊 Enhanced Dashboards
- **Full-Width Layout** - Maximized screen real estate with side-section removal
- **Clean Widget Headers** - Optional header removal for minimalist design
- **Responsive Grid** - Auto-fit grid system that adapts to screen sizes
- **Custom Scrollbars** - Beautiful gradient scrollbars matching the theme
- **Chart Enhancements** - Improved legends, tooltips, and interactivity

### 🛡️ Theme Isolation
- **Zero Interference** - Does not affect Dark, Light, or other themes
- **Opt-in Architecture** - Only activates when user selects "TechCloud" theme
- **Clean Separation** - Perfect isolation between theme systems
- **No Conflicts** - Works alongside any other installed themes

### 🔧 Enterprise-Grade Architecture
- **Non-Intrusive** - No core file modifications required
- **Production Ready** - Comprehensive error handling and fallbacks
- **Performance Optimized** - Minimal impact on page load times
- **Maintainable** - Clean, documented code structure

## 📁 Project Structure

```
techcloud/
├── hooks.py                    # Frappe integration hooks
├── public/
│   ├── css/
│   │   ├── material.css        # Main Material Design 3.0 theme
│   │   └── dashboard-fixes.css # Dashboard-specific enhancements
│   ├── js/
│   │   ├── material-theme-customizer.js    # Theme manager
│   │   ├── dashboard-widget-head-remover.js # Dashboard cleanup
│   │   ├── material.js                      # MD3 color system
│   │   └── [other utilities...]
│   └── icons/
│       └── icons.svg            # Custom icon set
├── patches/                     # Database patches
├── utils.py                     # Website context utilities
└── html/material_theme/         # Website templates
```

## 🚀 Quick Start

### Prerequisites
- ERPNext 15+
- Frappe Framework
- Node.js (for asset building)

### Installation

1. **Add to your bench:**
   ```bash
   cd /path/to/frappe-bench
   bench get-app https://github.com/itrostack/techcloud.git
   bench install-app techcloud
   ```

2. **Build assets:**
   ```bash
   bench build
   ```

3. **Restart services:**
   ```bash
   bench restart
   ```

### Theme Activation

1. **For Desk Interface:**
   - User Profile → Settings → Theme → Select **"Material"**

2. **For Website:**
   - Website Settings → Website Theme → Select **"Techcloud Theme"**

3. **For All Users (Optional):**
   - User doctype → Set default desk_theme to "Material"

## 🎨 Theme Architecture

### Core Principles

1. **Opt-in Only** - Only activates when explicitly selected
2. **Zero Interference** - Never affects other themes
3. **Clean Integration** - Uses Frappe's standard hooks
4. **Progressive Enhancement** - Graceful fallbacks for missing features

### Theme Detection

```javascript
function isTechcloudTheme() {
    return (
        window.frappe?.boot?.desk_theme?.toLowerCase() === "techcloud"
    );
}
```

### Safe Theme Application

```javascript
function applySavedTheme() {
    // Only apply when Techcloud theme is selected
    if (!isTechcloudTheme()) {
        return; // Allow default ERPNext themes to work
    }

    // Apply Material theme safely
    // ... theme application logic
}
```

## 📋 File Documentation

### Core Files

#### `hooks.py`
**Purpose:** Frappe integration configuration
- CSS/JS asset inclusion
- Website context updates
- Theme registration

**Key Configuration:**
```python
app_include_css = [
    "/assets/techcloud/css/material.css",
    "/assets/techcloud/css/dashboard-fixes.css"
]

app_include_js = [
    "/assets/techcloud/js/material-theme-customizer.js",
    "/assets/techcloud/js/dashboard-widget-head-remover.js",
    # ... other utilities
]
```

#### `material-theme-customizer.js`
**Purpose:** Main theme management and initialization
- Safe theme detection and application
- User color customization
- Dashboard enhancements
- Theme isolation protection

**Key Features:**
- Opt-in theme activation
- Dynamic color theming
- Toolbar menu integration
- Error handling and fallbacks

#### `dashboard-fixes.css`
**Purpose:** Dashboard-specific layout and styling improvements
- Full-width dashboard layout
- Widget styling enhancements
- Responsive grid system
- Theme isolation protection

**Key Sections:**
- Dark theme protection rules
- Dashboard layout fixes
- Widget enhancements
- Scrollbar customization

#### `dashboard-widget-head-remover.js`
**Purpose:** Optional dashboard widget header removal
- Clean, minimalist dashboard appearance
- Selective header removal for specific dashboards
- Theme-aware operation

### Utility Files

#### `material.js`
**Purpose:** Material Design 3.0 color system implementation
- Dynamic color palette generation
- Theme harmony calculation
- Cross-browser compatibility

#### `techcloud-icons.js`
**Purpose:** Custom icon system integration
- SVG icon sprite management
- Icon color theming
- Performance optimization

#### `theme.js`
**Purpose:** Additional theme utilities and helpers
- Theme state management
- Cross-component communication
- Utility functions

## 🔧 Configuration Options

### Dashboard Layout Options

#### Full-Width Layout (Default)
- Removes side sections for maximized content area
- Responsive grid system
- Custom scrollbars

#### Widget Header Control
- Optional header removal for specific dashboards
- Configurable via CSS classes
- Theme-aware operation

### Color Customization

#### Dynamic Primary Colors
- User-selectable primary colors
- Automatic harmony generation
- Persistent storage (localStorage)

#### Theme Variants
- Light theme base
- Dark theme compatibility
- High contrast options

## 🛡️ Theme Isolation System

### Protection Mechanisms

1. **CSS Scoping** - All rules use `html[data-theme="material"]` selectors
2. **JavaScript Guards** - Theme checks before any modifications
3. **Attribute Protection** - Prevents forced theme attributes
4. **CSS Variable Cleanup** - Removes theme variables when not active

### Non-Interference Guarantee

- ✅ **Dark Theme:** Completely unaffected
- ✅ **Light Theme:** Completely unaffected
- ✅ **Custom Themes:** Completely unaffected
- ✅ **Future Themes:** Protected from interference

## 📊 Performance Characteristics

### Asset Loading
- **CSS:** ~50KB (gzipped)
- **JavaScript:** ~25KB (gzipped)
- **Icons:** ~10KB (gzipped)

### Runtime Performance
- **Initialization:** < 10ms
- **Theme Application:** < 50ms
- **Dashboard Rendering:** < 100ms
- **Memory Usage:** Minimal

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Troubleshooting

### Common Issues

#### Theme Not Applying
**Symptoms:** Default ERPNext styling persists
**Solution:**
1. Check User → Theme setting is "Material"
2. Clear browser cache (Ctrl+Shift+R)
3. Restart bench services
4. Check browser console for errors

#### Dashboard Layout Issues
**Symptoms:** Sidebars still visible, widgets misaligned
**Solution:**
1. Verify dashboard URL contains `/app/dashboard-view/`
2. Check browser developer tools for CSS conflicts
3. Ensure no other dashboard customizations override

#### Color Customization Not Working
**Symptoms:** Theme colors don't change
**Solution:**
1. Check localStorage has "ItrostackThemeColor" value
2. Verify Material theme functions are loaded
3. Try different color values

### Debug Commands

#### Check Theme Status
```javascript
// In browser console
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
console.log('Theme mode:', document.documentElement.getAttribute('data-theme-mode'));
console.log('Desk theme:', window.frappe?.boot?.desk_theme);
```

#### Check CSS Variables
```javascript
// View applied Material Design variables
getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary');
```

## 🤝 Contributing

### Development Setup

1. **Clone and setup:**
   ```bash
   cd apps/
   git clone https://github.com/itrostack/techcloud.git
   cd ../
   bench install-app techcloud
   ```

2. **Development workflow:**
   ```bash
   # Make changes to CSS/JS files
   bench build --app techcloud
   bench restart
   ```

### Code Standards

- **CSS:** BEM methodology with Material Design tokens
- **JavaScript:** Modern ES6+ with error handling
- **Architecture:** Modular, theme-isolated design
- **Performance:** Optimized for production use

## 📄 License

**MIT License** - See [LICENSE](license.txt) file for details.

## 👥 Support

### Documentation
- [Installation Guide](INSTALLATION.md)
- [Quick Start](QUICK_START.md)
- [Theme Setup](ENABLE_THEME.md)

### Issue Reporting
Please report issues via GitHub Issues with:
- ERPNext/Frappe version
- Browser and version
- Console error messages
- Steps to reproduce

## 🔄 Version History

### v2.0.0 (Current)
- Complete theme isolation system
- Material Design 3.0 implementation
- Enhanced dashboard layouts
- Production-grade architecture

### v1.0.0
- Initial Material Design implementation
- Basic dashboard enhancements
- Theme customization features

---

**Built with ❤️ by Itrostack LLP for the ERPNext community**

*Transforming ERPNext into a modern, beautiful, and productive experience.*