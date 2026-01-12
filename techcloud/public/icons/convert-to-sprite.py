#!/usr/bin/env python3
"""
Helper script to convert individual SVG files to a sprite format.
Run this after exporting icons from Figma.

Usage:
    python convert-to-sprite.py
"""

import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent
ICONS_DIR = SCRIPT_DIR
OUTPUT_FILE = ICONS_DIR / "icons.svg"

def extract_viewbox(svg_content):
    """Extract viewBox from SVG content."""
    viewbox_match = re.search(r'viewBox=["\']([^"\']+)["\']', svg_content)
    if viewbox_match:
        return viewbox_match.group(1)
    return "0 0 24 24"  # Default viewBox

def extract_paths_and_groups(svg_content):
    """Extract path and group elements from SVG."""
    # Remove XML declaration and svg tags, keep only content
    content = re.sub(r'<\?xml[^>]*\?>', '', svg_content)
    content = re.sub(r'<svg[^>]*>', '', content)
    content = re.sub(r'</svg>', '', content)
    return content.strip()

def convert_svg_to_symbol(svg_file):
    """Convert an individual SVG file to a symbol format."""
    try:
        with open(svg_file, 'r', encoding='utf-8') as f:
            svg_content = f.read()
        
        # Get icon name from filename (remove .svg extension)
        icon_name = svg_file.stem
        # Ensure it starts with "icon-"
        if not icon_name.startswith('icon-'):
            icon_name = f'icon-{icon_name}'
        
        # Extract viewBox
        viewbox = extract_viewbox(svg_content)
        
        # Extract paths/groups
        paths_content = extract_paths_and_groups(svg_content)
        
        # Create symbol
        symbol = f'''    <symbol id="{icon_name}" viewBox="{viewbox}">
      {paths_content}
    </symbol>'''
        
        return symbol, icon_name
    except Exception as e:
        print(f"Error processing {svg_file}: {e}")
        return None, None

def create_sprite_file():
    """Create or update the icons.svg sprite file."""
    svg_files = list(ICONS_DIR.glob("icon-*.svg"))
    
    if not svg_files:
        print("No icon-*.svg files found in the icons directory.")
        print("Please export icons from Figma first.")
        return
    
    symbols = []
    icon_names = []
    
    print(f"Found {len(svg_files)} icon files. Converting to sprite format...")
    
    for svg_file in sorted(svg_files):
        symbol, icon_name = convert_svg_to_symbol(svg_file)
        if symbol:
            symbols.append(symbol)
            icon_names.append(icon_name)
            print(f"  ✓ Converted: {svg_file.name} → {icon_name}")
    
    if not symbols:
        print("No valid icons found to convert.")
        return
    
    # Create the sprite SVG
    sprite_content = f'''<!-- Techcloud ERP Theme Icons -->
<!-- Auto-generated sprite from individual SVG files -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
{chr(10).join(symbols)}
  </defs>
</svg>
'''
    
    # Write to icons.svg
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sprite_content)
    
    print(f"\n✓ Created sprite file: {OUTPUT_FILE}")
    print(f"  Total icons: {len(icon_names)}")
    print(f"\nIcons available:")
    for name in icon_names:
        print(f"  - {name}")
    print(f"\nUsage example:")
    print(f'  <svg class="icon"><use href="#{icon_names[0]}"></use></svg>')

if __name__ == "__main__":
    create_sprite_file()

