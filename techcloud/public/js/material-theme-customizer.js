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
		
		// Check if Material theme is active
		const isMaterialTheme = theme_mode === "material" || 
		                        root.getAttribute("data-theme") === "material" ||
		                        desk_theme === "material";
		
		if (isMaterialTheme) {
			// Ensure data-theme-mode is set correctly
			if (desk_theme === "material" && theme_mode !== "material") {
				root.setAttribute("data-theme", "material");
				root.setAttribute("data-theme-mode", "material");
			}
			
			// Apply saved theme color immediately
			var themeColor = localStorage.getItem("ItrostackThemeColor");
			if(themeColor && typeof applyMaterialTheme === 'function') {
				applyMaterialTheme(themeColor);
			}
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
	
	// Check both data-theme-mode and desk_theme to determine if Material theme is active
	const isMaterialTheme = theme_mode === "material" || 
	                        root.getAttribute("data-theme") === "material" ||
	                        desk_theme === "material";
	
	console.log("Theme check - data-theme-mode:", theme_mode, "desk_theme:", desk_theme, "isMaterial:", isMaterialTheme);
	
	if (!isMaterialTheme) {
		return;
	}
	
	// Ensure data-theme-mode is set correctly if desk_theme is Material
	if (desk_theme === "material" && theme_mode !== "material") {
		root.setAttribute("data-theme", "material");
		root.setAttribute("data-theme-mode", "material");
	}
	
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
			console.error("Material theme functions not loaded. Make sure material.js loads before material-theme-customizer.js");
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
		
		console.log("Material theme color applied:", color);
	} catch (error) {
		console.error("Error applying Material theme color:", error);
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