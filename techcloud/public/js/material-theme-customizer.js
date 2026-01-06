// ============================================
// TECHCLOUD THEME MANAGER - SAFE & CLEAN
// ============================================

frappe.provide("techcloud.theme");

// ============================================
// SINGLE SOURCE OF TRUTH - THEME DETECTION
// ============================================

function isTechcloudTheme() {
    return (
        window.frappe?.boot?.desk_theme?.toLowerCase() === "techcloud"
    );
}

// ============================================
// SAFE THEME APPLICATION - OPT-IN ONLY
// ============================================

function applySavedTheme() {
    // ONLY apply when user has selected Techcloud theme
    if (!isTechcloudTheme()) {
        return; // Do nothing - allow default ERPNext theme to work
    }

    const root = document.documentElement;

    // Apply attributes ONCE (don't force them)
    if (root.getAttribute("data-theme") !== "material") {
        root.setAttribute("data-theme", "material");
    }

    if (root.getAttribute("data-theme-mode") !== "material") {
        root.setAttribute("data-theme-mode", "material");
    }

    // Apply saved theme color if available
    const themeColor = localStorage.getItem("ItrostackThemeColor");
    if (themeColor && typeof applyMaterialTheme === "function") {
        applyMaterialTheme(themeColor);
    }

    console.log("Techcloud theme applied safely");
}

// Make globally available for other scripts
window.applySavedTheme = applySavedTheme;

// ============================================
// INITIALIZATION - RUN ONCE WHEN READY
// ============================================

$(document).ready(function() {
    applySavedTheme();
});

// ============================================
// TOOLBAR MENU - ONLY WHEN TECHCLOUD THEME ACTIVE
// ============================================

$(document).on("toolbar_setup", function () {
    // Only add menu item when Techcloud theme is active
    if (!isTechcloudTheme()) {
        return;
    }

    console.log("Techcloud theme active - adding theme color menu");

    // Apply saved theme color if available
    var themeColor = localStorage.getItem("ItrostackThemeColor");
    if(themeColor && typeof applyMaterialTheme === 'function') {
        applyMaterialTheme(themeColor);
    }

    // Add menu item to toolbar
    render_clear_demo_action();
});

function render_clear_demo_action() {
    let demo_action = $(
        `<a class="dropdown-item" onclick="return techcloud.theme.clear_demo()">
            ${__("Change Theme Color")}
        </a>`
    );

    demo_action.appendTo($("#toolbar-user"));
}

// ============================================
// SAFE MATERIAL THEME COLOR APPLICATION
// ============================================

function applyMaterialTheme(SelectedColor) {
    // ONLY apply when Techcloud theme is active
    if (!isTechcloudTheme()) {
        return; // Exit early if not using Techcloud theme
    }

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
                console.log("Techcloud theme fallback color applied:", SelectedColor);
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

        // Apply the theme to :root (html element) so CSS variables are available globally
        applyTheme(theme, {target: r});

        const color = hexFromArgb(theme.schemes.light.primary);
        localStorage.setItem("ItrostackThemeColor", color);

        // Setting the primary color for frappe (on :root)
        r.style.setProperty('--primary', color);

        console.log("Techcloud theme full color scheme applied:", color);
    } catch (error) {
        console.error("Error applying Techcloud theme color:", error);

        // Fallback on error
        try {
            var r = document.documentElement;
            if (SelectedColor && SelectedColor.startsWith('#')) {
                r.style.setProperty('--primary', SelectedColor);
                localStorage.setItem("ItrostackThemeColor", SelectedColor);
                console.log("Techcloud theme fallback color applied after error:", SelectedColor);
            }
        } catch (fallbackError) {
            console.error("Fallback color application also failed:", fallbackError);
        }
    }
}

// ============================================
// TECHCLOUD DASHBOARD FIXES - SAFE & CLEAN
// ============================================

$(document).on("page_change", function() {
    // Only apply dashboard fixes when on dashboard page AND Techcloud theme active
    if (window.location.pathname.includes('/app/dashboard-view/') && isTechcloudTheme()) {
        // Safe dashboard layout fixes
        requestAnimationFrame(() => {
            document.querySelectorAll(".layout-side-section").forEach(el => {
                el.style.display = "none";
            });
            document.querySelectorAll(".layout-main-section").forEach(el => {
                el.style.width = "100%";
                el.style.maxWidth = "100%";
                el.style.marginRight = "0";
            });
        });

        // Remove widget-group-head elements only for Techcloud theme
        setTimeout(() => {
            $('.widget-group-head').remove();
            $('.widget-group .widget-group-head').remove();
            $('div.widget-group-head').remove();
            console.log('Techcloud Dashboard: Widget headers removed for clean layout');
        }, 100);
    }
});

