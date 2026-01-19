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
			scope.querySelector(".layout-main-section")
		);
	}

	function removeDefaultHeaders(scope) {
		const selectors = [
			"header.navbar",
			".navbar.navbar-expand",
			".page-head",
			".page-header-container",
			".navbar-header"
		];
		selectors.forEach((selector) => {
			(scope || document).querySelectorAll(selector).forEach((el) => {
				if (el.closest(".unified-sticky-header")) return;
				if (el.parentElement) el.parentElement.removeChild(el);
			});
		});
	}

	function buildUnifiedHeader() {
		return `
<div class="unified-sticky-header">
  <header class="navbar navbar-expand" role="navigation">
    <div class="container" style="margin: 0px; position: relative; z-index: 1;">
      <ul class="nav navbar-nav d-none d-sm-flex" id="navbar-breadcrumbs">
        <li><a href="/app/stock">Stock</a></li>
        <li><a href="/app/item-group/view/List">Item Group</a></li>
      </ul>
      <div class="collapse navbar-collapse justify-content-end">
        <form class="form-inline fill-width justify-content-end" role="search" onsubmit="return false;">
          <div class="input-group search-bar text-muted">
            <div class="awesomplete">
              <input id="navbar-search" type="text" class="form-control" placeholder="Search or type a command (⌘ + G)" aria-haspopup="true" autocomplete="off" aria-expanded="false" aria-owns="awesomplete_list_1" role="combobox">
              <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
              <span class="visually-hidden" role="status" aria-live="assertive" aria-atomic="true">Begin typing for results.</span>
            </div>
            <span class="search-icon">
              <svg class="icon icon-sm techcloud-icon"><use href="#icon-search"></use></svg>
            </span>
          </div>
        </form>
        <ul class="navbar-nav">
          <li class="nav-item dropdown dropdown-notifications dropdown-mobile">
            <button class="btn-reset nav-link notifications-icon text-muted" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="" data-original-title="Notifications">
              <span class="notifications-seen">
                <span class="sr-only">No new notifications</span>
                <svg class="es-icon icon-sm" style="stroke:none;"><use href="#es-line-notifications"></use></svg>
              </span>
              <span class="notifications-unseen">
                <span class="sr-only">You have unseen notifications</span>
                <svg class="es-icon icon-sm"><use href="#es-line-notifications-unseen"></use></svg>
              </span>
            </button>
            <div class="dropdown-menu notifications-list dropdown-menu-right" role="menu">
              <div class="notification-list-header">
                <div class="header-items">
                  <ul class="notification-item-tabs nav nav-tabs" role="tablist">
                    <li class="notifications-category active" id="notifications" data-toggle="collapse">Notifications</li>
                    <li class="notifications-category" id="todays_events" data-toggle="collapse">Events</li>
                    <li class="notifications-category" id="changelog_feed" data-toggle="collapse">What's New</li>
                  </ul>
                </div>
                <div class="header-actions">
                  <span class="notification-settings pull-right" data-action="go_to_settings" title="" data-original-title="Notification Settings">
                    <svg class="icon icon-sm techcloud-icon" aria-hidden="true"><use href="#icon-setting-gear"></use></svg>
                  </span>
                  <span class="mark-all-read pull-right" data-action="mark_all_as_read" title="" data-original-title="Mark all as read">
                    <svg class="icon icon-sm techcloud-icon" aria-hidden="true"><use href="#icon-mark-as-read"></use></svg>
                  </span>
                </div>
              </div>
              <div class="notification-list-body">
                <div class="panel-notifications">
                  <div>
                    <div class="notification-null-state">
                      <div class="text-center">
                        <img src="/assets/frappe/images/ui-states/notification-empty-state.svg" alt="Generic Empty State" class="null-state">
                        <div class="title">No New notifications</div>
                        <div class="subtitle">Looks like you haven’t received any notifications.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel-events">
                  <div style="display: none;">
                    <div class="notification-null-state">
                      <div class="text-center">
                        <img src="/assets/frappe/images/ui-states/event-empty-state.svg" alt="Generic Empty State" class="null-state">
                        <div class="title">No Upcoming Events</div>
                        <div class="subtitle">There are no upcoming events for you.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel-changelog-feed">
                  <div style="display: none;">
                    <div class="notification-null-state">
                      <div class="text-center">
                        <img src="/assets/frappe/images/ui-states/notification-empty-state.svg" alt="Generic Empty State" class="null-state">
                        <div class="title">Nothing New</div>
                        <div class="subtitle">There is nothing new to show you right now.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown dropdown-message dropdown-mobile hidden">
            <button class="btn-reset nav-link notifications-icon text-muted" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span><svg class="es-icon icon-sm"><use href="#es-line-chat-alt"></use></svg></span>
            </button>
          </li>
          <li class="vertical-bar d-none d-sm-block"></li>
          <li class="nav-item dropdown dropdown-help dropdown-mobile d-none d-lg-block">
            <button class="btn-reset nav-link" data-toggle="dropdown" aria-controls="toolbar-help" aria-label="Help Dropdown">
              <span>Help <svg class="es-icon icon-xs"><use href="#es-line-down"></use></svg></span>
            </button>
            <div class="dropdown-menu dropdown-menu-right" id="toolbar-help" role="menu">
              <div id="help-links"></div>
              <div class="dropdown-divider documentation-links" style="display: none;"></div>
              <a class="dropdown-item" href="https://docs.erpnext.com/">Documentation</a>
              <a class="dropdown-item" href="https://discuss.frappe.io">User Forum</a>
              <a class="dropdown-item" href="https://frappe.io/school?utm_source=in_app">Frappe School</a>
              <a class="dropdown-item" href="https://github.com/frappe/erpnext/issues">Report an Issue</a>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.show_about()">About</button>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.show_shortcuts(event)">Keyboard Shortcuts</button>
              <a class="dropdown-item" href="https://frappe.io/support">Frappe Support</a>
            </div>
          </li>
          <li class="nav-item dropdown dropdown-navbar-user dropdown-mobile">
            <button class="btn-reset nav-link" data-toggle="dropdown" aria-label="User Menu">
              <span class="avatar avatar-medium" title="hari">
                <div class="avatar-frame standard-image" style="background-color: var(--red-avatar-bg); color: var(--red-avatar-color)" title="hari">h</div>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-right" id="toolbar-user" role="menu">
              <a class="dropdown-item" href="/app/user-profile">My Profile</a>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.route_to_user()">My Settings</button>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.setup_session_defaults()">Session Defaults</button>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.clear_cache()">Reload</button>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.view_website()">View Website</button>
              <a class="dropdown-item" href="/apps">Apps</a>
              <button class="btn-reset dropdown-item" onclick="return frappe.ui.toolbar.toggle_full_width()">Toggle Full Width</button>
              <button class="btn-reset dropdown-item" onclick="return new frappe.ui.ThemeSwitcher().show()">Toggle Theme</button>
              <div class="dropdown-divider"></div>
              <button class="btn-reset dropdown-item" onclick="return frappe.app.logout()">Log out</button>
              <a class="dropdown-item" onclick="return erpnext.demo.clear_demo()">Clear Demo Data</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</div>
		`.trim();
	}

	function insertUnifiedHeader(scope) {
		const mainSection = getLayoutMain(scope);
		if (!mainSection) return false;

		if (mainSection.querySelector(".unified-sticky-header")) return true;

		const wrapper = document.createElement("div");
		wrapper.innerHTML = buildUnifiedHeader();
		const headerEl = wrapper.firstElementChild;
		if (!headerEl) return false;

		mainSection.prepend(headerEl);
		const pageHeadContent = (scope || document).querySelector(".page-head-content");
		const pageHead = pageHeadContent
			? pageHeadContent.closest(".page-head")
			: (scope || document).querySelector(".page-head");
		const headerContainer = pageHeadContent && pageHeadContent.closest(".container");
		if (pageHead) {
			pageHead.setAttribute("data-techcloud-header", "1");
			if (!headerEl.contains(pageHead)) {
				headerEl.appendChild(pageHead);
			}
			if (headerContainer && !headerContainer.classList.contains("page-header-container")) {
				headerContainer.classList.add("page-header-container");
			}
			return "moved";
		}
		return "inserted";
	}

	function ensureSidebarLogo() {
		const sidebar = document.querySelector(".layout-side-section");
		if (!sidebar) {
			console.log("[Techcloud] Sidebar not found");
			return false;
		}

		// Check if sidebar is visible
		const computedStyle = window.getComputedStyle(sidebar);
		if (computedStyle.display === "none") {
			console.log("[Techcloud] Sidebar is hidden, skipping logo insertion");
			return false;
		}

		// Completely remove the "Navigate to main content" button from DOM
		const skipLink = sidebar.querySelector('button.sr-only.sr-only-focusable');
		if (skipLink && skipLink.parentElement) {
			skipLink.parentElement.removeChild(skipLink);
		}

		// Remove any existing techcloud sidebar logo to avoid duplicates
		const existingLogo = sidebar.querySelector(".navbar-brand.techcloud-sidebar-logo");
		if (existingLogo && existingLogo.parentElement) {
			existingLogo.parentElement.removeChild(existingLogo);
		}

		// Find the list-sidebar container (the visible sidebar wrapper)
		const listSidebar = sidebar.querySelector(".list-sidebar");
		if (!listSidebar) {
			console.log("[Techcloud] list-sidebar not found");
			return false;
		}

		// Check if logo already exists
		if (listSidebar.querySelector(".techcloud-sidebar-logo")) {
			console.log("[Techcloud] Logo already exists in sidebar");
			return true;
		}

		// Find the original navbar-brand logo
		const originalLogo = document.querySelector(".sticky-top .navbar-brand, header.navbar .navbar-brand, .unified-sticky-header .navbar-brand");
		let logoElement = null;

		if (originalLogo && originalLogo.querySelector(".app-logo")) {
			// Clone the logo element
			logoElement = originalLogo.cloneNode(true);
			logoElement.classList.add("techcloud-sidebar-logo");
			// Remove any classes that might hide it
			logoElement.classList.remove("d-none", "hidden");
			logoElement.style.display = "";
			logoElement.style.visibility = "";
		} else {
			// Create a new logo element if not found
			logoElement = document.createElement("a");
			logoElement.className = "navbar-brand navbar-home techcloud-sidebar-logo";
			logoElement.href = "/app";
			const logoImg = document.createElement("img");
			logoImg.className = "app-logo";
			logoImg.src = (window.frappe && frappe.boot && frappe.boot.app_logo_url) || "/assets/erpnext/images/erpnext-logo.svg";
			logoImg.alt = "App Logo";
			logoElement.appendChild(logoImg);
		}

		// Ensure logo is visible
		logoElement.style.display = "block";
		logoElement.style.visibility = "visible";
		logoElement.style.opacity = "1";

		// Insert logo at the very beginning of list-sidebar, before everything else
		if (listSidebar.firstChild) {
			listSidebar.insertBefore(logoElement, listSidebar.firstChild);
		} else {
			listSidebar.appendChild(logoElement);
		}

		console.log("[Techcloud] Logo inserted into sidebar:", logoElement);
		return true;
	}

	function applyUnifiedHeader() {
		if (!document.body) return;
		const pageContainer = getActivePageContainer();
		const scope = pageContainer || document;
		const result = insertUnifiedHeader(scope);
		if (!result) return;
		if (result === "moved") {
			removeDefaultHeaders(scope);
		}
		bindThemeToggle(scope);
		initDropdowns(scope);
		ensureSidebarLogo();
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

	function scheduleApply() {
		if (applyTimer) clearTimeout(applyTimer);
		applyTimer = setTimeout(() => {
			requestAnimationFrame(() => {
				applyUnifiedHeader();
				ensureSidebarLogo();
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
						if (node.matches(".sticky-top") || node.querySelector(".sticky-top")) {
							removeDefaultHeaders(document);
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
		frappe.router.on("change", scheduleApply);
	} else if (window.jQuery) {
		$(document).on("page-change", scheduleApply);
	}

	if (window.jQuery) {
		$(document).on("page-render", scheduleApply);
	}

	if (window.frappe && frappe.after_ajax) {
		frappe.after_ajax(scheduleApply);
	}

	// Periodic check to ensure sidebar logo is always present (catches edge cases)
	setInterval(() => {
		const sidebar = document.querySelector(".layout-side-section");
		if (sidebar) {
			const computedStyle = window.getComputedStyle(sidebar);
			// Only ensure logo if sidebar is visible
			if (computedStyle.display !== "none" && computedStyle.visibility !== "hidden") {
				const listSidebar = sidebar.querySelector(".list-sidebar");
				if (listSidebar) {
					const logo = listSidebar.querySelector(".techcloud-sidebar-logo");
					if (!logo) {
						console.log("[Techcloud] Logo missing, re-adding...");
						ensureSidebarLogo();
					} else {
						// Ensure logo is visible
						const logoStyle = window.getComputedStyle(logo);
						if (logoStyle.display === "none" || logoStyle.visibility === "hidden") {
							console.log("[Techcloud] Logo hidden, making visible...");
							logo.style.display = "block";
							logo.style.visibility = "visible";
							logo.style.opacity = "1";
						}
					}
				}
			}
		}
	}, 1000);
})();
