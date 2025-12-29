// Techcloud Header Fix
// Ensures proper left/right alignment for navbar
// Keeps Frappe's default navbar brand text/logo

(function() {
    "use strict";

    function fixNavbarHeader() {
        // Ensure navbar container has proper flex layout
        // Only fix layout, don't modify navbar brand text (keep Frappe's default)
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

    // Run when Frappe is ready (to access frappe.boot for logo)
    function runWhenReady() {
        if (typeof frappe !== 'undefined' && frappe.boot) {
            fixNavbarHeader();
        } else if (typeof frappe !== 'undefined') {
            frappe.ready(function() {
                fixNavbarHeader();
            });
        } else {
            // Fallback - run on DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(fixNavbarHeader, 500);
                });
            } else {
                setTimeout(fixNavbarHeader, 500);
            }
        }
    }

    // Try immediately
    runWhenReady();
    
    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runWhenReady);
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