// ============================================
// THEME COLOR MENU
// ============================================

techcloud.theme.clear_demo = function () {
    var themeColor = localStorage.getItem("ItrostackThemeColor");
    if(!themeColor) {
        themeColor = "#3C6090";
    }

    // Create dialog
    var d = new frappe.ui.Dialog({
        title: "Select Theme Color",
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
};

// ============================================
// TOOLBAR MENU - ONLY WHEN TECHCLOUD THEME ACTIVE
// ============================================

$(document).on("toolbar_setup", function () {
	// Only add menu item when Techcloud theme is active
	if (!isTechcloudTheme()) {
		return;
	}

	console.log("Techcloud theme active - adding theme color menu");

	// Apply saved theme color if available
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
	// ONLY apply Material theme colors when Material theme is active
	const themeMode = document.documentElement.getAttribute("data-theme-mode");
	const theme = document.documentElement.getAttribute("data-theme");
	const isMaterialTheme = themeMode === "material" || theme === "material";

	if (!isMaterialTheme) {
		console.log("Material theme not active, skipping color application");
		return; // Exit early if not using Material theme
	}

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

// Apply dashboard fixes on page load for dashboard pages - ONLY FOR MATERIAL THEME
$(document).ready(function() {
	if (window.location.pathname.includes('/app/dashboard-view/') ||
		window.location.pathname.includes('/app/query-report/') ||
		document.querySelector('.dashboard-section')) {
		// Only apply dashboard fixes for Material theme
		const themeMode = document.documentElement.getAttribute("data-theme-mode");
		const theme = document.documentElement.getAttribute("data-theme");
		if (themeMode === "material" || theme === "material") {
			setTimeout(fixMaterialDashboard, 1000);
		}
	}
});

// Apply fixes when dashboard content changes - ONLY FOR MATERIAL THEME
$(document).on("page_change", function() {
	if (window.location.pathname.includes('/app/dashboard-view/') ||
		window.location.pathname.includes('/app/query-report/') ||
		document.querySelector('.dashboard-section')) {
		// Only apply dashboard fixes for Material theme
		const themeMode = document.documentElement.getAttribute("data-theme-mode");
		const theme = document.documentElement.getAttribute("data-theme");
		if (themeMode === "material" || theme === "material") {
			setTimeout(fixMaterialDashboard, 800);
		}
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
			// Ensure chart legends work after dashboard load - ONLY FOR MATERIAL THEME
			const themeMode = document.documentElement.getAttribute("data-theme-mode");
			const theme = document.documentElement.getAttribute("data-theme");
			if (themeMode === "material" || theme === "material") {
				fixChartLegends();
			}
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

// Apply legend fixes when charts are created/updated - ONLY FOR MATERIAL THEME
$(document).on("chart_rendered", function() {
	// Only apply chart fixes for Material theme
	const themeMode = document.documentElement.getAttribute("data-theme-mode");
	const theme = document.documentElement.getAttribute("data-theme");
	if (themeMode === "material" || theme === "material") {
		fixChartLegends();
	}
});

// Also apply on page changes - ONLY FOR MATERIAL THEME
$(document).on("page_change", function() {
	if (window.location.pathname.includes('/app/dashboard-view/')) {
		// Only apply chart fixes for Material theme
		const themeMode = document.documentElement.getAttribute("data-theme-mode");
		const theme = document.documentElement.getAttribute("data-theme");
		if (themeMode === "material" || theme === "material") {
			setTimeout(fixChartLegends, 1500);
		}
	}
});

// Remove widget-group-head elements from dashboard pages - ONLY FOR MATERIAL THEME
$(document).ready(function() {
    // Check if we're on a dashboard page AND using Material theme
    if (window.location.pathname.includes('/app/dashboard-view/')) {
        // Check current theme
        const themeMode = document.documentElement.getAttribute("data-theme-mode");
        const theme = document.documentElement.getAttribute("data-theme");
        const isMaterialTheme = themeMode === "material" || theme === "material";

        if (isMaterialTheme) {
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
    }
});

// Handle window resize for charts
window.addEventListener("resize", function() {
	document.querySelectorAll("[data-theme='material'] .frappe-chart, [data-theme-mode='material'] .frappe-chart").forEach(el => {
		el.style.height = "300px";
	});
});
