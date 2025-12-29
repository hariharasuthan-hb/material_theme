import frappe
from frappe.utils.jinja_globals import include_style

# No monkey patching needed! CSS is loaded via hooks and scoped with data-theme selectors
# JavaScript sets data-theme="material" attribute based on desk_theme
def before_request():
	"""Ensure Material desk theme sets data-theme attribute correctly"""
	# The app.html template already sets data-theme="{{ desk_theme.lower() }}"
	# So if desk_theme is "Material", it becomes "material" automatically
	# The JavaScript in material.js ensures it stays set even if Frappe's theme switcher tries to change it
	# No action needed here - CSS is loaded via app_include_css hook and scoped with html[data-theme="material"]
	pass

def update_techcloud_theme_context(context):
	"""Update website context to conditionally load Techcloud CSS for website pages
	Also adds script to head_html for desk pages if Material theme is active"""
	try:
		# Get app name dynamically from current module (no hardcoding!)
		# This works even if the app is renamed or imported to another site
		try:
			import sys
			current_module = sys.modules.get(__name__)
			if current_module:
				app_name = current_module.__name__.split('.')[0]
			else:
				app_name = "techcloud"
		except:
			app_name = "techcloud"
		
		# Safely get active theme - may fail if database not initialized or theme doesn't exist
		theme = None
		try:
			from frappe.website.doctype.website_theme.website_theme import get_active_theme
			theme = get_active_theme()
		except Exception as theme_error:
			# If get_active_theme fails, continue without theme (theme is optional)
			# Don't log as error - this is expected in some contexts (e.g., during asset build)
			pass
		# Dynamic theme detection: Check if theme name contains app name (case-insensitive)
		# This works even if theme is named "Techcloud Theme", "techcloud theme", "My Techcloud Theme", etc.
		# Also check if theme_url contains app asset path
		is_techcloud_theme = False
		if theme:
			theme_name_lower = (theme.name or "").lower()
			theme_url = (theme.theme_url or "").lower()
			app_name_lower = app_name.lower()
			
			# Check if theme name contains app name OR theme_url contains app assets
			is_techcloud_theme = (
				app_name_lower in theme_name_lower or
				f"/assets/{app_name_lower}/" in theme_url or
				app_name_lower in theme_url
			)
		
		# Check if user has Material desk theme (for desk pages)
		desk_theme = None
		if frappe.session.user and frappe.session.user != "Guest":
			try:
				desk_theme = frappe.db.get_value("User", frappe.session.user, "desk_theme") or "Light"
			except:
				pass
		
		# Also check desk_theme from context (set in app.py)
		if not desk_theme and "desk_theme" in context:
			desk_theme = context.get("desk_theme", "Light")
		
		is_techcloud_desk_theme = desk_theme and desk_theme.lower() == "material"
		
		# Detect if this is a desk page (has include_css and desk_theme in context)
		is_desk_page = "include_css" in context and "desk_theme" in context
		
		# For login pages, always apply techcloud theme (if Material theme is set)
		# Check if this is a login page - multiple detection methods
		is_login_page = False
		
		# Method 1: Check context title
		if context.get("title") == "Login":
			is_login_page = True
		
		# Method 2: Check for_test field (login.html)
		if context.get("for_test") == "login.html":
			is_login_page = True
		
		# Method 3: Check path in context
		if "path" in context:
			path = context.get("path", "")
			if "login" in path.lower() or path == "/":
				is_login_page = True
		
		# Method 4: Check request path
		try:
			if frappe.request and hasattr(frappe.request, 'path'):
				if "login" in frappe.request.path.lower():
					is_login_page = True
		except:
			pass
		
		# Method 5: Check template name
		if context.get("template") and "login" in str(context.get("template", "")).lower():
			is_login_page = True
		
		# Handle both website and desk pages, or login pages
		if is_techcloud_theme or (is_techcloud_desk_theme and is_desk_page) or is_login_page:
			# IMPORTANT (Website Theme inter.css 500 fix):
			# Frappe's generated Website Theme CSS (served from `/files/website_theme/*.css`) currently starts with:
			#   @import "frappe/public/css/fonts/inter/inter.css";
			# Because that is a *relative* import, the browser resolves it as:
			#   /files/website_theme/frappe/public/css/fonts/inter/inter.css
			# which doesn't exist and throws 500.
			#
			# For Techcloud, we don't need the generated Website Theme CSS at all because we load
			# our theme via `web_include_css` / `head_html`. So we force the "Standard" path in
			# `frappe/templates/includes/head.html` by removing `theme` from context.
			if is_techcloud_theme or is_login_page:
				context["theme"] = None
			
			# Inject icons.svg for website pages (app_include_icons only works for desk pages)
			# Website pages need icons injected into body_include
			if not is_desk_page:
				try:
					import os
					icons_path = frappe.get_app_path(app_name, "public", "icons", "icons.svg")
					if os.path.exists(icons_path):
						with open(icons_path, 'r', encoding='utf-8') as f:
							icons_svg = f.read()
						# Add icons to body_include so they're available in the DOM
						# Check if icons already included (by checking for a unique icon ID)
						current_body_include = context.get("body_include", "") or ""
						if "#icon-account" not in current_body_include and "id=\"icon-account\"" not in current_body_include:
							context["body_include"] = current_body_include + icons_svg
				except Exception as icons_error:
					# Silent fail - icons are optional
					pass

			# For website pages only - add CSS to head_html
			# Desk pages use app_include_css hook (no core file modifications)
			techcloud_css_path = f"/assets/{app_name}/css/material.css"
			
			# Add Techcloud CSS link to head_html (for website pages)
			# Use direct link tag to avoid preload warnings
			# Wrap in try-except to handle asset bundling errors gracefully
			try:
				# Try to get bundled asset path first
				from frappe.utils import bundled_asset
				bundled_css_path = bundled_asset(techcloud_css_path)
				# Use direct link without preload to avoid warnings
				techcloud_css = f'<link type="text/css" rel="stylesheet" href="{bundled_css_path}">'
				current_head_html = context.get("head_html", "") or ""
				import re
				# Remove any existing material.css links (including preload links)
				current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
				current_head_html = re.sub(r'<link[^>]*rel=["\']preload["\'][^>]*material\.css[^>]*>', '', current_head_html)
				if techcloud_css not in current_head_html:
					context["head_html"] = current_head_html + techcloud_css
			except Exception as css_error:
				# If bundled_asset fails, use direct path (no preload)
				techcloud_css_fallback = f'<link type="text/css" rel="stylesheet" href="{techcloud_css_path}">'
				current_head_html = context.get("head_html", "") or ""
				import re
				# Remove any existing material.css links (including preload links)
				current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
				current_head_html = re.sub(r'<link[^>]*rel=["\']preload["\'][^>]*material\.css[^>]*>', '', current_head_html)
				if techcloud_css_fallback not in current_head_html:
					context["head_html"] = current_head_html + techcloud_css_fallback
			
			# Add login page restructure script for login pages
			if is_login_page:
				login_script_path = f"/assets/{app_name}/js/techcloud-login.js"
				# Use bundled_asset to get the correct path with hash
				try:
					from frappe.utils import get_assets_json
					assets_json = get_assets_json()
					if assets_json and login_script_path in assets_json.get("files", {}):
						login_script_path = assets_json["files"][login_script_path]
				except Exception as assets_error:
					# If get_assets_json fails, use direct path
					frappe.log_error(f"Error getting assets JSON for login script: {assets_error}", "Techcloud Theme Assets Error")
					# Continue with direct path
				login_script = f'<script src="{login_script_path}"></script>'
				current_head = context.get("head_html", "")
				if login_script not in current_head and "techcloud-login.js" not in current_head:
					context["head_html"] = current_head + login_script
			
			# Add inline script to set data-theme attribute (for both website and login/website pages).
			# Keep this script EARLY + SILENT to avoid console spam and avoid fighting with `public/js/material.js`.
			# `public/js/material.js` is the main authority for desk pages (uses frappe.ready + small safeguards).
			script = '''<script>
			(function(){
				function shouldApply() {
					var html = document.documentElement;
					if(!html) return false;
					// For login/website we may not have frappe.boot yet; trust current attributes too.
					var theme = html.getAttribute("data-theme");
					var mode = html.getAttribute("data-theme-mode");
					if(theme === "material" || mode === "material") return true;
					if(window.frappe && window.frappe.boot && window.frappe.boot.desk_theme) {
						return String(window.frappe.boot.desk_theme).toLowerCase() === "material";
					}
					return false;
				}

				function applyAttrs() {
					if(!shouldApply()) return;
					var html = document.documentElement;
					if(!html) return;
					if(html.getAttribute("data-theme") !== "material") html.setAttribute("data-theme","material");
					if(html.getAttribute("data-theme-mode") !== "material") html.setAttribute("data-theme-mode","material");
					if(document.body) {
						if(document.body.getAttribute("data-theme") !== "material") document.body.setAttribute("data-theme","material");
						if(document.body.getAttribute("data-theme-mode") !== "material") document.body.setAttribute("data-theme-mode","material");
					}
				}

				// Run once early + once on DOM ready (no observers, no intervals, no logs)
				applyAttrs();
				if(document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', applyAttrs);
				} else {
					applyAttrs();
				}
			})();
			</script>'''
			current_head_html = context.get("head_html", "") or ""
			# Remove any existing techcloud theme scripts (handle both single-line and multi-line)
			current_head_html = re.sub(r'<script[^>]*>.*?setTechcloudTheme.*?</script>', '', current_head_html, flags=re.DOTALL)
			current_head_html = re.sub(r'<script[^>]*setAttribute[^>]*data-theme[^>]*</script>', '', current_head_html)
			if script not in current_head_html:
				# Add script at the beginning of head_html so it runs early
				context["head_html"] = script + current_head_html
			
			# For website, also add to web_include_css if it exists
			if "web_include_css" in context:
				if isinstance(context["web_include_css"], list):
					if techcloud_css_path not in context["web_include_css"]:
						context["web_include_css"].append(techcloud_css_path)
				elif isinstance(context["web_include_css"], str):
					if context["web_include_css"] != techcloud_css_path:
						context["web_include_css"] = [context["web_include_css"], techcloud_css_path]
			
			# For website, also add to web_include_js if it exists
			if "web_include_js" in context:
				if isinstance(context["web_include_js"], list):
					techcloud_js_files = [
						f"/assets/{app_name}/js/material.js",
						f"/assets/{app_name}/js/material-theme-customizer.js",
						f"/assets/{app_name}/js/theme.js"
					]
					for js_file in techcloud_js_files:
						if js_file not in context["web_include_js"]:
							context["web_include_js"].append(js_file)
		else:
			# Remove Techcloud CSS from website pages if theme is not active
			# Desk pages: CSS is loaded via hook but scoped, so it won't apply if data-theme is not set
			current_head_html = context.get("head_html", "") or ""
			import re
			# Remove both regular and preload links
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
			current_head_html = re.sub(r'<link[^>]*rel=["\']preload["\'][^>]*material\.css[^>]*>', '', current_head_html)
			current_head_html = re.sub(r'<script[^>]*setAttribute[^>]*data-theme[^>]*</script>', '', current_head_html)
			context["head_html"] = current_head_html
			
			# Remove from web_include_css if it exists
			if "web_include_css" in context:
				if isinstance(context["web_include_css"], list):
					context["web_include_css"] = [css for css in context["web_include_css"] if "material.css" not in css]
				elif isinstance(context["web_include_css"], str) and "material.css" in context["web_include_css"]:
					context["web_include_css"] = None
					
	except Exception as e:
		app_name_fallback = "techcloud"
		try:
			import sys
			current_module = sys.modules.get(__name__)
			if current_module:
				app_name_fallback = current_module.__name__.split('.')[0]
		except:
			pass
		frappe.log_error(f"Error updating {app_name_fallback.title()} Theme context: {e}")
	return context

