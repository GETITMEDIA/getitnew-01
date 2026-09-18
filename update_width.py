import re

with open('d:\\new-getit\\nexella-html\\css\\3d-carousel.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update variables
content = content.replace('--card-width: 320px;', '--card-width: 400px;')
content = content.replace('--card-width-featured: 320px;', '--card-width-featured: 400px;')

# 2. Update transform for State 1, 2, 3
content = content.replace('translateX(380px)', 'translateX(450px)')
content = content.replace('translateX(-380px)', 'translateX(-450px)')

content = content.replace('translateX(650px)', 'translateX(780px)')
content = content.replace('translateX(-650px)', 'translateX(-780px)')

content = content.replace('translateX(850px)', 'translateX(1050px)')
content = content.replace('translateX(-850px)', 'translateX(-1050px)')

# 3. Update media queries slightly
content = content.replace('translateX(250px)', 'translateX(300px)')
content = content.replace('translateX(-250px)', 'translateX(-300px)')

content = content.replace('translateX(450px)', 'translateX(550px)')
content = content.replace('translateX(-450px)', 'translateX(-550px)')

with open('d:\\new-getit\\nexella-html\\css\\3d-carousel.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated width successfully")
