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

    function movePageHeadIntoMain() {
        // Only run on desk pages (not website pages)
        if (!document.body.hasAttribute("data-route")) {
            return true;
        }

        const mainSection = document.querySelector(".layout-main-section");
        if (!mainSection) return false;

        const pageHead = document.querySelector(".page-head");
        if (!pageHead) return false;

        if (pageHead.parentElement !== mainSection) {
            mainSection.prepend(pageHead);
        }

        normalizePageHeadPosition(pageHead);

        const titleElement = pageHead.querySelector(".title-text");
        if (titleElement) {
            const titleText = titleElement.textContent || titleElement.innerText || "";
            console.log("[Techcloud] page-head title-text:", titleText);
        }

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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUnifiedHeader);
    } else {
        initUnifiedHeader();
    }

    if (typeof frappe !== "undefined" && frappe.ready) {
        frappe.ready(initUnifiedHeader);
    }

    if (window.jQuery) {
        $(document).on("page-change", function() {
            initUnifiedHeader();
        });
    }
})();


