// Techcloud Header Fix
// Fixes navbar brand to show logo and hide "LOGIN" text
// Ensures proper left/right alignment

(function() {
    "use strict";

    function fixNavbarHeader() {
        // Find navbar brand
        const navbarBrand = document.querySelector('.navbar-brand');
        if (!navbarBrand) return;

        // Get text content
        const brandText = navbarBrand.textContent || navbarBrand.innerText || '';
        const cleanText = brandText.trim().toUpperCase();

        // Hide if text is "LOGIN" or "HOME" (placeholder text)
        if (cleanText === 'LOGIN' || cleanText === 'HOME') {
            // Check if there's an image or logo
            const hasImage = navbarBrand.querySelector('img') || navbarBrand.querySelector('.app-logo');
            
            if (!hasImage) {
                // If no logo image, replace text with "techcloud"
                navbarBrand.textContent = 'techcloud';
                navbarBrand.style.fontSize = '24px';
                navbarBrand.style.fontWeight = '700';
                navbarBrand.style.color = '#0089FF';
                navbarBrand.style.letterSpacing = '-0.5px';
            } else {
                // If there's a logo, hide the text
                const textNodes = Array.from(navbarBrand.childNodes).filter(node => 
                    node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                );
                textNodes.forEach(node => {
                    if (node.textContent.trim().toUpperCase() === 'LOGIN' || 
                        node.textContent.trim().toUpperCase() === 'HOME') {
                        node.remove();
                    }
                });
            }
        }

        // Ensure navbar container has proper flex layout
        const navbar = document.querySelector('.navbar');
        const container = navbar?.querySelector('.container');
        
        if (container) {
            // Ensure brand is on left
            const brand = container.querySelector('.navbar-brand');
            if (brand) {
                brand.style.marginRight = 'auto';
                brand.style.flexShrink = '0';
            }

            // Ensure nav items are on right
            const nav = container.querySelector('.navbar-nav') || container.querySelector('.navbar-collapse');
            if (nav) {
                nav.style.marginLeft = 'auto';
                nav.style.display = 'flex';
                nav.style.alignItems = 'center';
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixNavbarHeader);
    } else {
        fixNavbarHeader();
    }

    // Also run when Frappe is ready (for dynamic content)
    if (typeof frappe !== 'undefined') {
        frappe.ready(function() {
            fixNavbarHeader();
        });
    }

    // Watch for navbar changes
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.classList.contains('navbar') ||
                        node.classList.contains('navbar-brand') ||
                        node.querySelector('.navbar, .navbar-brand')
                    )) {
                        shouldFix = true;
                    }
                });
            }
        });
        if (shouldFix) {
            setTimeout(fixNavbarHeader, 100);
        }
    });

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

