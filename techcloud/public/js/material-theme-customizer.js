frappe.provide("material.theme");

// Make applySavedTheme globally available immediately
window.applySavedTheme = null;

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
		// Make function globally accessible
		window.applySavedTheme = applySavedTheme;
		if (window.frappe && frappe.material && frappe.material.theme) {
			frappe.material.theme.applySavedTheme = applySavedTheme;
		}
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

	// Special handling for dashboard pages
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		// Force theme application on dashboard pages
		const forceDashboardTheme = setInterval(function() {
			const root = document.documentElement;
			let theme_mode = root.getAttribute("data-theme-mode");
			let desk_theme = null;

			if (window.frappe && window.frappe.boot && window.frappe.boot.desk_theme) {
				desk_theme = window.frappe.boot.desk_theme.toLowerCase();
			}

			const deskThemeLower = desk_theme ? String(desk_theme).toLowerCase() : "";
			const isMaterialTheme = theme_mode === "material" ||
			                        root.getAttribute("data-theme") === "material" ||
			                        deskThemeLower === "material" || deskThemeLower === "techcloud";

			if (isMaterialTheme) {
				if (theme_mode !== "material") {
					root.setAttribute("data-theme-mode", "material");
				}
				root.setAttribute("data-theme", "material");
				console.log("Dashboard page: Material theme forced - data-theme-mode:", root.getAttribute("data-theme-mode"), "data-theme:", root.getAttribute("data-theme"));
				clearInterval(forceDashboardTheme);
			}
		}, 100);

		setTimeout(function() { clearInterval(forceDashboardTheme); }, 10000);
	}
})();

// Enhanced theme change detection and handling
$(document).on("theme_change", function() {
	console.log("Theme change detected, checking material theme status");
	if (window.applySavedTheme && typeof window.applySavedTheme === 'function') {
		window.applySavedTheme();
	} else {
		console.warn("applySavedTheme function not available");
	}
});

// Also listen for attribute changes on the document element
const themeObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type === 'attributes' &&
			(mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-theme-mode')) {
			console.log("Theme attribute changed:", mutation.attributeName, "to:", mutation.target.getAttribute(mutation.attributeName));
			setTimeout(function() {
				if (window.applySavedTheme && typeof window.applySavedTheme === 'function') {
					window.applySavedTheme();
				} else {
					console.warn("applySavedTheme function not available in mutation observer");
				}
			}, 50); // Small delay to allow other theme handlers to complete
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

// Additional check for dashboard-view pages specifically
$(document).on("page_change", function() {
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		// Immediate check when page changes
		setTimeout(function() {
			const root = document.documentElement;
			let theme_mode = root.getAttribute("data-theme-mode");
			let desk_theme = null;

			if (window.frappe && window.frappe.boot && window.frappe.boot.desk_theme) {
				desk_theme = window.frappe.boot.desk_theme.toLowerCase();
			}

			const deskThemeLower = desk_theme ? String(desk_theme).toLowerCase() : "";
			const isMaterialTheme = theme_mode === "material" ||
			                        root.getAttribute("data-theme") === "material" ||
			                        deskThemeLower === "material" || deskThemeLower === "techcloud";

			if (isMaterialTheme) {
				if (theme_mode !== "material") {
					root.setAttribute("data-theme-mode", "material");
				}
				root.setAttribute("data-theme", "material");
				console.log("Dashboard page loaded: Material theme ensured - data-theme-mode:", root.getAttribute("data-theme-mode"), "data-theme:", root.getAttribute("data-theme"));
			}
		}, 100); // Quick check

		// Additional check with longer delay
		setTimeout(function() {
			if (window.applySavedTheme && typeof window.applySavedTheme === 'function') {
				window.applySavedTheme();
			}
		}, 1000); // Ensure theme color is applied
	}
});

// Also check on DOM ready for dashboard pages
$(document).ready(function() {
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		setTimeout(function() {
			if (window.applySavedTheme && typeof window.applySavedTheme === 'function') {
				window.applySavedTheme();
			}
		}, 200);
	}
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

// ============================================
// DASHBOARD FIXES FOR MATERIAL THEME
// Force dashboard redraw and chart rendering
// ============================================
function fixMaterialDashboard() {
	try {
		// Force dashboard refresh after theme application
		setTimeout(() => {
			if (window.frappe?.dashboard?.dashboard) {
				frappe.dashboard.dashboard.refresh();
			}

			// Force chart heights for all frappe-chart elements
			document.querySelectorAll(".frappe-chart").forEach(el => {
				el.style.height = "300px";
			});

			// Fix chart containers that might be stuck in loading
			document.querySelectorAll("[data-theme='material'] .dashboard-chart, [data-theme-mode='material'] .dashboard-chart").forEach(el => {
				el.style.height = "300px";
				el.style.position = "relative";
			});

			console.log("Material theme dashboard fixes applied");
		}, 600);

		// Additional fix for charts that load later
		setTimeout(() => {
			document.querySelectorAll(".frappe-chart").forEach(el => {
				el.style.height = "300px";
			});
		}, 2000);

	} catch (error) {
		console.warn("Dashboard fixes failed:", error);
	}
}

// Apply dashboard fixes when theme is applied
const originalApplyMaterialTheme = applyMaterialTheme;
applyMaterialTheme = function(SelectedColor) {
	originalApplyMaterialTheme.call(this, SelectedColor);
	fixMaterialDashboard();
};

// Apply dashboard fixes on page load for dashboard pages
$(document).ready(function() {
	if (window.location.pathname.includes('/app/dashboard-view/') ||
		window.location.pathname.includes('/app/query-report/') ||
		document.querySelector('.dashboard-section')) {
		setTimeout(fixMaterialDashboard, 1000);
	}
});

// Apply fixes when dashboard content changes
$(document).on("page_change", function() {
	if (window.location.pathname.includes('/app/dashboard-view/') ||
		window.location.pathname.includes('/app/query-report/') ||
		document.querySelector('.dashboard-section')) {
		setTimeout(fixMaterialDashboard, 800);
	}
});

// ============================================
// OPTIONAL: Force dashboard refresh after CSS settles
// Helps charts calculate width correctly
// ============================================
$(document).ready(function() {
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		setTimeout(() => {
			if (frappe.dashboard && frappe.dashboard.dashboard) {
				frappe.dashboard.dashboard.refresh();
			}
			// Ensure chart legends work after dashboard load
			fixChartLegends();
		}, 500);
	}
});

