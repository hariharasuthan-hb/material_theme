import frappe
from frappe.utils.jinja_globals import include_style

def before_request():
	"""Modify app context to conditionally load Material CSS for app/desk pages"""
	try:
		# This runs before app.py get_context, so we need to modify context after it's created
		# We'll do this in update_material_theme_context instead
		pass
	except Exception as e:
		frappe.log_error(f"Error in before_request for Material Theme: {e}")

def update_material_theme_context(context):
	"""Update website context to conditionally load Material CSS and add head_html script"""
	try:
		from frappe.website.doctype.website_theme.website_theme import get_active_theme
		
		theme = get_active_theme()
		is_material_theme = theme and theme.name == "Material Theme"
		
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
		
		is_material_desk_theme = desk_theme and desk_theme.lower() == "material"
		
		# Only load Material CSS and JS if Material theme is active
		if is_material_theme or is_material_desk_theme:
			# For app/desk pages, add to include_css
			if "include_css" in context:
				if isinstance(context["include_css"], list):
					if "/assets/material_theme/css/material.css" not in context["include_css"]:
						context["include_css"].append("/assets/material_theme/css/material.css")
			
			# For app/desk pages, add Material JS to include_js
			if "include_js" in context:
				if isinstance(context["include_js"], list):
					material_js_files = [
						"/assets/material_theme/js/material.js",
						"/assets/material_theme/js/material-theme-customizer.js",
						"/assets/material_theme/js/theme.js"
					]
					for js_file in material_js_files:
						if js_file not in context["include_js"]:
							context["include_js"].append(js_file)
			
			# Add Material CSS link to head_html (for website pages)
			material_css = include_style("/assets/material_theme/css/material.css", preload=False)
			current_head_html = context.get("head_html", "") or ""
			import re
			current_head_html = re.sub(r'<link[^>]*material\.css[^>]*>', '', current_head_html)
			if material_css not in current_head_html:
				context["head_html"] = current_head_html + material_css
			
			# Add inline script to set data-theme attribute
			script = '<script>(function(){document.documentElement.setAttribute("data-theme","material");})();</script>'
			current_head_html = context.get("head_html", "") or ""
			current_head_html = re.sub(r'<script[^>]*setAttribute[^>]*data-theme[^>]*</script>', '', current_head_html)
			if script not in current_head_html:
				context["head_html"] = current_head_html + script
			
			# For website, also add to web_include_css if it exists
			if "web_include_css" in context:
				if isinstance(context["web_include_css"], list):
					if "/assets/material_theme/css/material.css" not in context["web_include_css"]:
						context["web_include_css"].append("/assets/material_theme/css/material.css")
				elif isinstance(context["web_include_css"], str):
					if context["web_include_css"] != "/assets/material_theme/css/material.css":
						context["web_include_css"] = [context["web_include_css"], "/assets/material_theme/css/material.css"]
			
			# For website, also add to web_include_js if it exists
			if "web_include_js" in context:
				if isinstance(context["web_include_js"], list):
					material_js_files = [
						"/assets/material_theme/js/material.js",
						"/assets/material_theme/js/material-theme-customizer.js",
						"/assets/material_theme/js/theme.js"
					]
					for js_file in material_js_files:
						if js_file not in context["web_include_js"]:
							context["web_include_js"].append(js_file)
		else:
			# Remove Material CSS and JS if it exists
			# For app/desk pages, remove from include_css
			if "include_css" in context and isinstance(context["include_css"], list):
				context["include_css"] = [css for css in context["include_css"] if "material.css" not in css]
			
			# For app/desk pages, remove Material JS from include_js
			if "include_js" in context and isinstance(context["include_js"], list):
				context["include_js"] = [js for js in context["include_js"] if "material_theme" not in js]
			
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
					context["web_include_js"] = [js for js in context["web_include_js"] if "material_theme" not in js]
					
	except Exception as e:
		frappe.log_error(f"Error updating Material Theme context: {e}")
	return context

