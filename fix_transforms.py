import re

with open('d:\\new-getit\\nexella-html\\css\\3d-carousel.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the double replacement
content = re.sub(r'(\.card-state-1 \{\n\s*transform:\s*translateX\()550px', r'\g<1>450px', content)
content = re.sub(r'(\.card-state--1 \{\n\s*transform:\s*translateX\()-550px', r'\g<1>-450px', content)

with open('d:\\new-getit\\nexella-html\\css\\3d-carousel.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed transforms successfully")
