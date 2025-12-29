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
    frappe.ready(function() {
        if (frappe.website && frappe.website.highlight_code_blocks) {
            const originalHighlight = frappe.website.highlight_code_blocks;
            frappe.website.highlight_code_blocks = function() {
                if (window.hljs && window.hljs.highlightAll) {
                    window.hljs.highlightAll();
                } else if (originalHighlight) {
                    originalHighlight();
                }
            };
        }
    });
})();

