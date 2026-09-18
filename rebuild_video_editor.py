import re

# Read google-ads.html to extract head, header, and footer
with open('d:\\new-getit\\nexella-html\\google-ads.html', 'r', encoding='utf-8') as f:
    google_ads = f.read()

# Extract from <html> to </aside>
header_match = re.search(r'(<!DOCTYPE html>.*?<aside class="mobile-menu"[^>]*>.*?</aside>)', google_ads, re.DOTALL)
if header_match:
    header_html = header_match.group(1)
else:
    print("Could not extract header")
    exit(1)

# Extract from <footer class="lt-footer" id="contact"> to </html>
footer_match = re.search(r'(<footer class="lt-footer".*?</html>)', google_ads, re.DOTALL)
if footer_match:
    footer_html = footer_match.group(1)
else:
    print("Could not extract footer")
    exit(1)

# Modify header_html to include video-editor.css
header_html = header_html.replace('</head>', '    <link href="css/video-editor.css" rel="stylesheet">\n</head>')
# Add FontAwesome if not present
if 'font-awesome' not in header_html:
    header_html = header_html.replace('</head>', '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>')


# Now read the services sections from the existing video-editor.html
with open('d:\\new-getit\\nexella-html\\video-editor.html', 'r', encoding='utf-8') as f:
    video_editor = f.read()

services_match = re.search(r'(<!-- Services Sections -->.*?)<!-- CTA Section -->', video_editor, re.DOTALL)
if services_match:
    services_html = services_match.group(1)
else:
    print("Could not extract services")
    exit(1)

# Ensure images in services_html have theme-hue-shift class
services_html = services_html.replace('<img src="images/video/', '<img class="theme-hue-shift" src="images/video/')

cta_html = """
        <!-- CTA Section -->
        <section class="cta-section">
            <img src="images/video/blue_silk.jpg" alt="Background" class="cta-bg theme-hue-shift">
            <div class="cta-content fade-in">
                <h2 class="cta-title">LET'S CREATE</h2>
                <div class="social-icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-youtube"></i></a>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="#"><i class="fab fa-telegram-plane"></i></a>
                </div>
            </div>
        </section>
"""

new_hero = """
        <!-- Modern Split Hero Section -->
        <section class="video-hero">
            <div class="video-hero-bg">
                <div class="glow-orb orb-1"></div>
                <div class="glow-orb orb-2"></div>
            </div>
            <div class="container video-hero-container">
                <div class="video-hero-content">
                    <div class="hero-badge fade-in">Premium Video Studio</div>
                    <h1 class="hero-title fade-in" style="transition-delay: 0.1s;">CINEMATIC<br><span class="gradient-text">VIDEO EDITING</span></h1>
                    <p class="hero-subtitle fade-in" style="transition-delay: 0.2s;">Everything we do is inline on design. We love producing designs that perform and elevate your brand.</p>
                    <div class="hero-actions fade-in" style="transition-delay: 0.3s;">
                        <a href="#services" class="hero-btn-primary">Explore Services</a>
                        <a href="#contact" class="hero-btn-secondary"><i class="fas fa-play-circle"></i> Watch Showreel</a>
                    </div>
                </div>
                <div class="video-hero-visual fade-in" style="transition-delay: 0.4s;">
                    <div class="visual-wrapper">
                        <img src="images/video/hero_3d_sphere.jpg" alt="3D Sphere" class="theme-hue-shift floating-img">
                        <div class="visual-glow"></div>
                        <div class="visual-card-1">
                            <i class="fas fa-video"></i> 4K Ready
                        </div>
                        <div class="visual-card-2">
                            <i class="fas fa-magic"></i> VFX & Motion
                        </div>
                    </div>
                </div>
            </div>
        </section>
"""

# Combine everything
new_html = header_html + "\n" + new_hero + "\n" + services_html + "\n" + cta_html + "\n" + footer_html

with open('d:\\new-getit\\nexella-html\\video-editor.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("video-editor.html updated successfully!")
