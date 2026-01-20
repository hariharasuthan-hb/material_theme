// Techcloud Unified Header
// Ensures the page header container lives inside .layout-main-section

(function() {
    "use strict";

    function normalizePageHeadPosition(pageHead) {
        try {
            const pos = window.getComputedStyle(pageHead).position;
            if (pos === "fixed" || pos === "absolute") {
                pageHead.style.position = "relative";
                pageHead.style.top = "auto";
                pageHead.style.left = "auto";
                pageHead.style.right = "auto";
                pageHead.style.zIndex = "1";
            }
        } catch (e) {
            // ignore
        }
    }

    // Desk header is now fully controlled by techcloud/public/js/desk.js.
    // This file is kept as a safe no-op so it doesn't fight with the new unified header.
    function movePageHeadIntoMain() {
        return true;
    }

    function initUnifiedHeader() {
        if (typeof frappe === "undefined" || !frappe.boot) {
            setTimeout(initUnifiedHeader, 100);
            return;
        }

        if (movePageHeadIntoMain()) return;
        setTimeout(initUnifiedHeader, 100);
    }

    // We intentionally do NOT hook into any lifecycle events here anymore,
    // to avoid double-moving .page-head. techcloud/public/js/desk.js owns that logic.
})();


