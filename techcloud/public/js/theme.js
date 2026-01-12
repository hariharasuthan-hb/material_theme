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
				console.log("TechcloudThemeSwitcher.toggle_theme called with theme:", theme);

				// Handle techcloud theme specially - map "material" to "Material" for server call
				let server_theme = theme;
				if (theme === "material") {
					server_theme = "Techcloud";  // Use "Techcloud" as expected by the override
				}

				this.current_theme = theme.toLowerCase();

				// Clear any existing theme attributes first
				document.documentElement.removeAttribute("data-theme");
				document.documentElement.removeAttribute("data-theme-mode");

				// Set the appropriate theme attributes based on the selected theme
				if (theme === "material") {
					document.documentElement.setAttribute("data-theme", "material");
					document.documentElement.setAttribute("data-theme-mode", "material");
					console.log("Applied Techcloud theme - set data-theme='material' and data-theme-mode='material'");
				} else if (theme === "dark") {
					document.documentElement.setAttribute("data-theme-mode", "dark");
					console.log("Applied Dark theme - set data-theme-mode='dark'");
				} else if (theme === "automatic") {
					document.documentElement.setAttribute("data-theme-mode", "automatic");
					console.log("Applied Automatic theme - set data-theme-mode='automatic'");
				} else {
					// Light theme or any other theme
					document.documentElement.setAttribute("data-theme-mode", theme.toLowerCase());
					console.log("Applied", theme, "theme - set data-theme-mode='" + theme.toLowerCase() + "'");
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
					console.log("Theme switch server call completed for:", server_theme);

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

						console.log("Enhanced theme re-evaluation completed");
					}, 150);
				}).catch((error) => {
					console.error("Theme switch server call failed:", error);
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