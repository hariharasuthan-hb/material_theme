// Techcloud Header Fix
// Fixes navbar brand to show logo and hide "LOGIN" text
// Ensures proper left/right alignment

(function() {
    "use strict";

    function fixNavbarHeader() {
        // Find navbar brand
        const navbarBrand = document.querySelector('.navbar-brand');
        if (!navbarBrand) return;

        // Always remove "LOGIN" text if present
        const brandText = navbarBrand.textContent || navbarBrand.innerText || '';
        const cleanText = brandText.trim().toUpperCase();
        
        // Check if there's already an image or logo
        const hasImage = navbarBrand.querySelector('img') || navbarBrand.querySelector('.app-logo');
        
        // Remove "LOGIN" or "HOME" text
        if (cleanText === 'LOGIN' || cleanText === 'HOME' || cleanText.includes('LOGIN') || cleanText.includes('HOME')) {
            // Remove all text nodes that say "LOGIN" or "HOME"
            const textNodes = Array.from(navbarBrand.childNodes).filter(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            textNodes.forEach(node => {
                const nodeText = node.textContent.trim().toUpperCase();
                if (nodeText === 'LOGIN' || nodeText === 'HOME' || nodeText.includes('LOGIN') || nodeText.includes('HOME')) {
                    node.remove();
                }
            });
            
            // Also remove from span elements
            const spans = navbarBrand.querySelectorAll('span');
            spans.forEach(span => {
                const spanText = span.textContent.trim().toUpperCase();
                if (spanText === 'LOGIN' || spanText === 'HOME' || spanText.includes('LOGIN') || spanText.includes('HOME')) {
                    span.remove();
                }
            });
        }
        
        // If no logo exists, try to inject app logo
        if (!hasImage) {
            // Try to get logo from frappe.boot
            let logoUrl = null;
            if (typeof frappe !== 'undefined' && frappe.boot) {
                logoUrl = frappe.boot.app_logo_url || frappe.boot.brand_html || null;
            }
            
            // If we have a logo URL, create and inject logo image
            if (logoUrl) {
                const logoImg = document.createElement('img');
                logoImg.src = logoUrl;
                logoImg.className = 'app-logo';
                logoImg.alt = 'Logo';
                logoImg.style.height = '32px';
                logoImg.style.width = 'auto';
                logoImg.style.maxWidth = '120px';
                logoImg.style.objectFit = 'contain';
                
                // Clear existing content and add logo
                navbarBrand.innerHTML = '';
                navbarBrand.appendChild(logoImg);
            } else {
                // No logo available, show site name instead of "Home"
                let siteName = 'techcloud';
                if (typeof frappe !== 'undefined' && frappe.boot) {
                    siteName = frappe.boot.app_name || frappe.boot.sitename || 'techcloud';
                    siteName = siteName.charAt(0).toLowerCase() + siteName.slice(1);
                }
                
                // Replace any remaining "Home" text with site name
                if (navbarBrand.textContent.trim().toUpperCase() === 'HOME' || navbarBrand.textContent.trim() === '') {
                    navbarBrand.textContent = siteName;
                    navbarBrand.style.fontSize = '24px';
                    navbarBrand.style.fontWeight = '700';
                    navbarBrand.style.color = '#0089FF';
                    navbarBrand.style.letterSpacing = '-0.5px';
                }
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

