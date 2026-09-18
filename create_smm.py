import re

with open('d:\\new-getit\\nexella-html\\google-ads.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Match everything before the Lumine hero
header_match = re.search(r'(.*?)</aside>\s*<!-- ===================== Lumine Insights Hero ===================== -->', content, re.DOTALL)
# Match everything from the footer onwards
footer_match = re.search(r'(<!-- Main Footer -->\s*<footer.*)', content, re.DOTALL)

if header_match and footer_match:
    header = header_match.group(1) + "</aside>\n"
    footer = footer_match.group(1)
    
    # Update title
    header = header.replace('<title>Google & Meta Ads Services - GetIt Media</title>', '<title>Social Media Marketing - GetIt Media</title>')
    
    # Update CSS links (remove google-ads specific ones, add smm ones)
    header = header.replace('<link href="css/meta-ads.css" rel="stylesheet">', '<link href="css/smm-theme.css" rel="stylesheet">\n    <link href="css/smm-sections.css" rel="stylesheet">')
    header = header.replace('<link href="css/3d-carousel.css" rel="stylesheet">', '')
    header = header.replace('<link href="css/lumine-hero.css" rel="stylesheet">', '')

    new_content = """
<!-- ===================== 3D Background ===================== -->
<div class="smm-bg" id="smmBg">
  <div class="smm-bg-grid"></div>
  <div class="smm-bg-particles" id="bgParticles"></div>
  <div class="smm-bg-glow"></div>
</div>

<!-- ===================== Hero Section ===================== -->
<section class="smm-hero" id="home">
  <div class="smm-container smm-hero-grid">
    <div class="smm-hero-content" data-scroll="fade-up">
      <h2 class="smm-subtitle">SOCIAL MEDIA MARKETING</h2>
      <h1 class="smm-title">Grow Your Brand. <br>Engage Your <span class="text-neon">Audience</span>.</h1>
      <p class="smm-desc">Build a powerful social media presence with creative content, strategic campaigns, audience engagement, and data-driven marketing that turns followers into customers.</p>
      <div class="smm-btn-group">
        <a href="#contact" class="smm-btn smm-btn-primary">Get Started</a>
        <a href="#services" class="smm-btn smm-btn-outline">Our Services</a>
      </div>
    </div>
    <div class="smm-hero-visual" data-scroll="fade-in">
      <div class="smm-3d-scene" id="heroScene">
        <div class="phone-mockup">
          <div class="phone-screen">
             <!-- Placeholder for social feed UI -->
             <div class="ui-header"></div>
             <div class="ui-post"></div>
             <div class="ui-actions"></div>
          </div>
        </div>
        <!-- Floating Elements -->
        <div class="float-item float-like">❤️ 12K</div>
        <div class="float-item float-comment">💬 4.2K</div>
        <div class="float-item float-chart">
           <svg viewBox="0 0 100 50"><path d="M0,50 L20,30 L40,40 L70,10 L100,20" fill="none" stroke="#00ff66" stroke-width="4"/></svg>
        </div>
        <div class="float-item float-ring"></div>
      </div>
    </div>
  </div>
</section>

<!-- ===================== Services Section ===================== -->
<section class="smm-services" id="services">
  <div class="smm-container">
    <div class="smm-section-header" data-scroll="fade-up">
      <h2>Our Social Media Marketing <span class="text-neon">Services</span></h2>
      <p>Comprehensive solutions to dominate the digital landscape.</p>
    </div>
    <div class="smm-services-grid" id="servicesGrid">
      <!-- Generated via JS or CSS grid -->
      <div class="smm-card" data-scroll="scale-up">
         <div class="smm-card-icon">🎯</div>
         <h3>Social Media Strategy</h3>
         <p>Data-driven roadmaps designed around your business goals.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.1s;">
         <div class="smm-card-icon">✨</div>
         <h3>Content Creation</h3>
         <p>Eye-catching graphics and videos designed to stop scrolling.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.2s;">
         <div class="smm-card-icon">📱</div>
         <h3>Social Media Management</h3>
         <p>Consistent posting, monitoring, and brand voice alignment.</p>
      </div>
      <!-- Additional cards will go here -->
    </div>
  </div>
</section>

<!-- ===================== Growth Dashboard Section ===================== -->
<section class="smm-growth" id="growth">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>Turn Social Media Into <span class="text-neon">Business Growth</span></h2>
    </div>
    <div class="smm-dashboard-wrapper" data-scroll="fade-in">
       <!-- Dashboard UI -->
       <div class="smm-dash-main">
          <div class="smm-dash-chart">
             <svg class="growth-line" viewBox="0 0 800 300" preserveAspectRatio="none">
                <path d="M0,300 C100,250 200,280 300,150 C400,50 500,100 600,20 800,0" fill="none" stroke="url(#neonGradient)" stroke-width="6"/>
                <defs>
                   <linearGradient id="neonGradient">
                      <stop offset="0%" stop-color="#00ff66"/>
                      <stop offset="100%" stop-color="#0ea5e9"/>
                   </linearGradient>
                </defs>
             </svg>
          </div>
       </div>
    </div>
  </div>
</section>

<!-- ===================== Content Creation Section ===================== -->
<section class="smm-content-creation" id="content">
  <div class="smm-container smm-split">
     <div class="smm-split-left" data-scroll="fade-right">
        <div class="smm-content-3d">
           <!-- Rotating composition -->
           <div class="comp-item reel-card"></div>
           <div class="comp-item story-card"></div>
           <div class="comp-item post-card"></div>
        </div>
     </div>
     <div class="smm-split-right" data-scroll="fade-left">
        <h2>Content That <span class="text-neon">Gets Attention</span></h2>
        <p>Creative and strategic content that helps brands attract, engage, and convert audiences in a crowded digital space.</p>
        <a href="#contact" class="smm-btn smm-btn-primary mt-4">Create Your Strategy</a>
     </div>
  </div>
</section>

<!-- ===================== Platforms Section ===================== -->
<section class="smm-platforms" id="platforms">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>We Grow Brands Across <span class="text-neon">Every Platform</span></h2>
    </div>
    <div class="smm-orbit-container" data-scroll="scale-in">
       <div class="orbit-center">Social<br>Media</div>
       <div class="orbit-ring ring-1">
          <div class="orbit-icon icon-ig"><i class="fa-brands fa-instagram"></i></div>
          <div class="orbit-icon icon-fb"><i class="fa-brands fa-facebook-f"></i></div>
       </div>
       <div class="orbit-ring ring-2">
          <div class="orbit-icon icon-yt"><i class="fa-brands fa-youtube"></i></div>
          <div class="orbit-icon icon-in"><i class="fa-brands fa-linkedin-in"></i></div>
       </div>
       <div class="orbit-ring ring-3">
          <div class="orbit-icon icon-tk"><i class="fa-brands fa-tiktok"></i></div>
          <div class="orbit-icon icon-x"><i class="fa-brands fa-x-twitter"></i></div>
       </div>
    </div>
  </div>
</section>

<!-- ===================== Final CTA ===================== -->
<section class="smm-cta" id="cta">
   <div class="cta-glow-sphere"></div>
   <div class="smm-container cta-content" data-scroll="fade-up">
      <h2>Ready to Grow Your Brand on <span class="text-neon">Social Media?</span></h2>
      <p>Let's build a social media presence that attracts attention, creates engagement, and generates real business results.</p>
      <a href="#contact" class="smm-btn smm-btn-primary smm-btn-large">Start Your Social Media Journey</a>
   </div>
</section>
"""
    
    # Update JS script at bottom
    footer = footer.replace('<script src="js/3d-carousel.js"></script>', '<script src="js/smm-animations.js"></script>')
    
    with open('d:\\new-getit\\nexella-html\\socialmedia.html', 'w', encoding='utf-8') as new_f:
        new_f.write(header + new_content + footer)
    print("Created socialmedia.html")
