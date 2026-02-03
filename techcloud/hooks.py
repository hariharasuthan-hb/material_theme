app_name = "techcloud"
app_title = "Techcloud ERP"
app_publisher = "Itrostack LLP"
app_description = "Techcloud ERP Theme"
app_email = "info@itrostack.com"
app_license = "mit"

# include js, css files in header of desk.html
# CSS (desk.css) and JS (material.js, techcloud-icons.js) are loaded conditionally via theme.js when TechCloud theme is active
app_include_css = []
app_include_js = [
    "/assets/techcloud/js/theme.js",
]

# include js, css files in header of web template
web_include_css = ["/assets/techcloud/css/material.css"]
web_include_js = [
    "/assets/techcloud/js/techcloud-login.js",
    "/assets/techcloud/js/techcloud-icons.js",
    "/assets/techcloud/js/techcloud-header.js",
]

# Svg Icons
app_include_icons = "techcloud/icons/icons.svg"

override_whitelisted_methods = {
    "frappe.core.doctype.user.user.switch_theme": "techcloud.overrides.switch_theme.switch_theme",
}

update_website_context = ["techcloud.utils.update_techcloud_theme_context"]

before_request = ["techcloud.utils.before_request"]
