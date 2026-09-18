import os

def update_footer():
    index_file = r'd:\new-getit\nexella-html\index.html'
    price_file = r'd:\new-getit\nexella-html\price.html'

    with open(index_file, 'r', encoding='utf-8') as f:
        index_content = f.read()

    with open(price_file, 'r', encoding='utf-8') as f:
        price_content = f.read()
    
    # Extract footer from index.html
    start_marker = '<!-- Main Footer -->'
    end_marker = '<!--End Main Footer -->'
    
    start_idx = index_content.find(start_marker)
    end_idx = index_content.find(end_marker) + len(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find footer in index.html")
        return
        
    new_footer = index_content[start_idx:end_idx]
    
    # Extract footer to replace in price.html
    old_start_idx = price_content.find(start_marker)
    old_end_idx = price_content.find(end_marker) + len(end_marker)
    
    if old_start_idx == -1 or old_end_idx == -1:
        print("Could not find old footer in price.html")
        return
        
    updated_price_content = price_content[:old_start_idx] + new_footer + price_content[old_end_idx:]
    
    with open(price_file, 'w', encoding='utf-8') as f:
        f.write(updated_price_content)
        
    print("Successfully replaced footer in price.html")

if __name__ == '__main__':
    update_footer()
