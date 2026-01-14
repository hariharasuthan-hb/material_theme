// Techcloud ThemeSwitcher override + User desk_theme option helper.
// This file can be included on both desk and website pages. Guard everything.
(function () {
	"use strict";

	function patchThemeSwitcher() {
		if (!window.frappe || !window.frappe.ui || !window.frappe.ui.ThemeSwitcher) return false;

		// Avoid patching multiple times
		if (window.frappe.ui.ThemeSwitcher.__techcloud_patched) return true;

		const BaseThemeSwitcher = window.frappe.ui.ThemeSwitcher;

		window.frappe.ui.ThemeSwitcher = class TechcloudThemeSwitcher extends BaseThemeSwitcher {
			fetch_themes() {
				return new Promise((resolve) => {
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
					resolve(this.themes);
				});
			}

			toggle_theme(theme) {

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

					}, 150);
				}).catch((error) => {
					console.error("Theme switch server call failed:", error);
				});
			}

			injectTechCloudAssets() {
				const appName = "techcloud"; // Dynamic app name detection would be better but hardcode for now

				// Inject CSS if not already present
				const cssPath = `/assets/${appName}/css/material.css`;
				if (!document.querySelector(`link[href="${cssPath}"]`)) {
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.type = 'text/css';
					link.href = cssPath;
					document.head.appendChild(link);
				}

				// Inject JavaScript files if not already present
				const jsFiles = [
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

				// Remove CSS
				const cssLink = document.querySelector(`link[href="/assets/${appName}/css/material.css"]`);
				if (cssLink) {
					cssLink.remove();
				}

				// Remove JavaScript files
				const jsFiles = [
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

	// Try immediately, then retry for a few seconds (desk boot timing varies)
	init();
	const t = setInterval(() => {
		init();
		if (patchThemeSwitcher() && patchUserDeskThemeOptions()) clearInterval(t);
	}, 100);
	setTimeout(() => clearInterval(t), 5000);

	// Also re-run after DOM ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	}
})();