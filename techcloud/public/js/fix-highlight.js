// Fix highlight.js deprecation warning
// Override Frappe's deprecated initHighlighting() with highlightAll()
(function() {
    "use strict";
    
    // Wait for highlight.js to be available
    if (typeof window.hljs !== 'undefined') {
        // Override the deprecated method
        if (window.hljs.initHighlighting && !window.hljs._fixed) {
            window.hljs.initHighlighting = function() {
                if (window.hljs.highlightAll) {
                    window.hljs.highlightAll();
                }
            };
            window.hljs._fixed = true;
        }
    }
    
    // Also patch frappe.website.highlight_code_blocks if it exists
    // Check if frappe.ready exists before using it
    function patchFrappeHighlight() {
        if (typeof frappe !== 'undefined' && frappe.website && frappe.website.highlight_code_blocks) {
            const originalHighlight = frappe.website.highlight_code_blocks;
            frappe.website.highlight_code_blocks = function() {
                if (window.hljs && window.hljs.highlightAll) {
                    window.hljs.highlightAll();
                } else if (originalHighlight) {
                    originalHighlight();
                }
            };
        }
    }
    
    // Try to run when frappe is ready, or immediately if frappe is already available
    if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
        frappe.ready(patchFrappeHighlight);
    } else if (typeof frappe !== 'undefined') {
        // Frappe exists but ready is not available yet, wait for it
        setTimeout(function() {
            if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
                frappe.ready(patchFrappeHighlight);
            } else {
                patchFrappeHighlight();
            }
        }, 100);
    } else {
        // Frappe not loaded yet, wait for DOM and then frappe
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
                        frappe.ready(patchFrappeHighlight);
                    } else {
                        patchFrappeHighlight();
                    }
                }, 500);
            });
        } else {
            setTimeout(function() {
                if (typeof frappe !== 'undefined' && typeof frappe.ready === 'function') {
                    frappe.ready(patchFrappeHighlight);
                } else {
                    patchFrappeHighlight();
                }
            }, 500);
        }
    }
})();