// ============================================
// FIX CHART LEGENDS - Ensure Clickability
// ============================================
function fixChartLegends() {
	try {
		// Wait for charts to render
		setTimeout(() => {
			document.querySelectorAll('.frappe-chart').forEach(chart => {
				// Ensure legend elements are clickable and visible
				const legendItems = chart.querySelectorAll('.chart-legend-item, .legend-item, [class*="legend"]');
				legendItems.forEach(item => {
					item.style.pointerEvents = 'auto';
					item.style.cursor = 'pointer';

					// Ensure text visibility
					const texts = item.querySelectorAll('text');
					texts.forEach(text => {
						text.style.fill = '#1f2937';
						text.style.fontWeight = '500';
						text.style.fontSize = '12px';
					});

					// Re-bind click events if needed
					if (!item.hasAttribute('data-legend-fixed')) {
						item.setAttribute('data-legend-fixed', 'true');

						// Add visual feedback for legend items
						item.addEventListener('mouseenter', function() {
							const texts = this.querySelectorAll('text');
							texts.forEach(text => {
								text.style.fill = '#3b82f6';
								text.style.fontWeight = '600';
							});
						});

						item.addEventListener('mouseleave', function() {
							const texts = this.querySelectorAll('text');
							texts.forEach(text => {
								text.style.fill = '#1f2937';
								text.style.fontWeight = '500';
							});
						});
					}
				});

				// Fix chart legend container visibility
				const legendContainer = chart.querySelector('.chart-legend, .legend');
				if (legendContainer) {
					legendContainer.style.fill = '#1f2937';
					legendContainer.style.fontWeight = '500';
				}

				// Ensure chart SVG/Canvas allows interactions
				const svg = chart.querySelector('svg');
				const canvas = chart.querySelector('canvas');

				if (svg) {
					svg.style.pointerEvents = 'auto';
				}
				if (canvas) {
					canvas.style.pointerEvents = 'auto';
				}

				// Force chart to re-render legends if needed
				if (chart.chart && typeof chart.chart.update === 'function') {
					try {
						chart.chart.update();
					} catch (e) {
						console.warn('Chart update failed:', e);
					}
				}
			});
		}, 1000);

		console.log("Chart legends fixed for Material theme");
	} catch (error) {
		console.warn("Chart legends fix failed:", error);
	}
}

// Apply legend fixes when charts are created/updated
$(document).on("chart_rendered", function() {
	fixChartLegends();
});

// Also apply on page changes
$(document).on("page_change", function() {
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		setTimeout(fixChartLegends, 1500);
	}
});

// Remove widget-group-head elements from dashboard pages
$(document).ready(function() {
    // Check if we're on a dashboard page
    if (window.location.pathname.includes('/app/dashboard-view/')) {
        // Function to remove widget-group-head elements
        function removeWidgetGroupHeads() {
            // Remove all widget-group-head elements
            $('.widget-group-head').remove();
            $('.widget-group .widget-group-head').remove();
            $('div.widget-group-head').remove();

            // Also try to hide any remaining ones
            $('.widget-group-head').hide();
            $('.widget-group .widget-group-head').hide();

            console.log('Dashboard: Removed widget-group-head elements for full width layout');
        }

        // Remove immediately
        removeWidgetGroupHeads();

        // Remove again after a short delay (for dynamically loaded content)
        setTimeout(removeWidgetGroupHeads, 100);
        setTimeout(removeWidgetGroupHeads, 500);
        setTimeout(removeWidgetGroupHeads, 1000);

        // Use MutationObserver to watch for dynamically added elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any widget-group-head was added
                    const hasWidgetGroupHead = Array.from(mutation.addedNodes).some(node => {
                        return node.nodeType === 1 && (
                            node.classList.contains('widget-group-head') ||
                            node.querySelector('.widget-group-head')
                        );
                    });

                    if (hasWidgetGroupHead) {
                        console.log('Dashboard: Detected new widget-group-head, removing...');
                        setTimeout(removeWidgetGroupHeads, 50);
                    }
                }
            });
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also observe dashboard container if it exists
        const dashboardContainer = document.querySelector('.dashboard');
        if (dashboardContainer) {
            observer.observe(dashboardContainer, {
                childList: true,
                subtree: true
            });
        }
    }
});

// Handle window resize for charts
window.addEventListener("resize", function() {
	document.querySelectorAll("[data-theme='material'] .frappe-chart, [data-theme-mode='material'] .frappe-chart").forEach(el => {
		el.style.height = "300px";
	});
});
