import os

def update_navbar():
    index_file = r'd:\new-getit\nexella-html\index.html'
    price_file = r'd:\new-getit\nexella-html\price.html'

    with open(index_file, 'r', encoding='utf-8') as f:
        index_content = f.read()

    with open(price_file, 'r', encoding='utf-8') as f:
        price_content = f.read()
    
    # Extract navbar from index.html
    start_marker = '<!-- GetIt Media Navbar -->'
    end_marker = '</aside>'
    
    start_idx = index_content.find(start_marker)
    end_idx = index_content.find(end_marker) + len(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find new navbar in index.html")
        return
        
    new_navbar = index_content[start_idx:end_idx]
    
    # Extract header to replace in price.html
    old_start_marker = '<!-- Main Header-->'
    old_end_marker = '<!--End Main Header -->'
    
    old_start_idx = price_content.find(old_start_marker)
    old_end_idx = price_content.find(old_end_marker) + len(old_end_marker)
    
    if old_start_idx == -1 or old_end_idx == -1:
        print("Could not find old header in price.html")
        return
        
    updated_price_content = price_content[:old_start_idx] + new_navbar + price_content[old_end_idx:]
    
    with open(price_file, 'w', encoding='utf-8') as f:
        f.write(updated_price_content)
        
    print("Successfully replaced navbar in price.html")

if __name__ == '__main__':
    update_navbar()
