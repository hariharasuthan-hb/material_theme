// Techcloud Theme - Auto-add icons to navigation
// Automatically adds icons to sidebar navigation items based on their text

(function() {
    "use strict";

    // Icon mapping - maps text content to icon IDs and colors
    const iconMap = {
        'home': { id: 'icon-home', color: 'icon-blue' },
        'addresses': { id: 'icon-addresses', color: 'icon-brown' },
        'address': { id: 'icon-addresses', color: 'icon-brown' },
        'newsletter': { id: 'icon-newsletter', color: 'icon-gray' },
        'my account': { id: 'icon-account', color: 'icon-blue' },
        'account': { id: 'icon-account', color: 'icon-blue' },
        'dashboard': { id: 'icon-dashboard', color: 'icon-blue' },
        'inventory': { id: 'icon-inventory', color: 'icon-brown' },
        'customers': { id: 'icon-customers', color: 'icon-blue' },
        'customer': { id: 'icon-customers', color: 'icon-blue' },
        'sales': { id: 'icon-sales', color: 'icon-gold' },
        'reports': { id: 'icon-reports', color: 'icon-gray' },
        'report': { id: 'icon-reports', color: 'icon-gray' },
        'settings': { id: 'icon-settings', color: 'icon-gray' },
        'setting': { id: 'icon-settings', color: 'icon-gray' },
        'logout': { id: 'icon-logout', color: 'icon-brown' },
        'log out': { id: 'icon-logout', color: 'icon-brown' },
        'sign out': { id: 'icon-logout', color: 'icon-brown' }
    };

    function getIconInfo(text) {
        if (!text) return null;
        // Remove extra whitespace and normalize
        const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
        for (const [key, iconInfo] of Object.entries(iconMap)) {
            if (normalized.includes(key)) {
                return iconInfo;
            }
        }
        return null;
    }

    function addIconsToSidebar() {
        // Find all sidebar links
        const sidebarLinks = document.querySelectorAll(
            '.web-sidebar a, .sidebar-column a, .sidebar-item a, .standard-sidebar-item, .list-group a, .sidebar-items a'
        );

        sidebarLinks.forEach(link => {
            // Skip if already has icon (check for both techcloud-icon and existing Frappe icons)
            if (link.querySelector('svg.techcloud-icon, svg.icon')) {
                return;
            }

            // Get text content, removing icon if it exists
            let text = link.textContent || link.innerText || '';
            // Remove any existing SVG icons from text
            const cleanText = text.replace(/[\uE000-\uF8FF]/g, '').trim().replace(/\s+/g, ' ');
            
            const iconInfo = getIconInfo(cleanText);

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
                svg.setAttribute('width', '18');
                svg.setAttribute('height', '18');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.style.flexShrink = '0';
                svg.style.display = 'inline-block';
                svg.style.verticalAlign = 'middle';
                svg.style.color = 'inherit';
                svg.style.overflow = 'visible';

                const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                use.setAttribute('href', `#${iconInfo.id}`);
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconInfo.id}`); // xlink:href for older browsers

                svg.appendChild(use);

                // Insert icon at the beginning
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

        // Try to load icons.svg
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
    if (typeof frappe !== 'undefined') {
        frappe.ready(function() {
            ensureIconsLoaded();
            setTimeout(addIconsToSidebar, 300);
        });
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

