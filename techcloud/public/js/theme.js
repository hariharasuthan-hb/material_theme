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
						{ name: "material", label: "Material by Itrostack", info: "Theme By Itrostack LLP" },
						{
							name: "automatic",
							label: "Automatic",
							info: "Uses system's theme to switch between light and dark mode",
						},
					];
					resolve(this.themes);
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

		// Dynamically add "Material" option to desk_theme field in User form (no core file changes)
		window.frappe.ui.form.on("User", {
			refresh: function (frm) {
				const field = frm && frm.fields_dict && frm.fields_dict.desk_theme;
				if (!field || !field.df) return;

				const current_options = field.df.options ? String(field.df.options).split("\n") : [];
				if (!current_options.includes("Material")) {
					current_options.push("Material");
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