// Material Theme Website Script
// Sets data-theme="material" attribute on HTML element when Material Theme is active

(function() {
	// Check if Material Theme is active
	if (document.querySelector('link[href*="material_theme"]') || 
	    window.location.pathname.includes('login') || 
	    document.querySelector('html').getAttribute('data-theme') === null) {
		
		// Check if Material Theme website theme is active
		// This script runs early, so we check for Material Theme CSS being loaded
		var materialThemeActive = false;
		
		// Check all stylesheets
		var stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
		for (var i = 0; i < stylesheets.length; i++) {
			if (stylesheets[i].href && stylesheets[i].href.includes('material_theme')) {
				materialThemeActive = true;
				break;
			}
		}
		
		// Also check if Material Theme is set in website settings (via theme URL)
		var themeLinks = document.querySelectorAll('link[href*="material_theme"]');
		if (themeLinks.length > 0) {
			materialThemeActive = true;
		}
		
		// Set data-theme attribute if Material Theme is active
		if (materialThemeActive) {
			document.documentElement.setAttribute('data-theme', 'material');
		}
	}
})();

