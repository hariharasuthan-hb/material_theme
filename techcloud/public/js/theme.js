// Techcloud ThemeSwitcher override + User desk_theme option helper.
// This file can be included on both desk and website pages. Guard everything.
(function () {
	"use strict";

	function patchThemeSwitcher() {
		if (!window.frappe || !window.frappe.ui || !window.frappe.ui.ThemeSwitcher) {
			return false;
		}

		// Avoid patching multiple times
		if (window.frappe.ui.ThemeSwitcher.__techcloud_patched) {
			return true;
		}

		const BaseThemeSwitcher = window.frappe.ui.ThemeSwitcher;

		window.frappe.ui.ThemeSwitcher = class TechcloudThemeSwitcher extends BaseThemeSwitcher {
			constructor(...args) {
				super(...args);
			}

			async fetch_themes() {
				// Call parent method first if it exists
				if (super.fetch_themes) {
					await super.fetch_themes();
				}

				// Override with TechCloud themes
				this.themes = [
					{ name: "light", label: "Frappe Light", info: "Light Theme" },
					{ name: "dark", label: "Timeless Night", info: "Dark Theme" },
					{ name: "material", label: "Techcloud", info: "Techcloud ERP Theme by Itrostack LLP" },
					{
						name: "automatic",
						label: "Automatic",
						info: "Uses system's theme to switch between light and dark mode",
					},
				];
				return this.themes;
			}

			show() {
				// Ensure themes are loaded before showming
				return this.fetch_themes().then(() => {
					// Call parent show method
					if (super.show) {
						return super.show();
					} else {
						console.error("TechCloud: Parent show method not found");
					}
				}).catch((error) => {
					console.error("TechCloud: Error in show():", error);
				});
			}

			toggle_theme(theme) {
				return new Promise((resolve, reject) => {
					// Handle techcloud theme specially - map "material" to "Material" for server call
					let server_theme = theme;
					if (theme === "material") {
						server_theme = "Techcloud";  // Use "Techcloud" as expected by the override
					}

					this.current_theme = theme.toLowerCase();

					// Clear any existing theme attributes first
					document.documentElement.removeAttribute("data-theme");
					document.documentElement.removeAttribute("data-theme-mode");

					// Handle TechCloud theme asset injection/removal
					if (theme === "material") {
						// Inject TechCloud assets if not already present
						this.injectTechCloudAssets();
						document.documentElement.setAttribute("data-theme", "material");
						document.documentElement.setAttribute("data-theme-mode", "material");
					} else {
						// Remove TechCloud assets for other themes
						this.removeTechCloudAssets();
						// Clear data-theme for non-TechCloud themes
						document.documentElement.removeAttribute("data-theme");
						if (theme === "dark") {
							document.documentElement.setAttribute("data-theme-mode", "dark");
						} else if (theme === "automatic") {
							document.documentElement.setAttribute("data-theme-mode", "automatic");
						} else {
							// Light theme or any other theme
							document.documentElement.setAttribute("data-theme-mode", theme.toLowerCase());
						}
					}

					// Force immediate CSS re-evaluation before server call
					document.documentElement.style.display = 'none';
					document.documentElement.offsetHeight; // Trigger reflow
					document.documentElement.style.display = '';

					frappe.show_alert(__("Theme Changed"), 3);

					// Call the techcloud override method
					frappe.xcall("frappe.core.doctype.user.user.switch_theme", {
						theme: server_theme.charAt(0).toUpperCase() + server_theme.slice(1), // Title case
					}).then(() => {

						// Additional re-evaluation after server response
						setTimeout(() => {
							// Force another reflow to ensure all CSS changes take effect
							document.documentElement.style.display = 'none';
							document.documentElement.offsetHeight;
							document.documentElement.style.display = '';

							// Trigger frappe's theme setter if available
							if (window.frappe && window.frappe.ui && window.frappe.ui.set_theme) {
								window.frappe.ui.set_theme(theme === "material" ? "material" : theme);
							}

							// Force a complete page style recalculation
							const allStylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
							allStylesheets.forEach(sheet => {
								if (sheet.sheet) {
									try {
										sheet.sheet.disabled = true;
										sheet.sheet.disabled = false;
									} catch (e) {
										// Ignore errors for cross-origin stylesheets
									}
								}
							});

							// Resolve the promise when all operations are complete
							resolve();
						}, 150);
					}).catch((error) => {
						console.error("TechCloud: Server theme switch failed:", error);
						reject(error);
					});
				});
			}

			injectTechCloudAssets() {
				const appName = "techcloud"; // Dynamic app name detection would be better but hardcode for now

				// Inject CSS files if not already present
				const cssFiles = [
					`/assets/${appName}/css/material.css`,
					`/assets/${appName}/css/desk.css`
				];

				cssFiles.forEach(cssPath => {
					if (!document.querySelector(`link[href="${cssPath}"]`)) {
						const link = document.createElement('link');
						link.rel = 'stylesheet';
						link.type = 'text/css';
						link.href = cssPath;
						document.head.appendChild(link);
					}
				});

				// Inject JavaScript files if not already present
				const jsFiles = [
					`/assets/${appName}/js/desk.js`, // TechCloud desk UI enhancements
					`/assets/${appName}/js/fix-highlight.js`,
					`/assets/${appName}/js/material.js`,
					`/assets/${appName}/js/material-theme-customizer.js`,
					`/assets/${appName}/js/dashboard-widget-head-remover.js`,
					`/assets/${appName}/js/techcloud-icons.js`,
					`/assets/${appName}/js/icon-debug.js`,
					`/assets/${appName}/js/techcloud-unified-header.js`,
					`/assets/${appName}/js/techcloud-fixes.js`
				];

				jsFiles.forEach(jsPath => {
					if (!document.querySelector(`script[src="${jsPath}"]`)) {
						const script = document.createElement('script');
						script.src = jsPath;
						document.head.appendChild(script);
					}
				});
			}

			removeTechCloudAssets() {
				const appName = "techcloud";

				// Remove CSS files
				const cssFiles = [
					`/assets/${appName}/css/material.css`,
					`/assets/${appName}/css/desk.css`
				];

				cssFiles.forEach(cssPath => {
					const cssLink = document.querySelector(`link[href="${cssPath}"]`);
					if (cssLink) {
						cssLink.remove();
					}
				});

				// Remove JavaScript files
				const jsFiles = [
					`/assets/${appName}/js/desk.js`, // TechCloud desk UI enhancements
					`/assets/${appName}/js/fix-highlight.js`,
					`/assets/${appName}/js/material.js`,
					`/assets/${appName}/js/material-theme-customizer.js`,
					`/assets/${appName}/js/dashboard-widget-head-remover.js`,
					`/assets/${appName}/js/techcloud-icons.js`,
					`/assets/${appName}/js/icon-debug.js`,
					`/assets/${appName}/js/techcloud-unified-header.js`,
					`/assets/${appName}/js/techcloud-fixes.js`
				];

				jsFiles.forEach(jsPath => {
					const script = document.querySelector(`script[src="${jsPath}"]`);
					if (script) {
						script.remove();
					}
				});
			}
		};

		window.frappe.ui.ThemeSwitcher.__techcloud_patched = true;
		return true;
	}

	function patchUserDeskThemeOptions() {
		if (!window.frappe || !window.frappe.ui || !window.frappe.ui.form || !window.frappe.ui.form.on) return false;

		if (window.__techcloud_user_form_patched) return true;
		window.__techcloud_user_form_patched = true;

		// Dynamically add "Techcloud" option to desk_theme field in User form (no core file changes)
		window.frappe.ui.form.on("User", {
			refresh: function (frm) {
				const field = frm && frm.fields_dict && frm.fields_dict.desk_theme;
				if (!field || !field.df) return;

				const current_options = field.df.options ? String(field.df.options).split("\n") : [];
				// Add "Techcloud" if not present (maps to "material" theme internally)
				if (!current_options.includes("Techcloud")) {
					current_options.push("Techcloud");
					field.df.options = current_options.join("\n");
					field.refresh && field.refresh();
				}
			},
		});

		return true;
	}

	function init() {
		patchThemeSwitcher();
		patchUserDeskThemeOptions();
		try {
			const bootTheme = String(window.frappe?.boot?.desk_theme || "").toLowerCase();
			if (bootTheme === "material" || bootTheme === "techcloud") {
				// Ensure Techcloud assets are present on refresh when theme is active
				const ts = new window.frappe.ui.ThemeSwitcher();
				ts.injectTechCloudAssets();
				document.documentElement.setAttribute("data-theme", "material");
				document.documentElement.setAttribute("data-theme-mode", "material");
			} else if (bootTheme) {
				// Ensure Techcloud assets are removed when another theme is active
				const ts = new window.frappe.ui.ThemeSwitcher();
				ts.removeTechCloudAssets();
			}
		} catch (e) {
			// Ignore init errors
		}
		// No extra logging here by request
	}

	// Global CSS injection for AJAX-loaded content
	function injectGlobalCSS() {
		if (document.querySelector('#techcloud-global-styles')) return;

		const globalStyles = document.createElement('style');
		globalStyles.id = 'techcloud-global-styles';
		globalStyles.textContent = `
			/* ============================= */
			/* COMPREHENSIVE MATERIAL THEME CSS */
			/* ============================= */

			/* Core Theme Attributes */
			html[data-theme="material"],
			html[data-theme-mode="material"] {
				--primary-color: #1976d2;
				--text-color: #1e293b;
				--bg-color: #ffffff;
				--border-color: #e2e8f0;
			}

			/* Icon Colors - Global */
			html[data-theme="material"] .icon,
			html[data-theme-mode="material"] .icon,
			html[data-theme="material"] .es-icon,
			html[data-theme-mode="material"] .es-icon,
			html[data-theme="material"] .techcloud-icon,
			html[data-theme-mode="material"] .techcloud-icon {
				fill: #475569 !important;
				width: 14px !important;
				height: 14px !important;
			}

			html[data-theme="material"] .icon-sm,
			html[data-theme-mode="material"] .icon-sm {
				width: 16px !important;
				height: 16px !important;
			}

			html[data-theme="material"] .icon-xs,
			html[data-theme-mode="material"] .icon-xs {
				width: 12px !important;
				height: 12px !important;
			}

			/* Sidebar Elements */
			html[data-theme="material"] .sidebar-toggle-btn,
			html[data-theme-mode="material"] .sidebar-toggle-btn {
				background: transparent !important;
				border: none !important;
				color: #475569 !important;
			}

			html[data-theme="material"] .standard-sidebar-item,
			html[data-theme-mode="material"] .standard-sidebar-item {
				border-radius: 8px !important;
				margin: 2px 8px !important;
				padding: 8px 12px !important;
			}

			html[data-theme="material"] .standard-sidebar-item.selected,
			html[data-theme-mode="material"] .standard-sidebar-item.selected {
				background: rgba(25, 118, 210, 0.1) !important;
				color: #1976d2 !important;
			}

			/* Button Styles */
			html[data-theme="material"] .btn,
			html[data-theme-mode="material"] .btn {
				border-radius: 8px !important;
				font-weight: 500 !important;
				transition: all 0.2s ease !important;
			}

			html[data-theme="material"] .btn-primary,
			html[data-theme-mode="material"] .btn-primary {
				background: #1976d2 !important;
				border-color: #1976d2 !important;
			}

			html[data-theme="material"] .btn-secondary,
			html[data-theme-mode="material"] .btn-secondary {
				background: #f1f5f9 !important;
				border-color: #e2e8f0 !important;
				color: #475569 !important;
			}

			html[data-theme="material"] .btn-default,
			html[data-theme-mode="material"] .btn-default {
				background: #ffffff !important;
				border: 1px solid #e2e8f0 !important;
				color: #475569 !important;
			}

			html[data-theme="material"] .icon-btn,
			html[data-theme-mode="material"] .icon-btn {
				padding: 6px !important;
				border-radius: 6px !important;
			}

			html[data-theme="material"] .custom-btn-group,
			html[data-theme-mode="material"] .custom-btn-group {
				display: flex !important;
				align-items: center !important;
				gap: 4px !important;
			}

			/* Form Controls */
			html[data-theme="material"] .form-control,
			html[data-theme-mode="material"] .form-control {
				border: 1px solid #e2e8f0 !important;
				border-radius: 8px !important;
				padding: 8px 12px !important;
			}

			html[data-theme="material"] .form-control:focus,
			html[data-theme-mode="material"] .form-control:focus {
				border-color: #1976d2 !important;
				box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
			}

			/* Dropdown Menus */
			html[data-theme="material"] .dropdown-menu,
			html[data-theme-mode="material"] .dropdown-menu {
				border: 1px solid #e2e8f0 !important;
				border-radius: 12px !important;
				box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
				padding: 6px !important;
			}

			html[data-theme="material"] .dropdown-item,
			html[data-theme-mode="material"] .dropdown-item {
				border-radius: 6px !important;
				padding: 6px 10px !important;
				display: flex !important;
				align-items: center !important;
				gap: 8px !important;
			}

			html[data-theme="material"] .menu-item-icon,
			html[data-theme-mode="material"] .menu-item-icon {
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				width: 16px !important;
				flex-shrink: 0 !important;
			}

			html[data-theme="material"] .menu-item-label,
			html[data-theme-mode="material"] .menu-item-label {
				flex: 1 !important;
			}

			html[data-theme="material"] kbd,
			html[data-theme-mode="material"] kbd {
				background: #f1f5f9 !important;
				border: 1px solid #d1d5db !important;
				border-radius: 4px !important;
				padding: 2px 6px !important;
				font-size: 11px !important;
				color: #6b7280 !important;
				margin-left: auto !important;
			}

			/* Page Headers & Actions */
			html[data-theme="material"] .page-head,
			html[data-theme-mode="material"] .page-head {
				border-bottom: 1px solid #e2e8f0 !important;
				padding-bottom: 16px !important;
				margin-bottom: 20px !important;
			}

			html[data-theme="material"] .page-actions,
			html[data-theme-mode="material"] .page-actions {
				display: flex !important;
				justify-content: flex-end !important;
				align-items: center !important;
				gap: 8px !important;
			}

			html[data-theme="material"] .standard-actions,
			html[data-theme-mode="material"] .standard-actions {
				display: flex !important;
				align-items: center !important;
				gap: 6px !important;
			}

			/* Primary Action Button - AJAX Proof Visibility */
			html[data-theme="material"] .primary-action:not(.hide):not(:empty),
			html[data-theme-mode="material"] .primary-action:not(.hide):not(:empty),
			html[data-theme="material"] .page-actions .primary-action:not(.hide):not(:empty),
			html[data-theme-mode="material"] .page-actions .primary-action:not(.hide):not(:empty) {
				display: inline-flex !important;
				visibility: visible !important;
				opacity: 1 !important;
			}

			html[data-theme="material"] .primary-action:not(.hide):has(*),
			html[data-theme-mode="material"] .primary-action:not(.hide):has(*),
			html[data-theme="material"] .primary-action:not(.hide)[data-label],
			html[data-theme-mode="material"] .primary-action:not(.hide)[data-label] {
				display: inline-flex !important;
				visibility: visible !important;
				opacity: 1 !important;
			}

			/* All buttons in page-actions - show when not hidden */
			html[data-theme="material"] .page-actions .btn:not(.hide):not(:empty),
			html[data-theme-mode="material"] .page-actions .btn:not(.hide):not(:empty),
			html[data-theme="material"] .page-actions .btn:not(.hide):has(*),
			html[data-theme-mode="material"] .page-actions .btn:not(.hide):has(*) {
				display: inline-flex !important;
				visibility: visible !important;
				opacity: 1 !important;
			}

			html[data-theme="material"] .custom-actions,
			html[data-theme-mode="material"] .custom-actions {
				margin-right: 8px !important;
			}

			html[data-theme="material"] .menu-btn-group,
			html[data-theme-mode="material"] .menu-btn-group {
				position: relative !important;
			}

			html[data-theme="material"] .actions-btn-group,
			html[data-theme-mode="material"] .actions-btn-group {
				margin-left: 4px !important;
			}

			html[data-theme="material"] .page-icon-group,
			html[data-theme-mode="material"] .page-icon-group {
				margin-right: 8px !important;
			}

			/* Cards and Widgets */
			html[data-theme="material"] .frappe-card,
			html[data-theme-mode="material"] .frappe-card {
				border: 1px solid #e2e8f0 !important;
				border-radius: 12px !important;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
			}

			html[data-theme="material"] .widget,
			html[data-theme-mode="material"] .widget {
				border-radius: 12px !important;
				border: 1px solid #e2e8f0 !important;
				background: #ffffff !important;
			}

			/* Dashboard Widgets - Specific */
			html[data-theme="material"] .dashboard-widget-box .widget-head,
			html[data-theme-mode="material"] .dashboard-widget-box .widget-head {
				display: flex !important;
				align-items: flex-start !important;
				justify-content: space-between !important;
				padding: 12px 16px !important;
				background: #f9fafb !important;
				border-bottom: 1px solid #e5e7eb !important;
			}

			html[data-theme="material"] .dashboard-widget-box .widget-title,
			html[data-theme-mode="material"] .dashboard-widget-box .widget-title {
				font-size: 14px !important;
				font-weight: 600 !important;
				color: #0f172a !important;
				text-transform: uppercase !important;
				letter-spacing: 0.3px !important;
			}

			html[data-theme="material"] .dashboard-widget-box .widget-control .filter-chart,
			html[data-theme="material"] .dashboard-widget-box .widget-control .chart-menu,
			html[data-theme-mode="material"] .dashboard-widget-box .widget-control .filter-chart,
			html[data-theme-mode="material"] .dashboard-widget-box .widget-control .chart-menu {
				width: 32px !important;
				height: 32px !important;
				background: #ffffff !important;
				border: 1px solid #e5e7eb !important;
				border-radius: 8px !important;
			}

			/* Modal Styles */
			html[data-theme="material"] .modal-content,
			html[data-theme-mode="material"] .modal-content {
				border-radius: 16px !important;
				border: none !important;
				box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
			}

			/* Navigation */
			html[data-theme="material"] .navbar,
			html[data-theme-mode="material"] .navbar {
				background: #ffffff !important;
				border-bottom: 1px solid #e2e8f0 !important;
			}

			/* List Items */
			html[data-theme="material"] .list-row-container,
			html[data-theme-mode="material"] .list-row-container {
				border-bottom: 1px solid #f1f5f9 !important;
			}

			html[data-theme="material"] .list-row-container:hover,
			html[data-theme-mode="material"] .list-row-container:hover {
				background: #f8fafc !important;
			}

			/* Saved Filters */
			html[data-theme="material"] .saved-filters:empty,
			html[data-theme-mode="material"] .saved-filters:empty,
			html[data-theme="material"] .saved-filters:not(:has(*)),
			html[data-theme-mode="material"] .saved-filters:not(:has(*)) {
				display: none !important;
			}

			html[data-theme="material"] .saved-filters,
			html[data-theme-mode="material"] .saved-filters {
				margin-top: 12px !important;
				padding: 12px !important;
				background: #f8fafc !important;
				border-radius: 8px !important;
				border: 1px solid #e5e7eb !important;
			}

			/* Global Box Sizing */
			html[data-theme="material"] *,
			html[data-theme-mode="material"] * {
				box-sizing: border-box !important;
			}

			/* Loading States */
			html[data-theme="material"].loading *,
			html[data-theme-mode="material"].loading * {
				pointer-events: none !important;
			}
		`;

		document.head.appendChild(globalStyles);
	}

	// Try immediately, then retry for a few seconds (desk boot timing varies)
	init();
	injectGlobalCSS();

	const t = setInterval(() => {
		init();
		injectGlobalCSS();
		if (patchThemeSwitcher() && patchUserDeskThemeOptions()) clearInterval(t);
	}, 100);
	setTimeout(() => clearInterval(t), 5000);

	// Page change handler to reapply styles
	$(document).on("page_change", function() {
		setTimeout(injectGlobalCSS, 100);
	});

	// Watch for dynamically added elements and apply styles
	const styleObserver = new MutationObserver(function(mutations) {
		let needsStyleUpdate = false;

		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach(function(node) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// Check if added elements need styling
						if (node.matches || node.webkitMatchesSelector) {
							const matches = node.matches || node.webkitMatchesSelector;
							if (matches.call(node, '.sidebar-toggle-btn, .sidebar-menu, .navbar, .dashboard-widget-box, .widget-head')) {
								needsStyleUpdate = true;
							}
						}
						// Check child elements too
						if (node.querySelector && (node.querySelector('.sidebar-toggle-btn, .sidebar-menu, .navbar, .dashboard-widget-box, .widget-head'))) {
							needsStyleUpdate = true;
						}
					}
				});
			}
		});

		if (needsStyleUpdate) {
			setTimeout(injectGlobalCSS, 50);
		}
	});

	// Start observing DOM changes
	if (document.body) {
		styleObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// Also re-run after DOM ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function() {
			init();
			injectGlobalCSS();
			if (document.body) {
				styleObserver.observe(document.body, {
					childList: true,
					subtree: true
				});
			}
		});
	}
})();