#!/usr/bin/env python3
"""
Script to add 'Techcloud' to desk_theme field options in User DocType.
Run this manually: bench --site [site] execute techcloud.add_techcloud_theme.add_techcloud_theme
Or: bench --site [site] console and run: from techcloud.add_techcloud_theme import add_techcloud_theme; add_techcloud_theme()
"""
import frappe

def add_techcloud_theme():
    """Add 'Techcloud' option to desk_theme field in User DocType."""
    
    print("=" * 60)
    print("Adding 'Techcloud' to desk_theme options...")
    print("=" * 60)
    
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
                print(f"New options: {current_options}")
            else:
                print(f"\n✅ 'Techcloud' already exists in desk_theme options")
            
            break
    
    if not found:
        print("❌ ERROR: desk_theme field not found in User DocType")
        return False
    
    print("\n" + "=" * 60)
    print("✅ Done! Please refresh your browser to see 'Techcloud' in Desk Settings")
    print("=" * 60)
    
    return True

