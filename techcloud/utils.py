import frappe
from frappe.utils.jinja_globals import include_style

# No monkey patching needed! CSS is loaded via hooks and scoped with data-theme selectors
# JavaScript sets data-theme="material" attribute based on desk_theme
def before_request():
	"""Set data-theme attribute via JavaScript for desk pages (no core file modifications)"""
	# CSS is loaded via app_include_css hook in hooks.py
	# CSS is scoped with html[data-theme="material"] so it only applies when attribute is set
	# JavaScript in theme.js sets the data-theme attribute based on desk_theme
	# This approach avoids monkey patching core Frappe functions
	pass

def update_techcloud_theme_context(context):
	"""Update website context to conditionally load Techcloud CSS for website pages only
	Desk/app pages use app_include_css hook - no core file modifications needed"""
	try:
		from frappe.website.doctype.website_theme.website_theme import get_active_theme
		
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
		
		theme = get_active_theme()
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
		
		# Only handle website pages - desk pages use app_include_css hook
		# CSS is scoped with html[data-theme="material"] so it only applies when attribute is set
		if is_techcloud_theme:
			# For website pages only - add CSS to head_html
			# Desk pages use app_include_css hook (no core file modifications)
			techcloud_css_path = f"/assets/{app_name}/css/material.css"
			
			# Add Techcloud CSS link to head_html (for website pages)
			# include_style() already calls bundled_asset() internally
			techcloud_css = include_style(techcloud_css_path, preload=False)
			current_head_html = context.get("head_html", "") or ""
			import re
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
			if techcloud_css not in current_head_html:
				context["head_html"] = current_head_html + techcloud_css
			
			# Add inline script to set data-theme attribute for website pages
			# Desk pages handle this via JavaScript in material.js (no core file modifications)
			script = '<script>(function(){if(document.documentElement){document.documentElement.setAttribute("data-theme","material");document.documentElement.setAttribute("data-theme-mode","material");}})();</script>'
			current_head_html = context.get("head_html", "") or ""
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
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
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

