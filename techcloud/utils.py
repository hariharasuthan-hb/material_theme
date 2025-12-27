import frappe
from frappe.utils.jinja_globals import include_style

def before_request():
	"""Modify app context to conditionally load Techcloud CSS for app/desk pages"""
	try:
		# Monkey patch app.py get_context to add Techcloud theme CSS
		# This runs for ALL requests, but we only modify context for app/desk pages
		from frappe import www
		import frappe.www.app as app_module
		
		# Store original get_context (only once)
		# Check if material_theme already patched it, use that as base
		if not hasattr(app_module, '_original_get_context_techcloud'):
			# If material_theme already patched, use their original
			if hasattr(app_module, '_original_get_context'):
				app_module._original_get_context_techcloud = app_module._original_get_context
			else:
				app_module._original_get_context_techcloud = app_module.get_context
			
			def get_context_with_techcloud_theme(context):
				# Call original get_context (which might be material_theme's wrapper)
				context = app_module._original_get_context_techcloud(context)
				
				# Check if this is a desk page (has include_css and desk_theme)
				if "include_css" in context and "desk_theme" in context:
					# Apply Techcloud theme logic
					# This MUST run after material_theme's update to ensure our CSS is added
					context = update_techcloud_theme_context(context)
					
					# Debug: Log what CSS files are in context
					if context.get("include_css"):
						techcloud_css = [css for css in context["include_css"] if "techcloud" in str(css) or "material.css" in str(css)]
						if techcloud_css:
							frappe.log_error(f"Techcloud CSS added to context: {techcloud_css}", "Techcloud CSS Debug")
						else:
							frappe.log_error(f"Techcloud CSS NOT in context. All CSS: {context['include_css']}", "Techcloud CSS Debug")
				
				return context
			
			# Replace get_context (wrapping material_theme's wrapper if it exists)
			app_module.get_context = get_context_with_techcloud_theme
	except Exception as e:
		frappe.log_error(f"Error in before_request for Techcloud Theme: {e}")

def update_techcloud_theme_context(context):
	"""Update website context to conditionally load Techcloud CSS and add head_html script
	Also handles desk/app pages when called via app.py context modification"""
	try:
		from frappe.website.doctype.website_theme.website_theme import get_active_theme
		
		theme = get_active_theme()
		is_techcloud_theme = theme and theme.name == "Techcloud Theme"
		
		# Check if user has Material desk theme (for app/desk pages)
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
		
		# Debug logging (remove in production)
		if is_desk_page:
			frappe.log_error(f"Techcloud Theme Debug: desk_theme={desk_theme}, is_techcloud_desk_theme={is_techcloud_desk_theme}, is_techcloud_theme={is_techcloud_theme}", "Techcloud Theme Debug")
		
		# Only load Techcloud CSS and JS if Material theme is active
		if is_techcloud_theme or is_techcloud_desk_theme:
			# For app/desk pages, add to include_css
			# Use full path - include_style will handle it correctly
			techcloud_css_path = "/assets/techcloud/css/material.css"
			
			if "include_css" in context:
				if isinstance(context["include_css"], list):
					# Remove Techcloud CSS if already present to avoid duplicates
					# Be specific: only remove techcloud CSS, not material_theme CSS
					context["include_css"] = [
						css for css in context["include_css"] 
						if "/assets/techcloud/" not in str(css) and "techcloud" not in str(css).lower()
					]
					
					# IMPORTANT: material_theme removes ALL CSS with "material.css" in the name
					# So our CSS might have been removed. We need to add it back at the end
					# to ensure it loads after material_theme's CSS
					
					# Find the position of desk.bundle.css and insert Techcloud CSS after it
					# This ensures Techcloud CSS overrides desk.bundle.css
					desk_bundle_index = -1
					for i, css in enumerate(context["include_css"]):
						if "desk.bundle.css" in str(css):
							desk_bundle_index = i
							break
					
					if desk_bundle_index >= 0:
						# Insert after desk.bundle.css
						context["include_css"].insert(desk_bundle_index + 1, techcloud_css_path)
					else:
						# If desk.bundle.css not found, add at the end (after material_theme CSS)
						context["include_css"].append(techcloud_css_path)
			
			# For app/desk pages, add Techcloud JS to include_js
			if "include_js" in context:
				if isinstance(context["include_js"], list):
					techcloud_js_files = [
						"/assets/techcloud/js/material.js",
						"/assets/techcloud/js/material-theme-customizer.js",
						"/assets/techcloud/js/theme.js"
					]
					for js_file in techcloud_js_files:
						if js_file not in context["include_js"]:
							context["include_js"].append(js_file)
			
			# Add Techcloud CSS link to head_html (for website pages)
			# include_style() already calls bundled_asset() internally
			techcloud_css = include_style("/assets/techcloud/css/material.css", preload=False)
			current_head_html = context.get("head_html", "") or ""
			import re
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
			if techcloud_css not in current_head_html:
				context["head_html"] = current_head_html + techcloud_css
			
			# Add inline script to set data-theme attribute (run immediately, before page load)
			# This ensures Material theme CSS selectors match even if desk_theme is not "Material"
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
						"/assets/techcloud/js/material.js",
						"/assets/techcloud/js/material-theme-customizer.js",
						"/assets/techcloud/js/theme.js"
					]
					for js_file in techcloud_js_files:
						if js_file not in context["web_include_js"]:
							context["web_include_js"].append(js_file)
		else:
			# Remove Techcloud CSS and JS if it exists
			# For app/desk pages, remove from include_css
			if "include_css" in context and isinstance(context["include_css"], list):
				context["include_css"] = [css for css in context["include_css"] if "material.css" not in css]
			
			# For app/desk pages, remove Techcloud JS from include_js
			if "include_js" in context and isinstance(context["include_js"], list):
				context["include_js"] = [js for js in context["include_js"] if "techcloud" not in js]
			
			current_head_html = context.get("head_html", "") or ""
			import re
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
			current_head_html = re.sub(r'<script[^>]*material[^>]*\.js[^>]*></script>', '', current_head_html)
			context["head_html"] = current_head_html
			
			# Remove from web_include_css if it exists
			if "web_include_css" in context:
				if isinstance(context["web_include_css"], list):
					context["web_include_css"] = [css for css in context["web_include_css"] if "material.css" not in css]
				elif isinstance(context["web_include_css"], str) and "material.css" in context["web_include_css"]:
					context["web_include_css"] = None
			
			# Remove from web_include_js if it exists
			if "web_include_js" in context:
				if isinstance(context["web_include_js"], list):
					context["web_include_js"] = [js for js in context["web_include_js"] if "techcloud" not in js]
					
	except Exception as e:
		frappe.log_error(f"Error updating Techcloud Theme context: {e}")
	return context

