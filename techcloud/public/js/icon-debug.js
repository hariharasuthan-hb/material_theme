// Debug helper to check if icons are loaded properly
// Run this in browser console: window.checkTechcloudIcons()

(function() {
    "use strict";
    
    window.checkTechcloudIcons = function() {
        console.log("=== Techcloud Icons Debug ===");
        
        // Check if icons.svg is loaded
        const iconSymbols = document.querySelectorAll('svg[style*="display: none"] symbol');
        console.log(`✓ Found ${iconSymbols.length} icon symbols in DOM`);
        
        if (iconSymbols.length === 0) {
            console.error("❌ No icons found! Check if icons.svg is loaded via app_include_icons hook.");
            return;
        }
        
        // List all available icons
        const iconIds = [];
        iconSymbols.forEach(symbol => {
            const id = symbol.getAttribute('id');
            if (id) iconIds.push(id);
        });
        console.log("Available icons:", iconIds);
        
        // Check sidebar links
        const sidebarLinks = document.querySelectorAll('.web-sidebar a, .sidebar-item a, .sidebar-items a');
        console.log(`\n✓ Found ${sidebarLinks.length} sidebar links`);
        
        sidebarLinks.forEach((link, index) => {
            const text = (link.textContent || '').trim();
            const hasIcon = link.querySelector('svg');
            console.log(`  ${index + 1}. "${text}" - ${hasIcon ? '✓ Has icon' : '✗ Missing icon'}`);
        });
        
        // Check if icons are being used
        const iconUses = document.querySelectorAll('use[href*="#icon-"]');
        console.log(`\n✓ Found ${iconUses.length} icon uses in page`);
        
        // Check for broken references
        let brokenRefs = 0;
        iconUses.forEach(use => {
            const href = use.getAttribute('href') || use.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
            const iconId = href.replace('#', '');
            const symbol = document.querySelector(`#${iconId}`);
            if (!symbol) {
                console.warn(`⚠ Broken icon reference: ${iconId}`);
                brokenRefs++;
            }
        });
        
        if (brokenRefs === 0) {
            console.log("✓ All icon references are valid");
        }
        
        console.log("\n=== End Debug ===");
    };
    
    // Auto-run on page load if in debug mode
    if (window.location.search.includes('debug=icons')) {
        setTimeout(() => {
            window.checkTechcloudIcons();
        }, 1000);
    }
})();

