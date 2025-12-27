import frappe

def execute():
	"""Add head_html script to Website Settings for Material Theme"""
	try:
		ws = frappe.get_doc("Website Settings")
		
		# Get current head_html
		current_head_html = ws.head_html or ""
		
		# Add Material Theme script if not already present
		script = '<script>document.documentElement.setAttribute("data-theme", "material");</script>'
		
		if script not in current_head_html:
			ws.head_html = current_head_html + script
			ws.save()
			frappe.db.commit()
			print("✓ Added Material Theme head_html script")
		else:
			print("✓ Material Theme head_html script already exists")
	except Exception as e:
		print(f"Error adding head_html: {e}")

