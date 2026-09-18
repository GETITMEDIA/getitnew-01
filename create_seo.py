import re

with open('d:\\new-getit\\nexella-html\\socialmedia.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Match everything before the main content (before smm-bg)
header_match = re.search(r'(.*?<!-- ===================== 3D Background ===================== -->)', content, re.DOTALL)
# Match everything from the footer onwards
footer_match = re.search(r'(<!-- Main Footer -->\s*<footer.*)', content, re.DOTALL)

if header_match and footer_match:
    header = header_match.group(1)
    footer = footer_match.group(1)
    
    # Update title
    header = header.replace('<title>Social Media Marketing - GetIt Media</title>', '<title>Search Engine Optimization - GetIt Media</title>')
    
    # Add new css file for seo specific sections
    header = header.replace('<link href="css/smm-sections.css" rel="stylesheet">', '<link href="css/smm-sections.css" rel="stylesheet">\n    <link href="css/seo-sections.css" rel="stylesheet">')

    new_content = """
<div class="smm-bg" id="smmBg">
  <div class="smm-bg-grid"></div>
  <div class="smm-bg-particles" id="bgParticles"></div>
  <div class="smm-bg-glow"></div>
</div>

<!-- ===================== Hero Section ===================== -->
<section class="smm-hero" id="home">
  <div class="smm-container smm-hero-grid">
    <div class="smm-hero-content" data-scroll="fade-up">
      <h2 class="smm-subtitle">SEARCH ENGINE OPTIMIZATION</h2>
      <h1 class="smm-title">Grow Your Visibility.<br>Reach the Right <span class="text-neon">Audience</span>.</h1>
      <p class="smm-desc">Drive more organic growth with our premium SEO service. We help businesses improve Google rankings, increase organic traffic, generate qualified leads, and build long-term online visibility.</p>
      <div class="smm-btn-group">
        <a href="#contact" class="smm-btn smm-btn-primary">Get Started</a>
        <a href="#process" class="smm-btn smm-btn-outline">View Our SEO Strategy</a>
      </div>
    </div>
    <div class="smm-hero-visual" data-scroll="fade-in">
      <div class="smm-3d-scene" id="heroScene">
        <div class="seo-google-mockup">
          <div class="seo-search-bar">
             <i class="fa-solid fa-magnifying-glass search-icon"></i>
             <div class="search-text">how to grow my business online</div>
          </div>
          <div class="seo-result">
             <div class="seo-result-url">https://www.yourdomain.com</div>
             <div class="seo-result-title">#1 Solution for Business Growth</div>
             <div class="seo-result-desc">Discover the proven strategies to scale your organic traffic and generate high-quality leads...</div>
          </div>
        </div>
        <!-- Floating Elements -->
        <div class="float-item float-rank">🏆 Rank #1</div>
        <div class="float-item float-traffic">📈 +200% Traffic</div>
        <div class="float-item float-keyword">"Best Services"</div>
        <div class="float-item float-ring"></div>
      </div>
    </div>
  </div>
</section>

<!-- ===================== SEO Service Features ===================== -->
<section class="smm-services" id="features">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>Comprehensive SEO <span class="text-neon">Features</span></h2>
      <p>Everything you need to dominate the search results.</p>
    </div>
    <div class="smm-services-grid" id="servicesGrid">
      
      <div class="smm-card" data-scroll="scale-up">
         <div class="smm-card-icon">⚙️</div>
         <h3>Technical SEO</h3>
         <p>Improve website structure, speed, crawlability, indexing, and technical performance.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.1s;">
         <div class="smm-card-icon">📄</div>
         <h3>On-Page SEO</h3>
         <p>Optimize content, headings, metadata, URLs, internal linking, and page structure.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.2s;">
         <div class="smm-card-icon">🔍</div>
         <h3>Keyword Research</h3>
         <p>Discover high-value keywords with strong search intent and business potential.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.3s;">
         <div class="smm-card-icon">📍</div>
         <h3>Local SEO</h3>
         <p>Improve local search visibility, Google Business Profile performance, and location-based rankings.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.4s;">
         <div class="smm-card-icon">🔗</div>
         <h3>Off-Page SEO</h3>
         <p>Build authority through quality backlinks, digital PR, and strategic off-page optimization.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.5s;">
         <div class="smm-card-icon">✍️</div>
         <h3>SEO Content Strategy</h3>
         <p>Create search-focused content designed to attract visitors and convert them into customers.</p>
      </div>

    </div>
  </div>
</section>

<!-- ===================== SEO Growth Visualization ===================== -->
<section class="seo-growth-journey" id="growth">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>The Path to <span class="text-neon">Business Growth</span></h2>
    </div>
    
    <div class="seo-journey-map" data-scroll="fade-in">
       <div class="journey-line"></div>
       
       <div class="journey-step">
          <div class="journey-icon">👀</div>
          <h4>Search Visibility</h4>
       </div>
       <div class="journey-step">
          <div class="journey-icon">🚀</div>
          <h4>Organic Traffic</h4>
       </div>
       <div class="journey-step">
          <div class="journey-icon">🎯</div>
          <h4>Qualified Leads</h4>
       </div>
       <div class="journey-step">
          <div class="journey-icon">💰</div>
          <h4>Business Growth</h4>
       </div>
    </div>
    
  </div>
</section>

<!-- ===================== Results Section ===================== -->
<section class="seo-results" id="results">
  <div class="smm-container">
    <div class="seo-results-grid">
       <div class="result-box" data-scroll="fade-up">
          <h3 class="counter-wrap"><span class="counter" data-target="150">0</span>%</h3>
          <p>Organic Traffic</p>
       </div>
       <div class="result-box" data-scroll="fade-up" style="transition-delay: 0.1s;">
          <h3 class="counter-wrap"><span class="counter" data-target="85">0</span>%</h3>
          <p>Search Visibility</p>
       </div>
       <div class="result-box" data-scroll="fade-up" style="transition-delay: 0.2s;">
          <h3 class="counter-wrap"><span class="counter" data-target="60">0</span>%</h3>
          <p>Qualified Leads</p>
       </div>
       <div class="result-box" data-scroll="fade-up" style="transition-delay: 0.3s;">
          <h3 class="counter-wrap"><span class="text-neon">#1</span></h3>
          <p>Top Google Rankings</p>
       </div>
    </div>
  </div>
</section>

<!-- ===================== Why Choose Us ===================== -->
<section class="smm-why" id="why">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>Why Choose Our SEO <span class="text-neon">Service?</span></h2>
    </div>
    <div class="smm-services-grid">
      <div class="smm-card" data-scroll="scale-up">
         <div class="smm-card-icon">📈</div>
         <h3>Data-Driven Strategy</h3>
         <p>Every decision is backed by comprehensive data analysis and market research.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.1s;">
         <div class="smm-card-icon">🛡️</div>
         <h3>White-Hat SEO</h3>
         <p>Ethical, sustainable strategies that protect and build your long-term authority.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.2s;">
         <div class="smm-card-icon">📊</div>
         <h3>Transparent Reporting</h3>
         <p>Clear, actionable reports so you always know exactly how your campaign is performing.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.3s;">
         <div class="smm-card-icon">🌱</div>
         <h3>Long-Term Growth</h3>
         <p>Building a foundation that continues to generate traffic and leads for years to come.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===================== Process Section ===================== -->
<section class="smm-process" id="process">
  <div class="smm-container">
    <div class="smm-section-header" data-scroll="fade-up">
      <h2>Our SEO <span class="text-neon">Process</span></h2>
    </div>
    <div class="smm-timeline">
      <div class="timeline-line"></div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">01</div>
         <div class="step-content">
            <h3>SEO Audit</h3>
            <p>Comprehensive analysis of your current website performance.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">02</div>
         <div class="step-content">
            <h3>Keyword Research</h3>
            <p>Identifying the most valuable search terms for your business.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">03</div>
         <div class="step-content">
            <h3>Strategy Planning</h3>
            <p>Developing a customized roadmap for search dominance.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">04</div>
         <div class="step-content">
            <h3>On-Page Optimization</h3>
            <p>Perfecting content, meta tags, and internal structure.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">05</div>
         <div class="step-content">
            <h3>Technical Optimization</h3>
            <p>Enhancing speed, mobile-friendliness, and crawlability.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">06</div>
         <div class="step-content">
            <h3>Content & Link Building</h3>
            <p>Creating authority content and acquiring high-quality backlinks.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">07</div>
         <div class="step-content">
            <h3>Tracking & Reporting</h3>
            <p>Continuous monitoring, tweaking, and transparent progress reporting.</p>
         </div>
      </div>
      
    </div>
  </div>
</section>

<!-- ===================== Final CTA ===================== -->
<section class="smm-cta" id="cta">
   <div class="cta-glow-sphere"></div>
   <div class="smm-container cta-content" data-scroll="fade-up">
      <h2>Ready to Grow Your <span class="text-neon">Google Rankings?</span></h2>
      <p>Turn search traffic into real business growth with a strategic SEO campaign built around your goals.</p>
      <a href="#contact" class="smm-btn smm-btn-primary smm-btn-large">Start Your SEO Journey</a>
   </div>
</section>
"""
    
    with open('d:\\new-getit\\nexella-html\\searchengine.html', 'w', encoding='utf-8') as new_f:
        new_f.write(header + new_content + footer)
    print("Created searchengine.html")
