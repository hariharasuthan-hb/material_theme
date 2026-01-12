#!/usr/bin/env python3
"""
Manual installation script for techcloud app
Run this via: bench --site erpnext.local execute techcloud.install_techcloud.install
"""
import frappe

def install():
    """Add techcloud to installed apps"""
    frappe.init(site=frappe.local.site)
    frappe.connect()
    
    try:
        installed = frappe.get_installed_apps()
        if 'techcloud' not in installed:
            installed.append('techcloud')
            frappe.db.set_value("System Settings", "System Settings", "installed_apps", installed)
            frappe.db.commit()
            print("✓ Added techcloud to installed apps")
        else:
            print("✓ techcloud already in installed apps")
    except Exception as e:
        print(f"Error: {e}")
        frappe.db.rollback()
    finally:
        frappe.destroy()

