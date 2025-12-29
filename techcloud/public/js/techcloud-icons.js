// Techcloud Theme - Auto-add icons to navigation
// Automatically adds icons to sidebar navigation items based on their text

(function() {
    "use strict";

    // Icon mapping - maps text content to icon IDs
    const iconMap = {
        'home': 'icon-home',
        'addresses': 'icon-addresses',
        'address': 'icon-addresses',
        'newsletter': 'icon-newsletter',
        'my account': 'icon-account',
        'account': 'icon-account',
        'dashboard': 'icon-dashboard',
        'inventory': 'icon-inventory',
        'customers': 'icon-customers',
        'customer': 'icon-customers',
        'sales': 'icon-sales',
        'reports': 'icon-reports',
        'report': 'icon-reports',
        'settings': 'icon-settings',
        'setting': 'icon-settings',
        'logout': 'icon-logout',
        'log out': 'icon-logout',
        'sign out': 'icon-logout'
    };

    function getIconId(text) {
        if (!text) return null;
        // Remove extra whitespace and normalize
        const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
        for (const [key, iconId] of Object.entries(iconMap)) {
            if (normalized.includes(key)) {
                return iconId;
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
            text = text.replace(/[\uE000-\uF8FF]/g, '').trim();
            // Remove whitespace
            text = text.replace(/\s+/g, ' ').trim();
            
            const iconId = getIconId(text);

            if (iconId) {
                // Create icon SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('class', 'techcloud-icon icon-sm');
                svg.setAttribute('width', '18');
                svg.setAttribute('height', '18');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.style.flexShrink = '0';
                svg.style.display = 'inline-block';
                svg.style.verticalAlign = 'middle';

                const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                use.setAttribute('href', `#${iconId}`);
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconId}`); // xlink:href for older browsers

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
        // Check if icons are already loaded
        const existingIcons = document.querySelector('svg[style*="display: none"] symbol#icon-account');
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
                    document.body.appendChild(iconsContainer);
                }
                // Insert SVG content
                iconsContainer.innerHTML = svgContent;
                console.log('[Techcloud Icons] Icons loaded via fetch');
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

