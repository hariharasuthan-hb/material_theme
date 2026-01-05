frappe.provide("material.theme");

// Execute immediately to mark script as "used" (reduces preload warnings)
(function() {
	"use strict";
	
	// Initialize immediately - this marks the script as used
	if (typeof material === 'undefined') {
		window.material = {};
	}
	if (typeof material.theme === 'undefined') {
		window.material.theme = {};
	}
	
	// Apply saved theme color immediately if available
	function applySavedTheme() {
		const root = document.documentElement;
		let theme_mode = root.getAttribute("data-theme-mode");
		
		// Check frappe.boot.desk_theme
		let desk_theme = null;
		if (window.frappe && window.frappe.boot && window.frappe.boot.desk_theme) {
			desk_theme = window.frappe.boot.desk_theme.toLowerCase();
		}
		
		// Check if Material theme is active (accept both "material" and "techcloud")
		const deskThemeLower = desk_theme ? String(desk_theme).toLowerCase() : "";
		const isMaterialTheme = theme_mode === "material" || 
		                        root.getAttribute("data-theme") === "material" ||
		                        deskThemeLower === "material" || deskThemeLower === "techcloud";
		
		if (isMaterialTheme) {
			// Ensure data-theme-mode and data-theme are set correctly
			if (theme_mode !== "material") {
				root.setAttribute("data-theme-mode", "material");
			}
			// Always set data-theme for material theme to ensure CSS selectors work
			root.setAttribute("data-theme", "material");

			console.log("Material theme detected and applied - data-theme-mode:", root.getAttribute("data-theme-mode"), "data-theme:", root.getAttribute("data-theme"));

			// Apply saved theme color immediately (only if functions are available)
			var themeColor = localStorage.getItem("ItrostackThemeColor");
			if(themeColor && typeof applyMaterialTheme === 'function') {
				try {
					applyMaterialTheme(themeColor);
					console.log("Material theme color applied:", themeColor);
				} catch (error) {
					console.warn("Failed to apply material theme color:", error);
				}
			} else if (themeColor) {
				console.warn("Material theme color found but applyMaterialTheme function not available");
			}
		} else {
			// CRITICAL: When NOT using material theme, ensure ALL material theme attributes are removed
			root.removeAttribute("data-theme");

			// Also remove any material theme CSS variables that might interfere
			const materialVars = [
				'--md-sys-color-primary',
				'--md-sys-color-primary-container',
				'--md-sys-color-secondary',
				'--md-sys-color-surface',
				'--md-sys-color-background'
			];

			materialVars.forEach(varName => {
				root.style.removeProperty(varName);
			});

			console.log("Non-material theme detected, cleaned up all material theme attributes and CSS variables");

			// Force immediate style recalculation
			setTimeout(() => {
				document.documentElement.style.display = 'none';
				document.documentElement.offsetHeight;
				document.documentElement.style.display = '';
			}, 10);
		}
	}
	
	// Run immediately if DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applySavedTheme);
	} else {
		applySavedTheme();
	}
	
	// Also run when frappe.boot is available
	if (window.frappe && window.frappe.boot) {
		applySavedTheme();
	} else {
		const checkBoot = setInterval(function() {
			if (window.frappe && window.frappe.boot) {
				applySavedTheme();
				clearInterval(checkBoot);
			}
		}, 10);
		setTimeout(function() { clearInterval(checkBoot); }, 5000);
	}
})();

// Enhanced theme change detection and handling
$(document).on("theme_change", function() {
	console.log("Theme change detected, checking material theme status");
	applySavedTheme();
});

// Also listen for attribute changes on the document element
const themeObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type === 'attributes' &&
			(mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
			console.log("Theme attribute changed:", mutation.attributeName, "to:", mutation.target.getAttribute(mutation.attributeName));
			setTimeout(applySavedTheme, 50); // Small delay to allow other theme handlers to complete
		}
	});
});

themeObserver.observe(document.documentElement, {
	attributes: true,
	attributeFilter: ['data-theme', 'data-theme-mode']
});

