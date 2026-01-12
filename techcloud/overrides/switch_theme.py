import frappe

@frappe.whitelist()
def switch_theme(theme):
	print(f"Switching Theme {theme}")
	# Accept both "Techcloud" and "Material" - both map to "Material" internally
	# CSS uses data-theme="material" so we need to store "Material" in desk_theme
	if theme in ["Dark", "Light", "Automatic", "Material", "Techcloud"]:
		# Map "Techcloud" to "Material" for internal storage
		internal_theme = "Material" if theme == "Techcloud" else theme
		frappe.db.set_value("User", frappe.session.user, "desk_theme", internal_theme)