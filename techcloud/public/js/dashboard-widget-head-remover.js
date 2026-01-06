// ============================================
// DASHBOARD WIDGET HEAD REMOVER
// Removes widget-group-head elements from dashboard pages
// ============================================

frappe.provide("techcloud.dashboard");

(function() {
    "use strict";

    // Function to remove widget-group-head elements
    function removeWidgetGroupHeads() {
        // Only run on dashboard pages
        if (!window.location.pathname.includes('/app/dashboard-view/')) {
            return;
        }

        // Only run on TechCloud/Material theme
        const themeMode = document.documentElement.getAttribute("data-theme-mode");
        const theme = document.documentElement.getAttribute("data-theme");
        const isMaterialTheme = themeMode === "material" || theme === "material";

        if (!isMaterialTheme) {
            return; // Exit if not using Material theme
        }

        // Remove all widget-group-head elements
        $('.widget-group-head').remove();
        $('.widget-group .widget-group-head').remove();
        $('div.widget-group-head').remove();

        console.log('Techcloud Dashboard: Removed widget-group-head elements for clean layout');
    }

    // Remove immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeWidgetGroupHeads);
    } else {
        removeWidgetGroupHeads();
    }

    // Also remove when frappe is ready (for dynamic content)
    if (window.frappe) {
        // Use frappe's boot event if available
        if (frappe.boot) {
            removeWidgetGroupHeads();
        } else {
            // Fallback: wait for frappe to be fully initialized
            $(document).on('frappe-ready', function() {
                removeWidgetGroupHeads();
            });
        }
    }

    // Remove on page changes (for single-page app navigation)
    $(document).on('page-change', function() {
        setTimeout(removeWidgetGroupHeads, 100);
    });

    // MutationObserver to watch for dynamically added widget-group-head elements
    const observer = new MutationObserver(function(mutations) {
        let hasWidgetGroupHead = false;

        for (let mutation of mutations) {
            if (mutation.addedNodes) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (
                        node.matches('.widget-group-head') ||
                        node.querySelector('.widget-group-head')
                    )) {
                        hasWidgetGroupHead = true;
                        break;
                    }
                }
            }
            if (hasWidgetGroupHead) break;
        }

        if (hasWidgetGroupHead && window.location.pathname.includes('/app/dashboard-view/')) {
            setTimeout(removeWidgetGroupHeads, 50);
        }
    });

    // Start observing when on dashboard pages
    if (window.location.pathname.includes('/app/dashboard-view/')) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Re-observe when navigating to dashboard pages
    $(document).on('page-change', function() {
        if (window.location.pathname.includes('/app/dashboard-view/')) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });

    // Expose function globally for debugging
    window.techcloud = window.techcloud || {};
    window.techcloud.dashboard = window.techcloud.dashboard || {};
    window.techcloud.dashboard.removeWidgetGroupHeads = removeWidgetGroupHeads;

})();