// Wait for toolbar_setup to add the menu item
$(document).on("toolbar_setup", function () {
	const root = document.documentElement;
	let theme_mode = root.getAttribute("data-theme-mode");
	
	// Also check frappe.boot.desk_theme directly, as Frappe's theme switcher
	// might set data-theme-mode to "standard" even when desk_theme is "Material"
	let desk_theme = null;
	if (window.frappe && window.frappe.boot && window.frappe.boot.desk_theme) {
		desk_theme = window.frappe.boot.desk_theme.toLowerCase();
	}
	
	// Check both data-theme-mode and desk_theme to determine if Material theme is active (accept both "material" and "techcloud")
	const deskThemeLower = desk_theme ? String(desk_theme).toLowerCase() : "";
	const isMaterialTheme = theme_mode === "material" || 
	                        root.getAttribute("data-theme") === "material" ||
	                        deskThemeLower === "material" || deskThemeLower === "techcloud";
	
	console.log("Theme check - data-theme-mode:", theme_mode, "desk_theme:", desk_theme, "isMaterial:", isMaterialTheme);
	
	if (!isMaterialTheme) {
		return;
	}
	
	// Ensure data-theme-mode and data-theme are set correctly
	if (theme_mode !== "material") {
		root.setAttribute("data-theme-mode", "material");
	}
	// Always set data-theme for material theme to ensure CSS selectors work
	root.setAttribute("data-theme", "material");
	
	// Apply saved theme color (if not already applied)
	var themeColor = localStorage.getItem("ItrostackThemeColor");
	if(themeColor && typeof applyMaterialTheme === 'function') {
		applyMaterialTheme(themeColor);
	}
	
	// Add menu item to toolbar
	render_clear_demo_action();

});

function render_clear_demo_action() {
	let demo_action = $(
		`<a class="dropdown-item" onclick="return material.theme.clear_demo()">
			${__("Change Theme Color")}
		</a>`
	);

	demo_action.appendTo($("#toolbar-user"));
	// initThemeCustomizer();
}

function applyMaterialTheme(SelectedColor)
{
	try {
		// Check if required functions are available
		if (typeof themeFromSourceColor === 'undefined' ||
		    typeof argbFromHex === 'undefined' ||
		    typeof applyTheme === 'undefined' ||
		    typeof hexFromArgb === 'undefined') {
			console.warn("Material theme dynamic color functions not available. Using fallback primary color only.");

			// Fallback: just set the primary color CSS variable
			var r = document.documentElement;
			if (SelectedColor && SelectedColor.startsWith('#')) {
				r.style.setProperty('--primary', SelectedColor);
				localStorage.setItem("ItrostackThemeColor", SelectedColor);
				console.log("Material theme fallback color applied:", SelectedColor);
			}
			return;
		}

		var r = document.documentElement; // Use :root (html element)
	const theme = themeFromSourceColor(argbFromHex(SelectedColor), [
		{
		  name: "custom-1",
		  value: argbFromHex(SelectedColor),
		  blend: true,
		},
	  ]);

	// Check if the user has dark mode turned on
	const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		// Apply the theme to :root (html element) so CSS variables are available globally
		applyTheme(theme, {target: r});

		// Also apply to body for compatibility
	applyTheme(theme, {target: document.body});

	const color = hexFromArgb(theme.schemes.light.primary);
	localStorage.setItem("ItrostackThemeColor", color);

		// Setting the primary color for frappe (on :root)
	r.style.setProperty('--primary', color);

		console.log("Material theme full color scheme applied:", color);
	} catch (error) {
		console.error("Error applying Material theme color:", error);

		// Fallback on error
		try {
			var r = document.documentElement;
			if (SelectedColor && SelectedColor.startsWith('#')) {
				r.style.setProperty('--primary', SelectedColor);
				localStorage.setItem("ItrostackThemeColor", SelectedColor);
				console.log("Material theme fallback color applied after error:", SelectedColor);
			}
		} catch (fallbackError) {
			console.error("Fallback color application also failed:", fallbackError);
		}
	}
}

material.theme.clear_demo = function () {
	var themeColor = localStorage.getItem("ItrostackThemeColor");
	if(!themeColor)
		themeColor = "#3C6090";
	// new dialog
	var d = new frappe.ui.Dialog({
		title: "Select Color",
		fields: [
			{
				label: __("Theme color"),
				fieldname: "Color",
				fieldtype: "Color",
				default: themeColor,
			},
		],
	});



	d.set_primary_action(__("Set Color"), function () {
		applyMaterialTheme(d.get_value('Color'));
		d.hide();
	});

	d.show();
}