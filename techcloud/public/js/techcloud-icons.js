// Techcloud Theme - Auto-add icons to navigation
// Automatically adds icons to sidebar navigation items based on their text

(function() {
    "use strict";

    // Icon mapping - maps text content to icon IDs and colors
    // Each menu item gets a DIFFERENT color matching Figma design
    // Main menu items from Figma: Home, Accounting, Buying, Selling, Stock, Assets, Manufacturing, Quality, Projects, Support, Users, Website, CRM, Tools, ERPNext Settings, Integrations
    const iconMap = {
        // 1. Home / Dashboard - Blue (Home icon for home, Dashboard icon for dashboard)
        'home': { id: 'icon-home', color: 'icon-blue' },
        'dashboard': { id: 'icon-dashboard', color: 'icon-blue' },
        'workspace': { id: 'icon-dashboard', color: 'icon-blue' },
        'workspaces': { id: 'icon-dashboard', color: 'icon-blue' },
        
        // 2. Accounting - Blue (Calculator/Financial icon - matching image)
        'accounting': { id: 'icon-reports', color: 'icon-blue' },
        'account': { id: 'icon-reports', color: 'icon-blue' },
        'accounts': { id: 'icon-reports', color: 'icon-blue' },
        'payment': { id: 'icon-reports', color: 'icon-blue' },
        'payments': { id: 'icon-reports', color: 'icon-blue' },
        'journal': { id: 'icon-reports', color: 'icon-blue' },
        'journal entry': { id: 'icon-reports', color: 'icon-blue' },
        'financial': { id: 'icon-reports', color: 'icon-blue' },
        'finance': { id: 'icon-reports', color: 'icon-blue' },
        
        // 3. Buying / Purchase - Purple (Inventory icon for buying/purchasing)
        'buying': { id: 'icon-inventory', color: 'icon-purple' },
        'purchase': { id: 'icon-inventory', color: 'icon-purple' },
        'purchasing': { id: 'icon-inventory', color: 'icon-purple' },
        'supplier': { id: 'icon-customers', color: 'icon-purple' },
        'suppliers': { id: 'icon-customers', color: 'icon-purple' },
        'purchase order': { id: 'icon-inventory', color: 'icon-purple' },
        'purchase receipt': { id: 'icon-inventory', color: 'icon-purple' },
        
        // 4. Selling / Sales - Gold/Amber (Sales icon for selling - matching image)
        'selling': { id: 'icon-sales', color: 'icon-gold' },
        'sales': { id: 'icon-sales', color: 'icon-gold' },
        'quotation': { id: 'icon-sales', color: 'icon-gold' },
        'quotations': { id: 'icon-sales', color: 'icon-gold' },
        'order': { id: 'icon-sales', color: 'icon-gold' },
        'sales order': { id: 'icon-sales', color: 'icon-gold' },
        'invoice': { id: 'icon-sales', color: 'icon-gold' },
        'invoices': { id: 'icon-sales', color: 'icon-gold' },
        'delivery note': { id: 'icon-sales', color: 'icon-gold' },
        
        // 5. Stock / Inventory - Cyan (Light blue - matching image)
        'stock': { id: 'icon-inventory', color: 'icon-cyan' },
        'warehouse': { id: 'icon-inventory', color: 'icon-cyan' },
        'warehouses': { id: 'icon-inventory', color: 'icon-cyan' },
        'item': { id: 'icon-inventory', color: 'icon-cyan' },
        'items': { id: 'icon-inventory', color: 'icon-cyan' },
        'stock entry': { id: 'icon-inventory', color: 'icon-cyan' },
        'material request': { id: 'icon-inventory', color: 'icon-cyan' },
        'inventory': { id: 'icon-inventory', color: 'icon-cyan' },
        
        // 6. Assets - Amber/Yellow (Apps icon for assets - matching image)
        'assets': { id: 'icon-apps', color: 'icon-amber' },
        'asset': { id: 'icon-apps', color: 'icon-amber' },
        'asset maintenance': { id: 'icon-apps', color: 'icon-amber' },
        
        // 7. Manufacturing - Green (Matching image - green for manufacturing)
        'manufacturing': { id: 'icon-apps', color: 'icon-green' },
        'production': { id: 'icon-apps', color: 'icon-green' },
        'work order': { id: 'icon-apps', color: 'icon-green' },
        'work orders': { id: 'icon-apps', color: 'icon-green' },
        'bom': { id: 'icon-apps', color: 'icon-green' },
        'bill of materials': { id: 'icon-apps', color: 'icon-green' },
        
        // 8. Quality - Green (Settings icon for quality)
        'quality': { id: 'icon-settings', color: 'icon-green' },
        'quality inspection': { id: 'icon-settings', color: 'icon-green' },
        
        // 9. Projects - Cyan (Dashboard icon for projects)
        'projects': { id: 'icon-dashboard', color: 'icon-cyan' },
        'project': { id: 'icon-dashboard', color: 'icon-cyan' },
        'task': { id: 'icon-dashboard', color: 'icon-cyan' },
        'tasks': { id: 'icon-dashboard', color: 'icon-cyan' },
        'timesheet': { id: 'icon-dashboard', color: 'icon-cyan' },
        
        // 10. Support - Orange (Matching image - orange for community/support)
        'support': { id: 'icon-account', color: 'icon-orange' },
        'help': { id: 'icon-account', color: 'icon-orange' },
        'ticket': { id: 'icon-account', color: 'icon-orange' },
        'tickets': { id: 'icon-account', color: 'icon-orange' },
        'community': { id: 'icon-account', color: 'icon-orange' },
        
        // 11. Users / HR - Teal (Matching image - teal for HR)
        'users': { id: 'icon-account', color: 'icon-teal' },
        'user': { id: 'icon-account', color: 'icon-teal' },
        'hr': { id: 'icon-account', color: 'icon-teal' },
        'human resources': { id: 'icon-account', color: 'icon-teal' },
        'employee': { id: 'icon-account', color: 'icon-teal' },
        'employees': { id: 'icon-account', color: 'icon-teal' },
        'attendance': { id: 'icon-account', color: 'icon-teal' },
        'payroll': { id: 'icon-account', color: 'icon-teal' },
        'leave': { id: 'icon-account', color: 'icon-teal' },
        'leave application': { id: 'icon-account', color: 'icon-teal' },
        
        // 12. Website - Red (Apps icon for website)
        'website': { id: 'icon-apps', color: 'icon-red' },
        'web': { id: 'icon-apps', color: 'icon-red' },
        'blog': { id: 'icon-apps', color: 'icon-red' },
        'page': { id: 'icon-apps', color: 'icon-red' },
        'pages': { id: 'icon-apps', color: 'icon-red' },
        
        // 13. CRM - Blue (Matching image - blue for CRM)
        'crm': { id: 'icon-customers', color: 'icon-blue' },
        'lead': { id: 'icon-customers', color: 'icon-blue' },
        'leads': { id: 'icon-customers', color: 'icon-blue' },
        'opportunity': { id: 'icon-customers', color: 'icon-blue' },
        'opportunities': { id: 'icon-customers', color: 'icon-blue' },
        
        // 14. Tools - Gray (Settings icon for tools)
        'tools': { id: 'icon-settings', color: 'icon-gray' },
        'tool': { id: 'icon-settings', color: 'icon-gray' },
        'utilities': { id: 'icon-settings', color: 'icon-gray' },
        
        // 15. ERPNext Settings - Brown (Settings icon)
        'erpnext settings': { id: 'icon-settings', color: 'icon-brown' },
        'erpnext setting': { id: 'icon-settings', color: 'icon-brown' },
        'system settings': { id: 'icon-settings', color: 'icon-brown' },
        
        // 16. Integrations - Orange (Apps icon for integrations)
        'integrations': { id: 'icon-apps', color: 'icon-orange' },
        'integration': { id: 'icon-apps', color: 'icon-orange' },
        'erpnext integrations': { id: 'icon-apps', color: 'icon-orange' },
        'api': { id: 'icon-apps', color: 'icon-orange' },
        
        // Customers & Contacts - Purple (Matching image - purple for user/profile)
        'customers': { id: 'icon-customers', color: 'icon-purple' },
        'customer': { id: 'icon-customers', color: 'icon-purple' },
        'contact': { id: 'icon-account', color: 'icon-purple' },
        'contacts': { id: 'icon-account', color: 'icon-purple' },
        'addresses': { id: 'icon-addresses', color: 'icon-purple' },
        'address': { id: 'icon-addresses', color: 'icon-purple' },
        
        // Reports - Amber/Yellow (Matching image - yellow for documents/notes)
        'reports': { id: 'icon-reports', color: 'icon-amber' },
        'report': { id: 'icon-reports', color: 'icon-amber' },
        'analytics': { id: 'icon-reports', color: 'icon-amber' },
        'document': { id: 'icon-reports', color: 'icon-amber' },
        'documents': { id: 'icon-reports', color: 'icon-amber' },
        'notes': { id: 'icon-reports', color: 'icon-amber' },
        
        // Settings / Tools - Blue (Matching image - blue for tools)
        'settings': { id: 'icon-settings', color: 'icon-blue' },
        'setting': { id: 'icon-settings', color: 'icon-blue' },
        'configuration': { id: 'icon-settings', color: 'icon-blue' },
        'tools': { id: 'icon-settings', color: 'icon-blue' },
        'tool': { id: 'icon-settings', color: 'icon-blue' },
        'utilities': { id: 'icon-settings', color: 'icon-blue' },
        
        // Build - Blue (Settings icon)
        'build': { id: 'icon-settings', color: 'icon-blue' },
        
        // Other common items
        'inventory': { id: 'icon-inventory', color: 'icon-cyan' },
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

    // Map Frappe es-line icons to Figma icons for dropdown items
    const dropdownIconMap = {
        'es-line-edit': 'icon-edit',
        'es-line-copy': 'icon-copy',
        'es-line-duplicate': 'icon-duplicate',
        'es-line-delete': 'icon-delete',
        'es-line-trash': 'icon-delete',
        'es-line-mute': 'icon-mute',
        'es-line-volume-off': 'icon-mute',
        'es-line-more': 'icon-more',
        'es-line-options': 'icon-more',
        'es-line-settings': 'icon-settings',
        'es-line-right': 'icon-right',
        'es-line-arrow-right': 'icon-arrow-right'
    };

    // Replace dropdown item icons with Figma icons
    function replaceDropdownIcons() {
        // Find all dropdown items with Frappe icons
        const dropdownItems = document.querySelectorAll('.dropdown-item, .dropdown-list .dropdown-item, .sidebar-item-control .dropdown-item');
        
        dropdownItems.forEach(item => {
            // Find the icon container
            const iconContainer = item.querySelector('.dropdown-item-icon');
            if (!iconContainer) return;

            // Find the SVG with es-line icon
            const svg = iconContainer.querySelector('svg.es-icon, svg.es-line');
            if (!svg) return;

            // Find the use element with es-line-* href
            const useElement = svg.querySelector('use[href^="#es-line-"]');
            if (!useElement) return;

            // Get the icon ID from href (e.g., "#es-line-edit" -> "es-line-edit")
            const frappeIconId = useElement.getAttribute('href').replace('#', '');
            
            // Map to Figma icon
            const figmaIconId = dropdownIconMap[frappeIconId];
            if (!figmaIconId) return;

            // Check if Figma icon exists
            const figmaIcon = document.querySelector(`#${figmaIconId}, symbol#${figmaIconId}`);
            if (!figmaIcon) return;

            // Get the label text to determine color
            const labelElement = item.querySelector('.dropdown-item-label');
            const labelText = labelElement ? (labelElement.textContent || labelElement.innerText || '').toLowerCase().trim() : '';
            
            // Determine color based on action type
            let iconColor = 'icon-gray'; // Default
            if (labelText.includes('edit') || labelText.includes('update')) {
                iconColor = 'icon-blue';
            } else if (labelText.includes('delete') || labelText.includes('remove') || labelText.includes('trash')) {
                iconColor = 'icon-red';
            } else if (labelText.includes('copy') || labelText.includes('duplicate')) {
                iconColor = 'icon-purple';
            } else if (labelText.includes('mute') || labelText.includes('unmute')) {
                iconColor = 'icon-orange';
            }

            // Replace the use element href
            useElement.setAttribute('href', `#${figmaIconId}`);
            useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${figmaIconId}`);

            // Update SVG classes
            svg.classList.remove('es-icon', 'es-line');
            svg.classList.add('techcloud-icon', 'icon-sm', iconColor);
            
            // Ensure SVG has proper attributes
            if (!svg.hasAttribute('width')) svg.setAttribute('width', '20');
            if (!svg.hasAttribute('height')) svg.setAttribute('height', '20');
            if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 24 24');
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
                setTimeout(function() {
                    addIconsToSidebar();
                    replaceDropdownIcons();
                }, 100);
            })
            .catch(error => {
                console.warn('[Techcloud Icons] Could not load icons.svg:', error);
            });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ensureIconsLoaded();
            setTimeout(function() {
                addIconsToSidebar();
                replaceDropdownIcons();
            }, 200);
        });
    } else {
        ensureIconsLoaded();
        setTimeout(function() {
            addIconsToSidebar();
            replaceDropdownIcons();
        }, 200);
    }

    // Also run when Frappe is ready (for dynamic content)
    function runWhenFrappeReady() {
        ensureIconsLoaded();
        setTimeout(function() {
            addIconsToSidebar();
            replaceDropdownIcons();
        }, 300);
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
    // Watch for dynamically added dropdown items
    const dropdownObserver = new MutationObserver(function(mutations) {
        let shouldReplace = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // Check if dropdown items were added
                    if (node.classList && (node.classList.contains('dropdown-item') || node.classList.contains('dropdown-list'))) {
                        shouldReplace = true;
                    } else if (node.querySelector && node.querySelector('.dropdown-item, .dropdown-list')) {
                        shouldReplace = true;
                    }
                }
            });
        });
        if (shouldReplace) {
            setTimeout(replaceDropdownIcons, 50);
        }
    });

    // Observe document body for dropdown changes
    if (document.body) {
        dropdownObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.body) {
                dropdownObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

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

