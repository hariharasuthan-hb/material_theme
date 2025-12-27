frappe.ui.ThemeSwitcher = class CustomThemeSwitcher extends frappe.ui.ThemeSwitcher {
	constructor() {
		super()
	}

	fetch_themes() {
		return new Promise((resolve) => {
			this.themes = [
				{
					name: "light",
					label: ("Frappe Light"),
					info: ("Light Theme"),
				},
				{
					name: "dark",
					label: "Timeless Night",
					info: "Dark Theme",
				},
				{
					name: "material",
					label: "Material by Itrostack",
					info: "Theme By Itrostack LLP"
				},
				{
					name: "automatic",
					label: "Automatic",
					info: "Uses system's theme to switch between light and dark mode",
				}
			];

			resolve(this.themes);
		});
	}
}

// Dynamically add "Material" option to desk_theme field in User form (no core file changes)
// This runs when User form is loaded
frappe.ui.form.on("User", {
	refresh: function(frm) {
		// Find the desk_theme field and add "Material" option if not present
		if (frm.fields_dict.desk_theme && frm.fields_dict.desk_theme.df) {
			const field = frm.fields_dict.desk_theme;
			const current_options = field.df.options ? field.df.options.split('\n') : [];
			
			// Add "Material" if not already present
			if (current_options.indexOf("Material") === -1) {
				current_options.push("Material");
				field.df.options = current_options.join('\n');
				// Refresh the field to show the new option
				field.refresh();
			}
		}
	}
});