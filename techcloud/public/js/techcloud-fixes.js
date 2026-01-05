// Techcloud Theme Fixes
// This file patches core Frappe functionality to fix issues specific to Techcloud theme
// All fixes are self-contained and don't modify core files

(function() {
	"use strict";

	// ============================================
	// Fix 1: BaseChart Color Warning
	// Patches frappe.Chart to filter out empty color strings before passing to chart library
	// ============================================
	function patchChartColorValidation() {
		// Wait for frappe.Chart to be available
		if (!window.frappe || !frappe.Chart) {
			setTimeout(patchChartColorValidation, 100);
			return;
		}

		// Check if already patched
		if (frappe.Chart.__techcloud_color_patched) return;
		frappe.Chart.__techcloud_color_patched = true;

		// Store original Chart class
		const OriginalChart = frappe.Chart;

		// Create wrapper function that filters colors
		const ChartWrapper = function(element, options) {
			// Filter colors if provided
			if (options && options.colors) {
				if (Array.isArray(options.colors)) {
					options.colors = options.colors.filter(color => color && String(color).trim());
				} else if (typeof options.colors === 'string' && !options.colors.trim()) {
					delete options.colors;
				}
			}

			// Call original constructor with filtered options
			return new OriginalChart(element, options);
		};

		// Preserve prototype chain
		ChartWrapper.prototype = OriginalChart.prototype;
		Object.setPrototypeOf(ChartWrapper, OriginalChart);

		// Copy static properties
		Object.keys(OriginalChart).forEach(key => {
			if (OriginalChart.hasOwnProperty(key)) {
				ChartWrapper[key] = OriginalChart[key];
			}
		});

		// Replace frappe.Chart
		frappe.Chart = ChartWrapper;
	}

	// ============================================
	// Fix 1b: Patch ChartWidget.get_chart_colors
	// Also patch at the source to prevent empty colors from being created
	// ============================================
	function patchChartWidget() {
		// Wait for frappe to be available
		if (!window.frappe) {
			setTimeout(patchChartWidget, 100);
			return;
		}

		// Check if already patched
		if (window.__techcloud_chart_widget_patched) return;
		
		// Try multiple approaches to find ChartWidget
		// Approach 1: Check if widget_factory is available (bundled)
		if (frappe.widget && frappe.widget.widget_factory && frappe.widget.widget_factory.chart) {
			const ChartWidget = frappe.widget.widget_factory.chart;
			if (ChartWidget && ChartWidget.prototype && !ChartWidget.prototype.__techcloud_patched) {
				const originalGetChartColors = ChartWidget.prototype.get_chart_colors;
				
				if (originalGetChartColors) {
					ChartWidget.prototype.get_chart_colors = function() {
						let colors = originalGetChartColors.call(this);
						
						// Filter out empty strings and whitespace-only strings
						if (Array.isArray(colors)) {
							colors = colors.filter(color => color && String(color).trim());
						}
						
						return colors;
					};
					
					ChartWidget.prototype.__techcloud_patched = true;
					window.__techcloud_chart_widget_patched = true;
					return;
				}
			}
		}

		// Approach 2: Try to load via frappe.require (if available and module exists)
		if (frappe.require) {
			try {
				frappe.require(["frappe/widgets/chart_widget"], function(ChartWidget) {
					if (ChartWidget && ChartWidget.prototype && !ChartWidget.prototype.__techcloud_patched) {
						const originalGetChartColors = ChartWidget.prototype.get_chart_colors;
						
						if (originalGetChartColors) {
							ChartWidget.prototype.get_chart_colors = function() {
								let colors = originalGetChartColors.call(this);
								
								// Filter out empty strings and whitespace-only strings
								if (Array.isArray(colors)) {
									colors = colors.filter(color => color && String(color).trim());
								}
								
								return colors;
							};
							
							ChartWidget.prototype.__techcloud_patched = true;
							window.__techcloud_chart_widget_patched = true;
						}
					}
				}, function() {
					// Module not found - this is okay, it might be bundled
					// Retry via widget_factory after a delay
					if (!window.__techcloud_chart_widget_patched) {
						setTimeout(patchChartWidget, 500);
					}
				});
			} catch (e) {
				// Silently retry
				if (!window.__techcloud_chart_widget_patched) {
					setTimeout(patchChartWidget, 500);
				}
			}
		} else {
			// Retry if frappe.require not available yet
			setTimeout(patchChartWidget, 200);
		}
	}

	// ============================================
	// Fix 2: Modal Dialog Display
	// Ensures modals appear correctly with proper z-index
	// ============================================
	function patchModalDialog() {
		if (!window.frappe || !frappe.msgprint) {
			setTimeout(patchModalDialog, 100);
			return;
		}

		// Check if already patched
		if (frappe.msgprint.__techcloud_modal_patched) return;
		frappe.msgprint.__techcloud_modal_patched = true;

		// Store original msgprint
		const originalMsgprint = frappe.msgprint;

		// Override msgprint to ensure proper backdrop z-index
		frappe.msgprint = function(msg, title, is_minimizable) {
			const result = originalMsgprint.call(this, msg, title, is_minimizable);

			// Ensure backdrop has correct z-index after modal is shown
			if (frappe.msg_dialog && frappe.msg_dialog.$wrapper) {
				frappe.msg_dialog.$wrapper.css("z-index", 2000);
				
				// Fix backdrop z-index after a short delay (allows Bootstrap to create it)
				setTimeout(function() {
					const backdrop = $(".modal-backdrop").last();
					if (backdrop.length && parseInt(backdrop.css("z-index")) < 2000) {
						backdrop.css("z-index", 1999);
					}
				}, 0);
			}

			return result;
		};
	}

	// ============================================
	// Fix 3: Modal ARIA Accessibility Fix
	// Prevents aria-hidden focus violations by managing focus and inert attributes when modals are hidden
	// ============================================
	function patchModalAriaAccessibility() {
		// Wait for jQuery and modal events to be available
		if (!window.jQuery || !window.frappe) {
			setTimeout(patchModalAriaAccessibility, 100);
			return;
		}

		// Check if already patched
		if (window.__techcloud_modal_aria_patched) return;
		window.__techcloud_modal_aria_patched = true;

		// Helper function to check if browser supports inert attribute
		const supportsInert = () => {
			return 'inert' in document.createElement('div');
		};

		// Handle modal show events - prepare for proper focus management
		$(document).on('show.bs.modal', '.modal', function(e) {
			const activeElement = document.activeElement;
			if (activeElement && !activeElement.closest('.modal')) {
				window.__techcloud_last_focused_element = activeElement;
			}
		});

		// Handle modal hide events to prevent aria-hidden focus violations
		$(document).on('hidden.bs.modal', '.modal', function(e) {
			const modal = $(this);

			// Find any focused elements within this modal
			const focusedElement = modal.find(':focus').get(0);

			if (focusedElement) {
				// Remove focus from the element inside the hidden modal
				focusedElement.blur();

				// Use setTimeout to ensure blur takes effect
				setTimeout(() => {
					// Double-check that focus was actually removed
					if (document.activeElement === focusedElement) {
						document.activeElement.blur();
					}

					// If there's a previously focused element stored, restore it
					if (window.__techcloud_last_focused_element &&
						document.contains(window.__techcloud_last_focused_element) &&
						!window.__techcloud_last_focused_element.closest('.modal')) {
						try {
							window.__techcloud_last_focused_element.focus();
						} catch (error) {
							// Silently handle focus errors
							console.warn('Techcloud: Could not restore focus to previous element');
						}
					} else {
						// Fallback: focus on body if no previous element
						try {
							document.body.focus();
						} catch (error) {
							// Last resort: blur any remaining focus
							if (document.activeElement) {
								document.activeElement.blur();
							}
						}
					}
				}, 10);
			}

			// Additional safety: ensure all focusable elements in hidden modal are inert
			setTimeout(() => {
				const hiddenModals = document.querySelectorAll('.modal[aria-hidden="true"], .modal[style*="display: none"]');

				hiddenModals.forEach(hiddenModal => {
					// Find all focusable elements in the hidden modal
					const focusableElements = hiddenModal.querySelectorAll(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable]'
					);

					focusableElements.forEach(element => {
						// If element still has focus, remove it
						if (document.activeElement === element) {
							element.blur();
						}

						// Add inert attribute if supported (better than aria-hidden for focus management)
						if (supportsInert() && !element.hasAttribute('inert')) {
							element.setAttribute('inert', '');
							element.setAttribute('data-techcloud-inert', 'true');
						}
					});

					// Also handle modal backdrop
					const backdrop = document.querySelector('.modal-backdrop');
					if (backdrop && document.activeElement === backdrop) {
						backdrop.blur();
					}
				});
			}, 50);
		});

		// Handle modal show events - remove inert attributes when modal becomes visible
		$(document).on('shown.bs.modal', '.modal', function(e) {
			const modal = $(this);

			// Remove inert attributes from elements within the now-visible modal
			const inertElements = modal.find('[data-techcloud-inert="true"]');
			inertElements.each(function() {
				this.removeAttribute('inert');
				this.removeAttribute('data-techcloud-inert');
			});
		});

		// Additional safety: periodically check for aria-hidden violations
		setInterval(() => {
			const hiddenModals = document.querySelectorAll('.modal[aria-hidden="true"]');

			hiddenModals.forEach(modal => {
				const focusedElements = modal.querySelectorAll(':focus');

				if (focusedElements.length > 0) {
					console.warn('Techcloud: Found focused elements in aria-hidden modal, removing focus');
					focusedElements.forEach(element => {
						element.blur();
					});
				}
			});
		}, 1000); // Check every second

		console.log("Techcloud: Enhanced modal ARIA accessibility fix applied");
	}

	// ============================================
	// Fix 4: Handle 404 errors for chart_widget module gracefully
	// Prevents TypeError when AssetManager tries to process missing modules
	// ============================================
	function patchAssetManager() {
		// Wait for frappe.assets to be available
		if (!window.frappe || !frappe.assets) {
			setTimeout(patchAssetManager, 100);
			return;
		}

		// Patch eval_assets to handle empty content and missing handlers
		if (frappe.assets.eval_assets && !frappe.assets.eval_assets.__techcloud_patched) {
			const originalEvalAssets = frappe.assets.eval_assets;
			frappe.assets.eval_assets = function(path, content) {
				// Skip if content is empty, undefined, or null (404 case)
				if (!content || (typeof content === 'string' && content.trim() === "")) {
					// Silently skip - module might be bundled or not needed
					return;
				}

				// Get extension handler safely
				try {
					const ext = this.extn(path);
					if (!this._handlers || !this._handlers[ext] || typeof this._handlers[ext] !== 'function') {
						// No handler for this extension - skip silently
						return;
					}

					// Call original eval_assets
					return originalEvalAssets.call(this, path, content);
				} catch (e) {
					// Handle any errors gracefully
					console.warn(`Techcloud: Error processing asset ${path}:`, e.message);
					return;
				}
			};
			frappe.assets.eval_assets.__techcloud_patched = true;
		}

		// Also patch execute to handle 404s in fetch
		if (frappe.assets.execute && !frappe.assets.execute.__techcloud_patched) {
			const originalExecute = frappe.assets.execute;
			frappe.assets.execute = function(items, callback) {
				const me = this;
				const version_string = frappe.boot.developer_mode || window.dev_server ? Date.now() : window._version_number;
				let fetched_assets = {};

				async function fetch_item(path) {
					let url = new URL(path, window.location.origin);

					// Add the version to the URL to bust the cache for non-bundled assets
					if (
						url.hostname === window.location.hostname &&
						!path.includes(".bundle.") &&
						!url.searchParams.get("v")
					) {
						url.searchParams.append("v", version_string);
					}

					try {
						const response = await fetch(url.toString());
						if (!response.ok && response.status === 404) {
							// Handle 404 gracefully - set empty string
							fetched_assets[path] = "";
							return;
						}
						fetched_assets[path] = await response.text();
					} catch (error) {
						// Handle fetch errors - set empty string
						fetched_assets[path] = "";
					}
				}

				frappe.dom.freeze();
				const fetch_promises = items.map(fetch_item);
				Promise.all(fetch_promises).then(() => {
					items.forEach((path) => {
						let body = fetched_assets[path];
						me.eval_assets(path, body);
					});
					frappe.dom.unfreeze();
					callback?.();
				});
			};
			frappe.assets.execute.__techcloud_patched = true;
		}
	}

	// ============================================
	// Initialize Patches
	// ============================================
	function initPatches() {
		// Patch asset manager to handle 404s gracefully (prevents TypeError)
		patchAssetManager();

		// Patch chart color validation (primary fix - catches all chart instances)
		patchChartColorValidation();

		// Patch chart widget (secondary fix - prevents empty colors at source)
		patchChartWidget();

		// Patch modal dialog
		patchModalDialog();

		// Patch modal ARIA accessibility
		patchModalAriaAccessibility();
	}

	// Run when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initPatches);
	} else {
		initPatches();
	}

	// Also run after Frappe is ready
	if (window.frappe && frappe.ready) {
		frappe.ready(initPatches);
	}

	// Retry after delays to catch late-loading modules
	setTimeout(initPatches, 500);
	setTimeout(initPatches, 1000);
	setTimeout(initPatches, 2000);
})();
