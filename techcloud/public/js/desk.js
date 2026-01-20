// Techcloud Desk: place unified header inside layout-main-section frappe-card
(function () {
	"use strict";

	let applyTimer = null;
	let observer = null;

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
			.forEach((el) => el.parentElement && el.parentElement.removeChild(el));
	}

	function ensureSidebarLogo() {
		// Target ONLY outer side-section containers; never attach logo directly inside .desk-sidebar.

		// First, remove any stray logos that ended up inside the desk sidebar menu itself.
		Array.from(
			document.querySelectorAll(
				".desk-sidebar.list-unstyled.sidebar-menu .techcloud-sidebar-logo"
			)
		).forEach((el) => {
			if (el.parentElement) el.parentElement.removeChild(el);
		});

		const sidebars = document.querySelectorAll(".layout-side-section, .standard-sidebar");

		sidebars.forEach((sidebar) => {
			if (!sidebar) return;
	
			const style = window.getComputedStyle(sidebar);
			if (style.display === "none" || style.visibility === "hidden") return;
	
			// ✅ Prevent duplicate logo
			if (sidebar.querySelector(".techcloud-sidebar-logo")) return;
	
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
		});
	}
	

	function applyUnifiedHeader() {
		if (!document.body) return;

		const pageContainer = getActivePageContainer();
		const scope = pageContainer || document;
		const mainSection = getLayoutMain(scope);
		if (!mainSection) return;

		// Use Frappe's existing sticky header container / sticky-top navbar
		const stickyContainer =
			scope.querySelector(".sticky-header-container") ||
			scope.querySelector(".sticky-top") ||
			scope.querySelector("header.navbar")?.closest(".sticky-top") ||
			document.querySelector(".sticky-header-container") ||
			document.querySelector(".sticky-top");

		const navbar = stickyContainer
			? stickyContainer.querySelector("header.navbar") || stickyContainer
			: document.querySelector("header.navbar");

		const pageHead =
			scope.querySelector(".page-head") || document.querySelector(".page-head");

		if (!navbar && !pageHead) return;

		// Create or reuse unified header shell
		let unifiedHeader = mainSection.querySelector(".unified-header");
		if (!unifiedHeader) {
			unifiedHeader = document.createElement("div");
			unifiedHeader.className = "unified-header";
			mainSection.prepend(unifiedHeader);
		}

		// ---------- TOP BAR (utility/nav) ----------
		if (navbar) {
			// Strip navbar-brand here; sidebar owns the logo
			const navbarBrand = navbar.querySelector(
				".navbar-brand:not(.techcloud-sidebar-logo)"
			);
			if (navbarBrand && navbarBrand.parentElement) {
				navbarBrand.parentElement.removeChild(navbarBrand);
			}

			let topbar = unifiedHeader.querySelector(".unified-topbar");
			if (!topbar) {
				topbar = document.createElement("div");
				topbar.className = "unified-topbar";
				unifiedHeader.appendChild(topbar);
			}

			if (!topbar.contains(navbar)) {
				if (navbar.parentElement) navbar.parentElement.removeChild(navbar);
				topbar.appendChild(navbar);
			}
		}

		// ---------- PAGE BAR (title/actions) ----------
		if (pageHead) {
			let pagebar = unifiedHeader.querySelector(".unified-pagebar");
			if (!pagebar) {
				pagebar = document.createElement("div");
				pagebar.className = "unified-pagebar";
				unifiedHeader.appendChild(pagebar);
			}

			if (!pagebar.contains(pageHead)) {
				if (pageHead.parentElement) pageHead.parentElement.removeChild(pageHead);
				pagebar.appendChild(pageHead);
			}
		}

		bindThemeToggle(unifiedHeader);
		initDropdowns(unifiedHeader);
		cleanupUnwantedLayout();
		initializeSearch();
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
		$(root).find('[data-toggle="dropdown"]').dropdown();
	}

	function initializeSearch() {
		// Initialize Frappe search functionality on the custom navbar search input
		const searchBar = document.querySelector('.search-bar');
		if (searchBar) {
			// Ensure search bar is visible (remove hidden class if present)
			searchBar.classList.remove('hidden');
		}

		// Wait for frappe boot to complete before initializing search
		if (window.frappe && window.frappe.boot && window.frappe.search && window.frappe.search.AwesomeBar && window.frappe.ui && window.frappe.ui.toolbar) {
			try {
				// Check if search is already initialized
				if (window.frappe.ui.toolbar.setup_awesomebar && !document.querySelector('.search-bar.awesome-bar-initialized')) {
					// Mark search bar as initialized to prevent duplicate initialization
					if (searchBar) {
						searchBar.classList.add('awesome-bar-initialized');
					}

					// Initialize the awesome bar
					window.frappe.ui.toolbar.setup_awesomebar();
				}
			} catch (e) {
				console.warn('[Techcloud] Failed to initialize search:', e);
			}
		}
	}

	function scheduleApply() {
		if (applyTimer) clearTimeout(applyTimer);
		applyTimer = setTimeout(() => {
			requestAnimationFrame(() => {
				applyUnifiedHeader();
			});
		}, 120);
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
						// Watch for sidebar changes
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
			}
		});

		observer.observe(document.body, { 
			childList: true, 
			subtree: true,
			attributes: true,
			attributeFilter: ["style", "class"]
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", scheduleApply);
	} else {
		scheduleApply();
	}

	startObserver();

	if (window.frappe && frappe.router && frappe.router.on) {
		frappe.router.on("change", () => {
			setTimeout(() => {
				scheduleApply();
				ensureSidebarLogo();
			}, 80);
		});
	} else if (window.jQuery) {
		$(document).on("page-change", () => {
			setTimeout(() => {
				scheduleApply();
				ensureSidebarLogo();
			}, 80);
		});
	}

	if (window.jQuery) {
		$(document).on("page-render", () => {
			setTimeout(() => {
				scheduleApply();
				ensureSidebarLogo();
			}, 80);
		});
	}

	if (window.frappe && frappe.after_ajax) {
		frappe.after_ajax(scheduleApply);
	}

	if (window.frappe && frappe.ready) {
		frappe.ready(() => {
			// Ensure unified header + sidebar logo after Frappe boot
			scheduleApply();
			ensureSidebarLogo();
			// Ensure search is initialized after frappe boot
			setTimeout(initializeSearch, 100);
		});
	}
})();
