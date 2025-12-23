import frappe

def update_material_theme_context(context):
	"""Update website context to add head_html script for Material Theme"""
	try:
		from frappe.website.doctype.website_theme.website_theme import get_active_theme
		
		theme = get_active_theme()
		if theme and theme.name == "Material Theme":
			# Add inline script to set data-theme attribute immediately
			# Use DOMContentLoaded to ensure HTML element exists
			script = '<script>(function(){document.documentElement.setAttribute("data-theme","material");})();</script>'
			current_head_html = context.get("head_html", "") or ""
			# Remove old script if exists
			import re
			current_head_html = re.sub(r'<script[^>]*setAttribute[^>]*data-theme[^>]*</script>', '', current_head_html)
			if script not in current_head_html:
				context["head_html"] = current_head_html + script
	except Exception as e:
		frappe.log_error(f"Error updating Material Theme context: {e}")
	return context

