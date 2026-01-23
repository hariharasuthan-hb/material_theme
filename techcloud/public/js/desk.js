// Techcloud Desk: place unified header inside layout-main-section frappe-card
(function () {
	"use strict";

	let applyTimer = null;
	let observer = null;
	let ajaxLoader = null;
	let loaderTimeout = null;

	function getActivePageContainer() {
		if (window.frappe && frappe.container && frappe.container.page) {
			return frappe.container.page;
		}
		if (window.jQuery) {
			const visible = $(".page-container:visible").get(0);
			if (visible) return visible;
		}
		return document.querySelector(".page-container");
	}

	function getLayoutMain(pageContainer) {
		const scope = pageContainer || document;
		return (
			scope.querySelector(".layout-main-section.frappe-card") ||
			scope.querySelector(".layout-main-section") ||
			// Some pages (like Workspaces / Manufacturing) use slightly different wrappers
			scope.querySelector(".layout-main") ||
			scope.querySelector(".page-content") ||
			scope.querySelector(".page-container")
		);
	}

	function removeDefaultHeaders() {
		// No-op: we now reuse Frappe's own navbar instead of removing it.
	}

	function cleanupUnwantedLayout() {
		// Remove Frappe's accessibility skip buttons that get re-injected
		document
			.querySelectorAll('[aria-label="Navigate to main content"]')
			.forEach((el) => {
				if (el.parentElement) {
					el.parentElement.removeChild(el);
				} else {
					el.remove();
				}
			});

		// Remove logo from menu list (should only be in sidebar container, not menu)
		document
			.querySelectorAll(".desk-sidebar.list-unstyled.sidebar-menu .techcloud-sidebar-logo")
			.forEach((el) => {
				if (el.parentElement) {
					el.parentElement.removeChild(el);
				} else {
					el.remove();
				}
			});

		// Remove logo from overlay sidebar (should only be in main sidebar, not overlay)
		document
			.querySelectorAll(".list-sidebar.overlay-sidebar .techcloud-sidebar-logo")
			.forEach((el) => {
				if (el.parentElement) {
					el.parentElement.removeChild(el);
				} else {
					el.remove();
				}
			});

		// Remove duplicate page-head containers if any
		const pageHeads = document.querySelectorAll(".page-head");
		if (pageHeads.length > 1) {
			// Keep only the first one, remove duplicates
			for (let i = 1; i < pageHeads.length; i++) {
				const duplicate = pageHeads[i];
				if (duplicate.parentElement) {
					duplicate.parentElement.removeChild(duplicate);
				} else {
					duplicate.remove();
				}
			}
		}

		// Ensure page-head comes after sticky-header-container (if not using unified-header)
		const stickyHeader = document.querySelector(".sticky-header-container");
		const pageHead = document.querySelector(".page-head");
		
		if (stickyHeader && pageHead && !document.querySelector(".unified-header")) {
			// Only reorder if unified-header is not being used
			if (stickyHeader.nextElementSibling !== pageHead && stickyHeader.parentNode) {
				stickyHeader.parentNode.insertBefore(
					pageHead,
					stickyHeader.nextSibling
				);
			}
		}
	}

	function ensureSidebarLogo(retryCount = 0) {
		// Target ONLY actual sidebar containers (exclude menu lists and overlay sidebars)
		// Exclude:
		// - .desk-sidebar.list-unstyled.sidebar-menu (menu list, not container)
		// - .list-sidebar.overlay-sidebar (overlay sidebar, not main sidebar)
		const sidebars = document.querySelectorAll(
			".layout-side-section, .desk-sidebar:not(.list-unstyled):not(.sidebar-menu), .standard-sidebar, .list-sidebar:not(.overlay-sidebar)"
		);

		// If no sidebars found and we haven't retried too many times, retry after delay
		if (sidebars.length === 0 && retryCount < 3) {
			setTimeout(() => {
				ensureSidebarLogo(retryCount + 1);
			}, 200);
			return;
		}

		sidebars.forEach((sidebar) => {
			if (!sidebar) return;

			// Skip if this is a menu list (not a container)
			if (sidebar.classList.contains("list-unstyled") && sidebar.classList.contains("sidebar-menu")) {
				return;
			}

			// Skip if this is an overlay sidebar (not main sidebar)
			if (sidebar.classList.contains("overlay-sidebar")) {
				return;
			}

			const style = window.getComputedStyle(sidebar);
			if (style.display === "none" || style.visibility === "hidden") return;

			// ✅ Prevent duplicate logo (check both class and data-flag for extra safety)
			if (sidebar.querySelector(".techcloud-sidebar-logo") || sidebar.dataset.techcloudLogo === "1") return;

			const logo = document.createElement("a");
			logo.className = "navbar-brand navbar-home techcloud-sidebar-logo";
			logo.href = "/app";

			const img = document.createElement("img");
			img.className = "app-logo";
			img.src =
				(window.frappe && frappe.boot && frappe.boot.app_logo_url) ||
				"/assets/erpnext/images/erpnext-logo.svg";
			img.alt = "App Logo";

			logo.appendChild(img);
			sidebar.insertBefore(logo, sidebar.firstChild);
			
			// Mark sidebar as having logo (survives multiple renders better)
			sidebar.dataset.techcloudLogo = "1";
		});
	}
	

	// --------------------------------------------
	// Route / context helpers
	// --------------------------------------------

	function getCurrentRouteString() {
		try {
			if (window.frappe && frappe.get_route) {
				const r = frappe.get_route();
				if (Array.isArray(r)) {
					return r.join("/").toLowerCase();
				}
				return String(r || "").toLowerCase();
			}
		} catch (e) {
			// ignore
		}

		const path = (window.location && window.location.pathname) || "";
		// Normalise /app/... to a route-like string, e.g. app/item-group
		return path.replace(/^\/+/, "").toLowerCase();
	}

	// Routes that behave like workspaces / dashboards (no standard DocType header)
	function isWorkspaceLikeRoute() {
		const route = getCurrentRouteString();
		if (!route) return false;

		// Core workspaces and desk
		if (route === "app" || route.startsWith("app/workspace")) return true;

		// Item Group workspace (your screenshot)
		if (route === "app/item-group" || route === "item-group") return true;

		// Generic workspace / dashboard style routes
		if (
			route.startsWith("workspace") ||
			route.includes("dashboard-view") ||
			(route.includes("dashboard") && !route.includes("report"))
		) {
			return true;
		}

		return false;
	}

	// Heuristic: real DocType form or list views
	function isFormOrListRoute() {
		if (isWorkspaceLikeRoute()) return false;

		// Presence of typical form/list DOM plus page-head + actions
		const hasForm = document.querySelector(
			".form-layout, .form-container, .frappe-control, .page-form"
		);
		const hasList = document.querySelector(
			".list-view, .result-list, .frappe-list, .list-row-container"
		);
		const hasPageHeadTitle = document.querySelector(
			".page-head .page-title, .page-head .title-text"
		);
		const hasPageActions = document.querySelector(
			".page-head .page-actions, .page-actions .standard-actions, .page-actions .primary-action"
		);

		return !!((hasForm || hasList) && hasPageHeadTitle && hasPageActions);
	}


	function applyUnifiedHeader() {
		if (!document.body) return;

		const pageContainer = getActivePageContainer();
		const scope = pageContainer || document;
		const mainSection = getLayoutMain(scope);
		if (!mainSection) return;

		// Find navbar (may be inside sticky-top or standalone)
		// Try multiple selectors to ensure we find the navbar
		let stickyContainer = null;
		let navbar = null;

		// Look for existing navbar in various locations
		const possibleLocations = [
			scope.querySelector(".sticky-header-container"),
			scope.querySelector(".sticky-top"),
			document.querySelector(".sticky-header-container"),
			document.querySelector(".sticky-top"),
			document.querySelector("header.navbar")?.closest(".sticky-top")
		];

		for (const location of possibleLocations) {
			if (location) {
				const foundNavbar = location.querySelector("header.navbar") ||
					(location.tagName === 'HEADER' && location.classList.contains('navbar') ? location : null);
				if (foundNavbar) {
					stickyContainer = location;
					navbar = foundNavbar;
					break;
				}
			}
		}

		// Fallback: look for navbar anywhere in document
		if (!navbar) {
			navbar = document.querySelector("header.navbar");
			if (navbar) {
				stickyContainer = navbar.closest(".sticky-top") || navbar.closest(".sticky-header-container");
			}
		}

		const pageHead =
			scope.querySelector(".page-head") || document.querySelector(".page-head");

		if (!navbar && !pageHead) return;

		// Create or reuse unified header container
		let unifiedHeader = mainSection.querySelector(".unified-header");
		if (!unifiedHeader) {
			unifiedHeader = document.createElement("div");
			unifiedHeader.className = "unified-header";
			mainSection.prepend(unifiedHeader);
		}
		
		// Cleanup: Remove any unified-topbar that might exist inside unified-header
		// (navbar should be in standalone unified-topbar, not inside unified-header)
		const topbarInHeader = unifiedHeader.querySelector(".unified-topbar");
		if (topbarInHeader) {
			const navbarInTopbar = topbarInHeader.querySelector("header.navbar");
			if (navbarInTopbar && navbarInTopbar.parentElement) {
				navbarInTopbar.parentElement.removeChild(navbarInTopbar);
			}
			if (topbarInHeader.parentElement) {
				topbarInHeader.parentElement.removeChild(topbarInHeader);
			}
		}

		// ---------- TOP BAR (utility/nav) - BEFORE unified-header ----------
		if (navbar) {
			// Check if navbar is already in standalone unified-topbar - if so, skip moving
			const standaloneTopbar = mainSection.querySelector(".unified-topbar:not(.unified-header .unified-topbar)");
			if (standaloneTopbar && standaloneTopbar.contains(navbar)) {
				// Just ensure dropdowns are initialized
				setTimeout(() => {
					initDropdowns(navbar);
					initializeSearch();
				}, 100);
				return; // Skip the rest of navbar processing
			}
			
			// Remove navbar-brand (sidebar owns the logo) - clean DOM, no CSS hacks
			const navbarBrand = navbar.querySelector(
				".navbar-brand:not(.techcloud-sidebar-logo)"
			);
			if (navbarBrand) {
				navbarBrand.remove();
			}

			// Get or create unified-topbar OUTSIDE unified-header (before it)
			let unifiedTopbar = mainSection.querySelector(".unified-topbar:not(.unified-header .unified-topbar)");
			
			// Check if navbar is in unified-header's topbar - if so, we need to move it out
			const topbarInHeader = unifiedHeader.querySelector(".unified-topbar");
			if (topbarInHeader && topbarInHeader.contains(navbar)) {
				// Extract navbar from topbar in header
				if (navbar.parentElement) {
					navbar.parentElement.removeChild(navbar);
				}
				// Remove the topbar from unified-header
				if (topbarInHeader.parentElement) {
					topbarInHeader.parentElement.removeChild(topbarInHeader);
				}
			}

			if (!unifiedTopbar) {
				unifiedTopbar = document.createElement("div");
				unifiedTopbar.className = "unified-topbar";
				// Insert BEFORE unified-header
				mainSection.insertBefore(unifiedTopbar, unifiedHeader);
			}

			// Move navbar into standalone unified-topbar (NOT inside unified-header)
			if (!unifiedTopbar.contains(navbar)) {
				// Ensure navbar is removed from its current parent first
				if (navbar.parentElement) {
					navbar.parentElement.removeChild(navbar);
				}
				// Append navbar directly to standalone topbar
				unifiedTopbar.appendChild(navbar);

				// Clean up empty sticky containers
				if (stickyContainer && !stickyContainer.hasChildNodes()) {
					if (stickyContainer.parentElement) {
						stickyContainer.parentElement.removeChild(stickyContainer);
					}
				}
			}

			// Ensure navbar content is properly initialized
			setTimeout(() => {
				initDropdowns(navbar);
				initializeSearch();
			}, 100);
		}

		// ---------- PAGE BAR (title/actions) ----------
		if (pageHead) {
			// Get or create unified-pagebar
			let pagebar = unifiedHeader.querySelector(".unified-pagebar");
			if (!pagebar) {
				pagebar = document.createElement("div");
				pagebar.className = "unified-pagebar";
				unifiedHeader.appendChild(pagebar);
			}

			// Check if page-head content is stale (shows previous page content)
			const currentTitle = pageHead.querySelector(".page-title .title-text, .title-text, h3");
			const currentTitleText = currentTitle ? currentTitle.textContent.trim() : "";
			const currentRoute = getCurrentRouteString();
			
			// If page-head is already in pagebar, check if content needs refresh
			if (pagebar.contains(pageHead)) {
				// Store last known title to detect changes
				const lastTitle = pageHead.dataset.lastTitle || "";
				if (currentTitleText && currentTitleText !== lastTitle) {
					// Title changed - update marker
					pageHead.dataset.lastTitle = currentTitleText;
				}
			}

			// Move page-head into pagebar if not already there
			if (!pagebar.contains(pageHead)) {
				if (pageHead.parentElement) {
					pageHead.parentElement.removeChild(pageHead);
				}
				pagebar.appendChild(pageHead);
				// Mark current title after moving
				if (currentTitleText) {
					pageHead.dataset.lastTitle = currentTitleText;
				}
			}
		}

		bindThemeToggle(unifiedHeader);
		initDropdowns(unifiedHeader);
		cleanupUnwantedLayout();
		initializeSearch();
		
		// Ensure primary actions are visible after unified header is applied
		// This runs AFTER DOM manipulation, so buttons should be visible
		requestAnimationFrame(() => {
			ensurePrimaryActionsVisible();
			// Hide loader after unified header is applied
			hideAjaxLoader();
		});
	}

	function bindThemeToggle(scope) {
		const root = (scope && scope.querySelector) ? scope : document;
		const toggle = Array.from(root.querySelectorAll(".dropdown-menu .dropdown-item"))
			.find((el) => (el.textContent || "").trim() === "Toggle Theme");
		if (!toggle || toggle.dataset.techcloudBound === "1") return;
		toggle.dataset.techcloudBound = "1";
		toggle.addEventListener("click", (e) => {
			e.preventDefault();
			if (window.frappe && frappe.ui && frappe.ui.ThemeSwitcher) {
				new frappe.ui.ThemeSwitcher().show();
			}
		});
	}

	function initDropdowns(scope) {
		if (!window.jQuery) return;
		const root = (scope && scope.querySelector) ? scope : document;
		
		// Initialize all dropdowns in the scope
		$(root).find('[data-toggle="dropdown"]').each(function() {
			// Re-initialize dropdown to ensure it works after DOM moves
			if ($(this).data('bs.dropdown')) {
				// If already initialized, dispose and reinitialize
				$(this).dropdown('dispose');
			}
			$(this).dropdown();
		});
		
		// Also initialize any dropdown menus that might be dynamically added
		$(root).find('.dropdown-menu').each(function() {
			const toggle = $(this).siblings('[data-toggle="dropdown"]').first();
			if (toggle.length && !toggle.data('bs.dropdown')) {
				toggle.dropdown();
			}
		});
	}

	// ============================================
	// AJAX LOADER - Shows during navigation until DOM is ready
	// ============================================
	
	function createAjaxLoader() {
		if (ajaxLoader) return ajaxLoader;
		
		// Only show loader for Techcloud theme
		if (!isTechCloudTheme()) return null;
		
		ajaxLoader = document.createElement("div");
		ajaxLoader.id = "techcloud-ajax-loader";
		ajaxLoader.className = "techcloud-ajax-loader";
		ajaxLoader.innerHTML = `
			<div class="techcloud-loader-spinner">
				<div class="techcloud-spinner-ring"></div>
				<div class="techcloud-spinner-ring"></div>
				<div class="techcloud-spinner-ring"></div>
				<div class="techcloud-spinner-ring"></div>
			</div>
		`;
		document.body.appendChild(ajaxLoader);
		return ajaxLoader;
	}
	
	function showAjaxLoader() {
		if (!isTechCloudTheme()) return;
		
		const loader = createAjaxLoader();
		if (loader) {
			loader.classList.add("active");
			document.body.classList.add("ajax-loading");
		}
	}
	
	function hideAjaxLoader() {
		if (loaderTimeout) {
			clearTimeout(loaderTimeout);
			loaderTimeout = null;
		}
		
		if (ajaxLoader) {
			ajaxLoader.classList.remove("active");
			document.body.classList.remove("ajax-loading");
		}
	}
	
	function initializeSearch() {
		// Initialize Frappe search functionality on the navbar search input
		// Frappe expects #navbar-search element to exist
		const searchInput = document.querySelector('#navbar-search');
		const searchBar = document.querySelector('.search-bar');
		
		if (!searchInput) {
			// Search input doesn't exist yet, try again after a short delay
			setTimeout(initializeSearch, 100);
			return;
		}

		// Ensure search bar wrapper is visible (Frappe's setup_awesomebar does this too, but ensure it's done)
		if (searchBar) {
			searchBar.classList.remove('hidden');
		}

		// Wait for frappe boot to complete before initializing search
		if (window.frappe && window.frappe.boot && window.frappe.search && window.frappe.search.AwesomeBar && window.frappe.ui && window.frappe.ui.toolbar) {
			try {
				// Check if search is already initialized (Frappe checks internally, but we add extra safety)
				if (window.frappe.ui.toolbar.setup_awesomebar && !searchInput.dataset.awesomeBarInitialized) {
					// Mark as initialized to prevent duplicate initialization
					searchInput.dataset.awesomeBarInitialized = '1';

					// Initialize the awesome bar (this will setup #navbar-search automatically)
					window.frappe.ui.toolbar.setup_awesomebar();
				}
			} catch (e) {
				console.warn('[Techcloud] Failed to initialize search:', e);
			}
		} else {
			// Frappe not ready yet, retry after delay
			setTimeout(initializeSearch, 100);
		}
	}

	function scheduleApply() {
		if (applyTimer) clearTimeout(applyTimer);
		// Increased delay to ensure Frappe finishes updating page-head content during AJAX
		applyTimer = setTimeout(() => {
			requestAnimationFrame(() => {
				applyUnifiedHeader();
				// ensurePrimaryActionsVisible is called inside applyUnifiedHeader
			});
		}, 250);
	}

	function startObserver() {
		if (observer || !document.body) return;
		observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Watch for childList changes
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes) {
						if (!(node instanceof Element)) continue;
						// When Frappe injects or re-renders the sticky header / navbar,
						// re-apply unified header.
						if (
							node.matches(".sticky-top, .sticky-header-container") ||
							node.querySelector(".sticky-top, .sticky-header-container")
						) {
							scheduleApply();
						}
						if (
							node.matches(".page-head-content") ||
							node.querySelector(".page-head-content") ||
							node.matches(".layout-main-section") ||
							node.querySelector(".layout-main-section") ||
							node.matches(".page-container") ||
							node.querySelector(".page-container")
						) {
							scheduleApply();
							return;
						}
						// Watch for sidebar changes - ONLY sidebar-specific mutations
						if (
							node.matches(".layout-side-section") ||
							node.querySelector(".layout-side-section") ||
							node.matches(".desk-sidebar") ||
							node.querySelector(".desk-sidebar") ||
							node.matches(".list-sidebar") ||
							node.querySelector(".list-sidebar")
						) {
							setTimeout(() => {
								ensureSidebarLogo();
							}, 100);
						}

						// Watch for page-head or sticky-header changes
						if (
							node.matches(".page-head, .sticky-header-container") ||
							node.querySelector(".page-head, .sticky-header-container")
						) {
							setTimeout(() => {
								cleanupUnwantedLayout();
							}, 50);
						}
						
						// Watch for dynamically injected navbar elements or dropdown menus
						if (
							node.matches(".navbar, .navbar-nav, .dropdown-menu, [data-toggle='dropdown']") ||
							node.querySelector(".navbar, .navbar-nav, .dropdown-menu, [data-toggle='dropdown']")
						) {
							setTimeout(() => {
								// Re-initialize dropdowns when Frappe injects new elements
								const navbar = document.querySelector("header.navbar");
								if (navbar) {
									initDropdowns(navbar);
								}
							}, 100);
						}
					}
				}
				// Watch for attribute changes (like style changes when sidebar becomes visible)
				if (mutation.type === "attributes") {
					const target = mutation.target;
					if (
						target.matches(".layout-side-section") ||
						target.matches(".list-sidebar") ||
						target.closest(".layout-side-section")
					) {
						if (mutation.attributeName === "style" || mutation.attributeName === "class") {
							setTimeout(() => {
								ensureSidebarLogo();
							}, 100);
						}
					}
				}
				
				// Watch for content changes INSIDE .page-head (title, actions updates during AJAX)
				if (mutation.type === "childList" || mutation.type === "characterData") {
					const target = mutation.target;
					// Check if mutation is inside .page-head or if .page-head is the target
					const pageHead = target.closest ? target.closest(".page-head") : null;
					const isPageHeadContent = pageHead || target.matches(".page-head");
					
					if (isPageHeadContent) {
						// Check if title or actions changed
						const titleChanged = target.matches(".page-title, .title-text") || 
							target.closest && target.closest(".page-title, .title-text");
						const actionsChanged = target.matches(".page-actions, .standard-actions, .primary-action") ||
							target.closest && target.closest(".page-actions, .standard-actions, .primary-action");
						
						if (titleChanged || actionsChanged) {
							// Content inside page-head changed - refresh unified header
							scheduleApply();
							// Hide loader when page content is ready
							setTimeout(() => {
								hideAjaxLoader();
							}, 150);
						}
					}
				}
			}
		});

		observer.observe(document.body, { 
			childList: true, 
			subtree: true,
			attributes: true,
			attributeFilter: ["style", "class"],
			characterData: true  // Watch for text content changes
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", scheduleApply);
	} else {
		scheduleApply();
	}

	startObserver();

	// Route change handler - ONLY place for sidebar logo on navigation
	if (window.frappe && frappe.router && frappe.router.on) {
		frappe.router.on("change", () => {
			// Show loader immediately when route changes
			showAjaxLoader();
			
			// Use frappe.after_ajax to ensure Frappe finishes DOM updates first
			if (window.frappe && frappe.after_ajax) {
				frappe.after_ajax(() => {
					setTimeout(() => {
						scheduleApply();
						ensureSidebarLogo();
						cleanupUnwantedLayout();
						
						// Hide loader after DOM is ready
						// Wait a bit more to ensure all content is rendered
						loaderTimeout = setTimeout(() => {
							hideAjaxLoader();
						}, 100);
					}, 150);
				});
			} else {
				setTimeout(() => {
					scheduleApply();
					ensureSidebarLogo();
					cleanupUnwantedLayout();
					
					// Hide loader after DOM is ready
					loaderTimeout = setTimeout(() => {
						hideAjaxLoader();
					}, 100);
				}, 200);
			}
		});
	} else if (window.jQuery) {
		// Fallback for older Frappe versions without router
		$(document).on("page-change", () => {
			// Show loader immediately when page changes
			showAjaxLoader();
			
			if (window.frappe && frappe.after_ajax) {
				frappe.after_ajax(() => {
					setTimeout(() => {
						scheduleApply();
						ensureSidebarLogo();
						cleanupUnwantedLayout();
						
						// Hide loader after DOM is ready
						loaderTimeout = setTimeout(() => {
							hideAjaxLoader();
						}, 100);
					}, 150);
				});
			} else {
				setTimeout(() => {
					scheduleApply();
					ensureSidebarLogo();
					cleanupUnwantedLayout();
					
					// Hide loader after DOM is ready
					loaderTimeout = setTimeout(() => {
						hideAjaxLoader();
					}, 100);
				}, 200);
			}
		});
	}

	if (window.frappe && frappe.after_ajax) {
		frappe.after_ajax(() => {
			// Additional delay to ensure page-head content is fully updated
			setTimeout(scheduleApply, 200);
		});
	}

	// Initial load - ensure sidebar logo after Frappe boot
	if (window.frappe && frappe.ready) {
		frappe.ready(() => {
			scheduleApply();
			ensureSidebarLogo();
			cleanupUnwantedLayout();
			// Ensure search is initialized after frappe boot
			setTimeout(initializeSearch, 100);
			// Ensure loader is hidden on initial page load (don't show it on first load)
			hideAjaxLoader();
		});
	}

	// NOTE: ensureSidebarLogo() is ONLY called from:
	// 1. MutationObserver (sidebar-specific mutations) - lines 316, 341
	// 2. Router change (frappe.router.on("change")) - line 370
	// 3. Page-change fallback (if router not available) - line 379
	// 4. Initial load (frappe.ready) - line 393
	// 
	// It is NOT called from:
	// - applyUnifiedHeader() ✅
	// - scheduleApply() ✅
	// - setInterval ✅ (removed - no polling)
	// - page-render ✅ (removed - only page-change as fallback)
	// - frappe.after_ajax ✅

	// ============================================
	// PRIMARY ACTIONS VISIBILITY FIX - AJAX PROOF
	// ============================================
	
	function isTechCloudTheme() {
		const theme = document.documentElement.getAttribute("data-theme");
		const themeMode = document.documentElement.getAttribute("data-theme-mode");
		return theme === "material" || themeMode === "material";
	}

	function shouldShowSaveButton() {
		// Only show save button if we're on a form page
		const isFormPage = document.querySelector(".form-container, .form-section, .frappe-control");
		if (!isFormPage) return false;

		// Check if form is in edit mode
		const isEditMode = document.querySelector(".form-container[data-doctype]") && 
			!document.querySelector(".form-container.read-only");
		
		// Check if there are editable fields
		const hasEditableFields = document.querySelectorAll(".form-control:not([readonly]):not([disabled])").length > 0;

		return isFormPage && (isEditMode || hasEditableFields);
	}

	function ensurePrimaryActionsVisible() {
		// Only run for TechCloud theme
		if (!isTechCloudTheme()) return;

		// Only adjust real DocType form/list headers, never workspace-like pages
		if (!isFormOrListRoute()) return;

		// Wait for Frappe to finish rendering - use multiple strategies
		const checkAndFix = () => {
			const pageActions = document.querySelector(".page-actions");
			const standardActions = document.querySelector(".standard-actions");
			const primaryAction = document.querySelector(".primary-action");

			// Ensure page-actions container is visible
			if (pageActions) {
				pageActions.classList.remove("hide");
				pageActions.style.display = "flex";
				pageActions.style.visibility = "visible";
				pageActions.style.opacity = "1";
			}

			// Ensure standard-actions container is visible
			if (standardActions) {
				standardActions.classList.remove("hide");
				standardActions.style.display = "flex";
				standardActions.style.visibility = "visible";
				standardActions.style.opacity = "1";
			}

			// Handle primary action (Save button) intelligently
			if (primaryAction) {
				const hasContent = primaryAction.textContent.trim().length > 0 || 
					primaryAction.querySelector("svg, .icon, img, span");
				const hasDataLabel = primaryAction.getAttribute("data-label");
				const shouldShow = shouldShowSaveButton();

				// Only show if it has actual content, data-label, or should be shown for form
				if (hasContent || hasDataLabel || shouldShow) {
					primaryAction.classList.remove("hide");
					primaryAction.style.display = "inline-flex";
					primaryAction.style.visibility = "visible";
					primaryAction.style.opacity = "1";
				} else {
					// Hide if truly empty and not needed - remove inline styles that force visibility
					primaryAction.style.display = "none";
					primaryAction.style.visibility = "hidden";
					primaryAction.style.opacity = "0";
					primaryAction.classList.add("hide");
				}
			}

			// Ensure all buttons in page-actions are visible (except those with .hide class)
			if (pageActions) {
				pageActions.querySelectorAll(".btn").forEach(btn => {
					const hasContent = btn.textContent.trim().length > 0 || 
						btn.querySelector("svg, .icon, img, span");
					const hasDataLabel = btn.getAttribute("data-label");
					
					// Only show buttons that have actual content
					if (hasContent || hasDataLabel) {
						btn.classList.remove("hide");
						btn.style.display = "inline-flex";
						btn.style.visibility = "visible";
						btn.style.opacity = "1";
					} else {
						// Hide empty buttons - remove inline styles that force visibility
						btn.style.display = "none";
						btn.style.visibility = "hidden";
						btn.style.opacity = "0";
						btn.classList.add("hide");
					}
				});
			}
		};

		// Use requestAnimationFrame for immediate DOM access after render
		requestAnimationFrame(() => {
			// Also wait a tick for Frappe to finish DOM manipulation
			setTimeout(checkAndFix, 50);
			// And again after a longer delay for AJAX-loaded content
			setTimeout(checkAndFix, 200);
		});
	}

	// Setup MutationObserver for primary actions
	let primaryActionObserver = null;
	function setupPrimaryActionWatcher() {
		if (primaryActionObserver || !document.body) return;

		primaryActionObserver = new MutationObserver((mutations) => {
			let needsUpdate = false;
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							if (
								node.matches(".page-actions, .standard-actions, .primary-action") ||
								node.querySelector(".page-actions, .standard-actions, .primary-action")
							) {
								needsUpdate = true;
							}
						}
					});
				}
				if (mutation.type === "attributes") {
					const target = mutation.target;
					if (
						target.matches(".page-actions, .standard-actions, .primary-action") ||
						(mutation.attributeName === "class" && target.classList.contains("hide"))
					) {
						needsUpdate = true;
					}
				}
			});

			if (needsUpdate) {
				ensurePrimaryActionsVisible();
			}
		});

		primaryActionObserver.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["class", "style"]
		});
	}

	// Hook into Frappe's page lifecycle - MATCH FRAPPE'S STANDARD PATTERN
	// Frappe renders pages synchronously after router change, so we hook directly
	
	if (window.frappe && frappe.router && frappe.router.on) {
		frappe.router.on("change", () => {
			// Frappe renders page immediately after route change
			// Use requestAnimationFrame to ensure DOM is ready
			requestAnimationFrame(() => {
				ensurePrimaryActionsVisible();
			});
		});
	}

	// jQuery page_change event - Frappe's standard event
	if (window.jQuery) {
		$(document).on("page_change", function() {
			// This fires AFTER Frappe renders the page
			requestAnimationFrame(() => {
				ensurePrimaryActionsVisible();
			});
		});

		// Form refresh event - when form data loads
		$(document).on("form_refresh", function() {
			requestAnimationFrame(() => {
				ensurePrimaryActionsVisible();
			});
		});
	}

	// Also hook into frappe.after_ajax for AJAX-loaded content
	if (window.frappe && frappe.after_ajax) {
		frappe.after_ajax(() => {
			requestAnimationFrame(() => {
				ensurePrimaryActionsVisible();
			});
		});
	}

	// Initialize watcher
	if (document.body) {
		setupPrimaryActionWatcher();
	} else {
		document.addEventListener("DOMContentLoaded", () => {
			setupPrimaryActionWatcher();
			ensurePrimaryActionsVisible();
		});
	}

	// Initial call after Frappe is ready - MATCH FRAPPE'S PATTERN
	if (window.frappe && frappe.ready) {
		frappe.ready(() => {
			requestAnimationFrame(() => {
				ensurePrimaryActionsVisible();
			});
		});
	} else if (document.readyState === "complete") {
		// Fallback if frappe.ready not available
		requestAnimationFrame(() => {
			ensurePrimaryActionsVisible();
		});
	}
})();
