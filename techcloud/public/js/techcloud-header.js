// Techcloud Navbar Layout Fix (ERPNext-safe)
(function () {
    "use strict";

    function fixNavbarHeader() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const container = navbar.querySelector('.container');
        if (!container) return;

        const brand = container.querySelector('.navbar-brand');
        const right = container.querySelector('.navbar-collapse');

        if (brand) {
            brand.classList.add('techcloud-navbar-brand');
        }

        if (right) {
            right.classList.add('techcloud-navbar-right');
        }
    }

	// Run once when route changes
	if (typeof frappe !== 'undefined') {
		// Guard: router is not available on some website / login routes
		if (frappe.router && typeof frappe.router.on === 'function') {
			frappe.router.on('change', () => {
				setTimeout(fixNavbarHeader, 0);
			});
		}

		// Guard: frappe.ready may not exist on every page
		if (typeof frappe.ready === 'function') {
			frappe.ready(() => {
				fixNavbarHeader();
			});
		} else {
			document.addEventListener('DOMContentLoaded', fixNavbarHeader);
		}
	} else {
		document.addEventListener('DOMContentLoaded', fixNavbarHeader);
	}
})();

