// Techcloud Theme - Auto-add icons to navigation
// Automatically adds icons to sidebar navigation items based on their text

(function() {
    "use strict";

    // Icon mapping - maps text content to icon IDs and colors
    // Each menu item gets a DIFFERENT color matching Figma design
    // Main menu items from Figma: Home, Accounting, Buying, Selling, Stock, Assets, Manufacturing, Quality, Projects, Support, Users, Website, CRM, Tools, ERPNext Settings, Integrations
    const iconMap = {
        // 1. Home - Blue
        'home': { id: 'icon-home', color: 'icon-blue' },
        'dashboard': { id: 'icon-dashboard', color: 'icon-blue' },
        
        // 2. Accounting - Brown
        'accounting': { id: 'icon-reports', color: 'icon-brown' },
        'account': { id: 'icon-account', color: 'icon-brown' },
        'payment': { id: 'icon-reports', color: 'icon-brown' },
        'journal': { id: 'icon-reports', color: 'icon-brown' },
        
        // 3. Buying - Purple
        'buying': { id: 'icon-inventory', color: 'icon-purple' },
        'purchase': { id: 'icon-inventory', color: 'icon-purple' },
        'supplier': { id: 'icon-customers', color: 'icon-purple' },
        
        // 4. Selling - Gold
        'selling': { id: 'icon-sales', color: 'icon-gold' },
        'sales': { id: 'icon-sales', color: 'icon-gold' },
        'quotation': { id: 'icon-sales', color: 'icon-gold' },
        'order': { id: 'icon-sales', color: 'icon-gold' },
        'invoice': { id: 'icon-sales', color: 'icon-gold' },
        
        // 5. Stock - Indigo
        'stock': { id: 'icon-inventory', color: 'icon-indigo' },
        'warehouse': { id: 'icon-inventory', color: 'icon-indigo' },
        'item': { id: 'icon-inventory', color: 'icon-indigo' },
        
        // 6. Assets - Amber
        'assets': { id: 'icon-apps', color: 'icon-amber' },
        'asset': { id: 'icon-apps', color: 'icon-amber' },
        
        // 7. Manufacturing - Orange
        'manufacturing': { id: 'icon-apps', color: 'icon-orange' },
        'production': { id: 'icon-apps', color: 'icon-orange' },
        'work order': { id: 'icon-apps', color: 'icon-orange' },
        
        // 8. Quality - Green
        'quality': { id: 'icon-settings', color: 'icon-green' },
        
        // 9. Projects - Cyan
        'projects': { id: 'icon-dashboard', color: 'icon-cyan' },
        'project': { id: 'icon-dashboard', color: 'icon-cyan' },
        'task': { id: 'icon-dashboard', color: 'icon-cyan' },
        
        // 10. Support - Pink
        'support': { id: 'icon-account', color: 'icon-pink' },
        
        // 11. Users - Lime
        'users': { id: 'icon-account', color: 'icon-lime' },
        'user': { id: 'icon-account', color: 'icon-lime' },
        
        // 12. Website - Red
        'website': { id: 'icon-apps', color: 'icon-red' },
        
        // 13. CRM - Teal
        'crm': { id: 'icon-customers', color: 'icon-teal' },
        
        // 14. Tools - Gray
        'tools': { id: 'icon-settings', color: 'icon-gray' },
        'tool': { id: 'icon-settings', color: 'icon-gray' },
        
        // 15. ERPNext Settings - Brown (different from Accounting brown, but acceptable)
        'erpnext settings': { id: 'icon-settings', color: 'icon-brown' },
        'erpnext setting': { id: 'icon-settings', color: 'icon-brown' },
        
        // 16. Integrations - Orange (different from Manufacturing orange, but acceptable)
        'integrations': { id: 'icon-apps', color: 'icon-orange' },
        'integration': { id: 'icon-apps', color: 'icon-orange' },
        'erpnext integrations': { id: 'icon-apps', color: 'icon-orange' },
        
        // HR - Unique color (Green - same as Quality, but different from others)
        'hr': { id: 'icon-account', color: 'icon-green' },
        'human resources': { id: 'icon-account', color: 'icon-green' },
        'employee': { id: 'icon-account', color: 'icon-green' },
        'attendance': { id: 'icon-account', color: 'icon-green' },
        'payroll': { id: 'icon-account', color: 'icon-green' },
        
        // Customers & Contacts - Unique color (Blue - same as Home)
        'customers': { id: 'icon-customers', color: 'icon-blue' },
        'customer': { id: 'icon-customers', color: 'icon-blue' },
        'contact': { id: 'icon-account', color: 'icon-blue' },
        'addresses': { id: 'icon-addresses', color: 'icon-brown' },
        'address': { id: 'icon-addresses', color: 'icon-brown' },
        
        // Reports - Unique color (Gray - same as Tools)
        'reports': { id: 'icon-reports', color: 'icon-gray' },
        'report': { id: 'icon-reports', color: 'icon-gray' },
        
        // Settings - Unique color (Gray - same as Tools and Reports)
        'settings': { id: 'icon-settings', color: 'icon-gray' },
        'setting': { id: 'icon-settings', color: 'icon-gray' },
        
        // Build - Unique color (Gray - same as Tools, Reports, Settings)
        'build': { id: 'icon-settings', color: 'icon-gray' },
        
        // Other
        'inventory': { id: 'icon-inventory', color: 'icon-brown' },
        'newsletter': { id: 'icon-newsletter', color: 'icon-gray' },
        'my account': { id: 'icon-account', color: 'icon-blue' },
        'logout': { id: 'icon-logout', color: 'icon-brown' },
        'log out': { id: 'icon-logout', color: 'icon-brown' },
        'sign out': { id: 'icon-logout', color: 'icon-brown' }
    };
    
    // Color palette for fallback (when menu item doesn't match iconMap)
    // Expanded palette with more colors for distinct menu items
    const colorPalette = [
        'icon-blue', 
        'icon-purple', 
        'icon-gold', 
        'icon-green', 
        'icon-brown', 
        'icon-gray',
        'icon-red',
        'icon-orange',
        'icon-teal',
        'icon-cyan',
        'icon-pink',
        'icon-indigo',
        'icon-lime',
        'icon-amber'
    ];
    
    // Track menu items to assign consistent colors
    const menuItemIndex = new Map();
    let menuItemCounter = 0;
    
    function getIconInfo(text, linkElement) {
        if (!text) return null;
        // Remove extra whitespace and normalize
        const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
        
        // First, try to find exact match in iconMap
        for (const [key, iconInfo] of Object.entries(iconMap)) {
            if (normalized.includes(key)) {
                return iconInfo;
            }
        }
        
        // If no match found, assign a color based on menu item index
        // This ensures each menu item gets a different color
        if (linkElement) {
            const linkId = linkElement.getAttribute('href') || linkElement.textContent || '';
            if (!menuItemIndex.has(linkId)) {
                menuItemIndex.set(linkId, menuItemCounter++);
            }
            const index = menuItemIndex.get(linkId);
            const color = colorPalette[index % colorPalette.length];
            
            // Use a default icon (dashboard) with assigned color
            return { id: 'icon-dashboard', color: color };
        }
        
        return null;
    }

    function addIconsToSidebar() {
        // Find all sidebar links - including desk sidebar items
        // For desk pages: .standard-sidebar-item .item-anchor
        // For website pages: .web-sidebar a, .sidebar-item a, etc.
        const sidebarLinks = document.querySelectorAll(
            '.web-sidebar a, .sidebar-column a, .sidebar-item a, .standard-sidebar-item .item-anchor, .desk-sidebar .standard-sidebar-item .item-anchor, .list-group a, .sidebar-items a'
        );

        sidebarLinks.forEach(link => {
            // Skip if already has icon (check for both techcloud-icon and existing Frappe icons)
            if (link.querySelector('svg.techcloud-icon, svg.icon')) {
                return;
            }

            // Get text content, removing icon if it exists
            // For desk pages, get text from .sidebar-item-label if it exists
            let text = '';
            const labelElement = link.querySelector('.sidebar-item-label');
            if (labelElement) {
                text = labelElement.textContent || labelElement.innerText || '';
            } else {
                text = link.textContent || link.innerText || '';
            }
            // Remove any existing SVG icons from text
            const cleanText = text.replace(/[\uE000-\uF8FF]/g, '').trim().replace(/\s+/g, ' ');
            
            const iconInfo = getIconInfo(cleanText, link);

            if (iconInfo) {
                // Check if icon symbol exists in DOM (icons must be loaded first)
                const iconSymbol = document.querySelector(`#${iconInfo.id}, symbol#${iconInfo.id}`);
                if (!iconSymbol) {
                    // Icon not loaded yet, will retry later
                    return;
                }

                // Create icon SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', `techcloud-icon icon-sm ${iconInfo.color}`);
                svg.setAttribute('width', '20');
                svg.setAttribute('height', '20');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.style.flexShrink = '0';
                svg.style.display = 'inline-block';
                svg.style.verticalAlign = 'middle';
                svg.style.color = 'inherit';
                svg.style.overflow = 'visible';
                svg.style.order = '-1'; // Place icon before text
                svg.style.marginRight = '12px'; // Add spacing

                const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                use.setAttribute('href', `#${iconInfo.id}`);
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconInfo.id}`); // xlink:href for older browsers

                svg.appendChild(use);

                // Insert icon at the beginning of the link
                // For desk pages, insert before the first child (which might be .sidebar-item-label)
                link.insertBefore(svg, link.firstChild);

                // Ensure link uses flex layout
                const computedStyle = window.getComputedStyle(link);
                if (computedStyle.display === 'block' || !computedStyle.display || computedStyle.display === '') {
                    link.style.display = 'flex';
                    link.style.alignItems = 'center';
                    link.style.gap = '12px';
                }
            }
        });

        // Handle existing sidebar-item-icon SVGs (already in DOM from Frappe)
        // These are in .sidebar-item-icon > svg structure
        const existingSidebarIcons = document.querySelectorAll('.sidebar-item-icon svg, .desk-sidebar .sidebar-item-icon svg, .layout-side-section .sidebar-item-icon svg');
        existingSidebarIcons.forEach(svg => {
            // Skip if already has color class applied
            if (svg.classList.contains('icon-blue') || svg.classList.contains('icon-brown') || 
                svg.classList.contains('icon-purple') || svg.classList.contains('icon-gold') ||
                svg.classList.contains('icon-green') || svg.classList.contains('icon-red') ||
                svg.classList.contains('icon-orange') || svg.classList.contains('icon-teal') ||
                svg.classList.contains('icon-cyan') || svg.classList.contains('icon-pink') ||
                svg.classList.contains('icon-indigo') || svg.classList.contains('icon-lime') ||
                svg.classList.contains('icon-amber') || svg.classList.contains('icon-gray')) {
                return;
            }

            // Find the parent standard-sidebar-item to get menu text
            const sidebarItem = svg.closest('.standard-sidebar-item');
            if (!sidebarItem) return;

            // Get menu item text from .sidebar-item-label
            const labelElement = sidebarItem.querySelector('.sidebar-item-label');
            let menuText = '';
            if (labelElement) {
                menuText = labelElement.textContent || labelElement.innerText || '';
            } else {
                // Fallback: get text from the item-anchor
                const anchor = sidebarItem.querySelector('.item-anchor');
                if (anchor) {
                    menuText = anchor.textContent || anchor.innerText || '';
                }
            }

            // Clean the text
            const cleanText = menuText.replace(/[\uE000-\uF8FF]/g, '').trim().replace(/\s+/g, ' ');

            // Get icon info based on menu text
            const iconInfo = getIconInfo(cleanText, sidebarItem);

            if (iconInfo && iconInfo.color) {
                // Add techcloud-icon class if not present
                if (!svg.classList.contains('techcloud-icon')) {
                    svg.classList.add('techcloud-icon');
                }
                // Add color class
                svg.classList.add(iconInfo.color);
            }
        });

        // Also ensure existing icons in templates (like me.html) use techcloud-icon class
        const existingIcons = document.querySelectorAll('svg.icon:not(.techcloud-icon)');
        existingIcons.forEach(icon => {
            if (icon.querySelector('use[href*="#icon-"]')) {
                icon.classList.add('techcloud-icon');
            }
        });
    }

    // Load icons.svg if not already in DOM (for website pages)
    function ensureIconsLoaded() {
        // Check if icons are already loaded (check for any icon symbol)
        const existingIcons = document.querySelector('svg[style*="display: none"] symbol#icon-account, symbol#icon-account, #icon-account');
        if (existingIcons) {
            return; // Icons already loaded
        }

        // Try to load icons.svg (correct path without 'public' in assets)
        const iconsPath = '/assets/techcloud/icons/icons.svg';
        fetch(iconsPath)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Icons file not found');
            })
            .then(svgContent => {
                // Create a hidden container for icons if it doesn't exist
                let iconsContainer = document.getElementById('techcloud-icons-container');
                if (!iconsContainer) {
                    iconsContainer = document.createElement('div');
                    iconsContainer.id = 'techcloud-icons-container';
                    iconsContainer.style.display = 'none';
                    iconsContainer.setAttribute('aria-hidden', 'true');
                    document.body.appendChild(iconsContainer);
                }
                // Insert SVG content
                iconsContainer.innerHTML = svgContent;
                // Trigger icon addition after icons are loaded
                setTimeout(addIconsToSidebar, 100);
            })
            .catch(error => {
                console.warn('[Techcloud Icons] Could not load icons.svg:', error);
            });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ensureIconsLoaded();
            setTimeout(addIconsToSidebar, 200);
        });
    } else {
        ensureIconsLoaded();
        setTimeout(addIconsToSidebar, 200);
    }

    // Also run when Frappe is ready (for dynamic content)
    function runWhenFrappeReady() {
        ensureIconsLoaded();
        setTimeout(addIconsToSidebar, 300);
    }
    
    if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
        frappe.ready(runWhenFrappeReady);
    } else if (typeof frappe !== 'undefined') {
        // Frappe exists but ready is not available yet, wait for it
        setTimeout(function() {
            if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
                frappe.ready(runWhenFrappeReady);
            } else {
                runWhenFrappeReady();
            }
        }, 100);
    }

    // Watch for dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.classList.contains('sidebar-item') ||
                        node.classList.contains('web-sidebar') ||
                        node.querySelector('.sidebar-item, .web-sidebar')
                    )) {
                        shouldUpdate = true;
                    }
                });
            }
        });
        if (shouldUpdate) {
            setTimeout(addIconsToSidebar, 100);
        }
    });

    // Start observing
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

})();

