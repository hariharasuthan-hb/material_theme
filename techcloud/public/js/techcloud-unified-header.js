// Techcloud Unified Header
// Merges Desk page title (tick header) into custom theme header
// Removes sticky behavior and creates ONE unified header

(function() {
    "use strict";

    // Wait for Frappe to be ready
    function initUnifiedHeader() {
        if (typeof frappe === 'undefined' || !frappe.boot) {
            // Retry after a short delay
            setTimeout(initUnifiedHeader, 100);
            return;
        }

        // Only run on desk pages (not website pages)
        if (!document.body.hasAttribute('data-route')) {
            return;
        }

        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            // Navbar not ready yet, retry
            setTimeout(initUnifiedHeader, 100);
            return;
        }

        // Create container for page title in navbar if it doesn't exist
        let titleContainer = navbar.querySelector('.techcloud-page-title-container');
        if (!titleContainer) {
            // Find the navbar container or create a wrapper
            const navbarContainer = navbar.querySelector('.container') || navbar;
            
            // Create title container
            titleContainer = document.createElement('div');
            titleContainer.className = 'techcloud-page-title-container';
            titleContainer.style.cssText = 'display: flex; align-items: center; flex: 1; margin: 0 16px; min-width: 0;';
            
            // Insert after search bar or at appropriate position
            const searchContainer = navbar.querySelector('.awesomplete, .form-control')?.parentElement;
            const canInsertAfterSearch =
                searchContainer &&
                searchContainer.parentElement === navbarContainer &&
                searchContainer.nextSibling;

            if (canInsertAfterSearch) {
                navbarContainer.insertBefore(titleContainer, searchContainer.nextSibling);
            } else {
                // Insert before navbar-nav when possible, otherwise append
                const navNav = navbar.querySelector('.navbar-nav');
                if (navNav && navNav.parentElement === navbarContainer) {
                    navbarContainer.insertBefore(titleContainer, navNav);
                } else {
                    navbarContainer.appendChild(titleContainer);
                }
            }
        }

        // Hide page-head title area so title shows only in top navbar
        const pageTitleArea = document.querySelector('.page-head .page-title .title-area');
        if (pageTitleArea) {
            pageTitleArea.style.display = 'none';
        }

        let pageHeadObserver = null;
        let pageHeadRetryTimer = null;

        function attachPageHeadObserver() {
            const pageHead = document.querySelector('.page-head');
            if (!pageHead) {
                return false;
            }
            if (pageHeadObserver) {
                pageHeadObserver.disconnect();
            }
            pageHeadObserver = new MutationObserver(function(mutations) {
                let shouldSync = false;
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const target = mutation.target;
                        if (target.closest('.page-head') || 
                            target.classList?.contains('title-text') || 
                            target.classList?.contains('sub-heading') ||
                            target.classList?.contains('indicator-pill')) {
                            shouldSync = true;
                        }
                    }
                });
                if (shouldSync) {
                    setTimeout(syncPageTitle, 50);
                }
            });

            pageHeadObserver.observe(pageHead, {
                childList: true,
                subtree: true,
                characterData: true
            });

            return true;
        }

        function ensurePageHeadObserver() {
            if (attachPageHeadObserver()) return;
            if (pageHeadRetryTimer) return;
            pageHeadRetryTimer = setInterval(() => {
                if (attachPageHeadObserver()) {
                    clearInterval(pageHeadRetryTimer);
                    pageHeadRetryTimer = null;
                    syncPageTitle();
                }
            }, 100);
            setTimeout(() => {
                if (pageHeadRetryTimer) {
                    clearInterval(pageHeadRetryTimer);
                    pageHeadRetryTimer = null;
                }
            }, 5000);
        }

        // Function to sync page title from page-head to navbar
        function syncPageTitle() {
            const pageHead = document.querySelector('.page-head');
            if (!pageHead) {
                // Clear title if page-head doesn't exist
                titleContainer.innerHTML = '';
                return;
            }

            // Extract title text
            const titleElement = pageHead.querySelector('.title-text');
            const subHeadingElement = pageHead.querySelector('.sub-heading');
            const indicatorPill = pageHead.querySelector('.indicator-pill');
            
            let titleText = '';
            let subHeadingText = '';
            let indicatorHtml = '';

            if (titleElement) {
                titleText = titleElement.textContent || titleElement.innerText || '';
                console.log("[Techcloud] page-head title-text:", titleText);
            }

            if (subHeadingElement && !subHeadingElement.classList.contains('hide')) {
                subHeadingText = subHeadingElement.textContent || subHeadingElement.innerText || '';
            }

            if (indicatorPill && indicatorPill.textContent.trim()) {
                indicatorHtml = indicatorPill.outerHTML;
            }

            // Build title HTML
            if (titleText) {
                let titleHtml = `<div class="techcloud-page-title" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <h3 class="techcloud-title-text" style="margin: 0; font-size: 16px; font-weight: 600; color: #212121; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
                        ${titleText}
                    </h3>
                    ${indicatorHtml}
                </div>`;

                if (subHeadingText) {
                    titleHtml += `<div class="techcloud-sub-heading" style="font-size: 12px; color: #757575; margin-left: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                        ${subHeadingText}
                    </div>`;
                }

                titleContainer.innerHTML = titleHtml;
            } else {
                titleContainer.innerHTML = '';
            }
        }

        // Initial sync
        syncPageTitle();

        // Observe page-head for changes (may be created after refresh)
        ensurePageHeadObserver();

        // Also listen for Frappe page title updates
        if (window.frappe && window.frappe.ui && window.frappe.ui.page) {
            const originalSetTitle = window.frappe.ui.page.Page.prototype.set_title;
            if (originalSetTitle) {
                window.frappe.ui.page.Page.prototype.set_title = function() {
                    const result = originalSetTitle.apply(this, arguments);
                    setTimeout(syncPageTitle, 50);
                    return result;
                };
            }
        }

        if (window.jQuery) {
            $(document).on("page-change", function() {
                ensurePageHeadObserver();
                setTimeout(syncPageTitle, 50);
            });
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedHeader);
    } else {
        initUnifiedHeader();
    }

    // Also run when Frappe is ready
    if (typeof frappe !== 'undefined') {
        if (frappe.ready) {
            frappe.ready(initUnifiedHeader);
        }
    }
})();


