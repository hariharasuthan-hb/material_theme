#!/bin/bash
# Script to add 'Techcloud' to desk_theme field options
# Run: ./add_techcloud_to_desk_theme.sh

echo "Adding 'Techcloud' to desk_theme options..."

bench --site erpnext.local console << 'EOF'
import frappe
frappe.init(site='erpnext.local')
frappe.connect()

# Get User DocType
user_doctype = frappe.get_doc("DocType", "User")

# Find desk_theme field
found = False
for field in user_doctype.fields:
    if field.fieldname == "desk_theme":
        found = True
        current_options = field.options.split("\n") if field.options else []
        
        print(f"\nCurrent desk_theme options: {current_options}")
        
        # Add Techcloud if not present
        if "Techcloud" not in current_options:
            current_options.append("Techcloud")
            field.options = "\n".join(current_options)
            user_doctype.save(ignore_permissions=True)
            frappe.db.commit()
            print(f"\n✅ SUCCESS: Added 'Techcloud' to desk_theme options")
            print(f"New options: {field.options}")
        else:
            print(f"\n✅ 'Techcloud' already exists in desk_theme options")
        
        break

if not found:
    print("❌ ERROR: desk_theme field not found in User DocType")

frappe.destroy()
EOF

echo ""
echo "✅ Done! Please refresh your browser to see 'Techcloud' in Desk Settings"

