import re

with open('d:\\new-getit\\nexella-html\\searchengine.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Match everything before the main content (before smm-bg)
header_match = re.search(r'(.*?<body[^>]*>)', content, re.DOTALL)
# Match everything from the footer onwards
footer_match = re.search(r'(<!-- Main Footer -->\s*<footer.*)', content, re.DOTALL)

if header_match and footer_match:
    header = header_match.group(1)
    footer = footer_match.group(1)
    
    # Update body class for SEO page styles
    header = header.replace('<body>', '<body class="seo-page">')
    
    # Update CSS links
    header = re.sub(r'<link href="css/smm-theme.css" rel="stylesheet">', '<link href="css/seo-theme-unique.css" rel="stylesheet">', header)
    header = re.sub(r'<link href="css/smm-sections.css" rel="stylesheet">', '<link href="css/seo-sections-unique.css" rel="stylesheet">', header)
    header = re.sub(r'<link href="css/seo-sections.css" rel="stylesheet">', '', header)
    
    new_content = """
<!-- ===================== Global 3D Background ===================== -->
<div class="seo-bg" id="seoBg">
  <div class="seo-bg-grid"></div>
  <div class="seo-bg-glow-1"></div>
  <div class="seo-bg-glow-2"></div>
</div>

<!-- ===================== Centralized Holographic Hero Section ===================== -->
<section class="seo-hero" id="home">
  <!-- Holographic Search Scene behind the text -->
  <div class="seo-hero-holo" data-seo-scroll="fade-in">
     <div class="holo-search-box">
        <i class="fa-solid fa-magnifying-glass text-cyan"></i>
        <div class="holo-search-text text-mono">query="growth_marketing" | search...</div>
     </div>
     <div class="holo-result-card">
        <div class="holo-result-header">
           <div class="holo-dot"></div>
           <div class="holo-dot"></div>
        </div>
        <div class="holo-result-body">
           <span class="holo-rank text-purple">Rank #1</span>
           <div class="holo-line holo-line-long"></div>
           <div class="holo-line holo-line-short"></div>
        </div>
     </div>
  </div>

  <div class="seo-container seo-hero-content" data-seo-scroll="fade-up">
    <h2 class="seo-subtitle text-cyan text-mono">[ SEARCH ENGINE OPTIMIZATION ]</h2>
    <h1 class="seo-title">Dominate Search.<br>Capture <span class="text-purple">Intent</span>.</h1>
    <p class="seo-desc">Turn organic search into your most powerful growth engine. We combine technical precision, data-driven strategy, and authoritative content to dominate Google rankings.</p>
    <div class="seo-btn-group justify-center">
      <a href="#contact" class="seo-btn seo-btn-primary">Get Started</a>
      <a href="#process" class="seo-btn seo-btn-outline">View Our Strategy</a>
    </div>
  </div>
</section>

<!-- ===================== Asymmetrical "Bento Box" Features ===================== -->
<section class="seo-features" id="features">
  <div class="seo-container">
    <div class="seo-section-header text-center" data-seo-scroll="fade-up">
      <h2 class="text-mono text-cyan">{"features": "comprehensive"}</h2>
      <h1 class="seo-section-title">The SEO Arsenal</h1>
    </div>
    
    <div class="seo-bento-grid">
      <!-- Feature 1: Large Card -->
      <div class="seo-bento-card bento-large" data-seo-scroll="fade-up">
         <div class="bento-icon">⚙️</div>
         <h3>Technical SEO</h3>
         <p>We rebuild your website's foundation for lightning-fast speeds, flawless crawlability, and perfect mobile indexing, ensuring Google loves your site architecture.</p>
         <div class="bento-visual tech-visual">
            <div class="code-line">Status: <span class="text-cyan">200 OK</span></div>
            <div class="code-line">Core Web Vitals: <span class="text-cyan">Passed</span></div>
         </div>
      </div>
      
      <!-- Feature 2: Standard Card -->
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.1s;">
         <div class="bento-icon">📄</div>
         <h3>On-Page SEO</h3>
         <p>Precision-optimized content, meta tags, and internal linking structures.</p>
      </div>
      
      <!-- Feature 3: Standard Card -->
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.2s;">
         <div class="bento-icon">🔍</div>
         <h3>Keyword Strategy</h3>
         <p>Targeting high-intent search queries that drive actual revenue.</p>
      </div>
      
      <!-- Feature 4: Wide Card -->
      <div class="seo-bento-card bento-wide" data-seo-scroll="fade-up">
         <div class="bento-content-split">
            <div>
               <div class="bento-icon">🔗</div>
               <h3>Off-Page & Authority</h3>
               <p>We build high-quality, authoritative backlinks and execute digital PR campaigns that signal overwhelming trust and relevance to search engines.</p>
            </div>
            <div class="bento-visual link-visual">
               <div class="node central-node"></div>
               <div class="node outer-node n1"></div>
               <div class="node outer-node n2"></div>
               <div class="node outer-node n3"></div>
            </div>
         </div>
      </div>
      
      <!-- Feature 5: Standard Card -->
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.1s;">
         <div class="bento-icon">📍</div>
         <h3>Local SEO</h3>
         <p>Dominate local map packs and capture nearby customers.</p>
      </div>
      
      <!-- Feature 6: Standard Card -->
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.2s;">
         <div class="bento-icon">✍️</div>
         <h3>Content Strategy</h3>
         <p>Authoritative, helpful content designed to rank and convert.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===================== Data-Stream Growth Journey ===================== -->
<section class="seo-journey" id="growth">
  <div class="seo-container">
    <div class="seo-section-header text-center" data-seo-scroll="fade-up">
      <h2 class="text-mono text-purple">["visibility", "traffic", "growth"]</h2>
      <h1 class="seo-section-title">The Conversion Data Stream</h1>
    </div>
    
    <div class="seo-data-stream-container">
       <svg class="data-stream-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M50,100 C250,-50 350,250 650,50 S850,150 950,50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
          <path d="M50,100 C250,-50 350,250 650,50 S850,150 950,50" fill="none" stroke="url(#streamGradient)" stroke-width="4" class="stream-glow-path"/>
          <defs>
             <linearGradient id="streamGradient">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
             </linearGradient>
          </defs>
       </svg>
       
       <div class="stream-nodes">
          <div class="stream-node sn-1" data-seo-scroll="zoom-out">
             <div class="node-icon">👀</div>
             <h4>Visibility</h4>
          </div>
          <div class="stream-node sn-2" data-seo-scroll="zoom-out" style="transition-delay: 0.1s;">
             <div class="node-icon">🚀</div>
             <h4>Traffic</h4>
          </div>
          <div class="stream-node sn-3" data-seo-scroll="zoom-out" style="transition-delay: 0.2s;">
             <div class="node-icon">🎯</div>
             <h4>Leads</h4>
          </div>
          <div class="stream-node sn-4" data-seo-scroll="zoom-out" style="transition-delay: 0.3s;">
             <div class="node-icon">💰</div>
             <h4>Growth</h4>
          </div>
       </div>
    </div>
  </div>
</section>

<!-- ===================== Holographic Ring Results ===================== -->
<section class="seo-results" id="results">
  <div class="seo-container">
    <div class="seo-results-grid">
       <div class="result-holo-box" data-seo-scroll="fade-up">
          <div class="holo-ring"></div>
          <h3 class="counter-wrap"><span class="counter text-cyan" data-target="150">0</span>%</h3>
          <p>Organic Traffic</p>
       </div>
       <div class="result-holo-box" data-seo-scroll="fade-up" style="transition-delay: 0.1s;">
          <div class="holo-ring"></div>
          <h3 class="counter-wrap"><span class="counter text-purple" data-target="85">0</span>%</h3>
          <p>Search Visibility</p>
       </div>
       <div class="result-holo-box" data-seo-scroll="fade-up" style="transition-delay: 0.2s;">
          <div class="holo-ring"></div>
          <h3 class="counter-wrap"><span class="counter text-cyan" data-target="60">0</span>%</h3>
          <p>Qualified Leads</p>
       </div>
       <div class="result-holo-box" data-seo-scroll="fade-up" style="transition-delay: 0.3s;">
          <div class="holo-ring"></div>
          <h3 class="counter-wrap text-purple">#1</h3>
          <p>Google Rankings</p>
       </div>
    </div>
  </div>
</section>

<!-- ===================== Why Choose Us ===================== -->
<section class="seo-why" id="why">
  <div class="seo-container">
    <div class="seo-section-header text-center" data-seo-scroll="fade-up">
      <h2 class="text-mono text-cyan">system.evaluate(agency)</h2>
      <h1 class="seo-section-title">The SEO Advantage</h1>
    </div>
    
    <div class="seo-bento-grid">
      <div class="seo-bento-card" data-seo-scroll="fade-up">
         <div class="bento-icon">📈</div>
         <h3>Data-Driven Strategy</h3>
         <p>Every decision is backed by comprehensive data analysis and market research.</p>
      </div>
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.1s;">
         <div class="bento-icon">🛡️</div>
         <h3>White-Hat SEO</h3>
         <p>Ethical, sustainable strategies that protect and build your long-term authority.</p>
      </div>
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.2s;">
         <div class="bento-icon">📊</div>
         <h3>Transparent Reporting</h3>
         <p>Clear, actionable reports so you always know exactly how your campaign is performing.</p>
      </div>
      <div class="seo-bento-card" data-seo-scroll="fade-up" style="transition-delay: 0.3s;">
         <div class="bento-icon">🌱</div>
         <h3>Long-Term Growth</h3>
         <p>Building a foundation that continues to generate traffic and leads for years to come.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===================== Circuit-Board Process Timeline ===================== -->
<section class="seo-process" id="process">
  <div class="seo-container">
    <div class="seo-section-header" data-seo-scroll="fade-up">
      <h2 class="text-mono text-purple">initiate_process()</h2>
      <h1 class="seo-section-title">Execution Architecture</h1>
    </div>
    
    <div class="circuit-timeline">
      <div class="circuit-line"></div>
      
      <div class="circuit-node-wrap" data-seo-scroll="fade-left">
         <div class="circuit-node"></div>
         <div class="circuit-content">
            <span class="text-cyan text-mono">01 — Audit</span>
            <h3>Performance Analysis</h3>
            <p>Comprehensive technical and content analysis of your current digital footprint.</p>
         </div>
      </div>
      
      <div class="circuit-node-wrap alt" data-seo-scroll="fade-right">
         <div class="circuit-node"></div>
         <div class="circuit-content">
            <span class="text-purple text-mono">02 — Research</span>
            <h3>Keyword Intelligence</h3>
            <p>Identifying high-value, high-intent search terms to target.</p>
         </div>
      </div>
      
      <div class="circuit-node-wrap" data-seo-scroll="fade-left">
         <div class="circuit-node"></div>
         <div class="circuit-content">
            <span class="text-cyan text-mono">03 — Execution</span>
            <h3>On-Page & Technical</h3>
            <p>Deploying critical site updates and content optimization strategies.</p>
         </div>
      </div>
      
      <div class="circuit-node-wrap alt" data-seo-scroll="fade-right">
         <div class="circuit-node"></div>
         <div class="circuit-content">
            <span class="text-purple text-mono">04 — Authority</span>
            <h3>Off-Page & Link Building</h3>
            <p>Acquiring powerful backlinks from trusted industry domains.</p>
         </div>
      </div>
      
      <div class="circuit-node-wrap" data-seo-scroll="fade-left">
         <div class="circuit-node"></div>
         <div class="circuit-content">
            <span class="text-cyan text-mono">05 — Scale</span>
            <h3>Tracking & Optimization</h3>
            <p>Continuous monitoring, tweaking, and scaling of successful campaigns.</p>
         </div>
      </div>
      
    </div>
  </div>
</section>

<!-- ===================== Final Holographic CTA ===================== -->
<section class="seo-cta" id="cta">
   <div class="cta-holo-sphere"></div>
   <div class="seo-container cta-content text-center" data-seo-scroll="fade-up">
      <h1 class="seo-section-title">Ready to Dominate <span class="text-cyan">Search?</span></h1>
      <p class="seo-desc" style="margin: 0 auto 40px;">Turn search traffic into real business growth with a strategic SEO campaign built around your goals.</p>
      <a href="#contact" class="seo-btn seo-btn-primary seo-btn-large">Start Your SEO Journey</a>
   </div>
</section>
"""
    
    # Update JS script at bottom
    footer = footer.replace('<script src="js/smm-animations.js"></script>', '<script src="js/seo-unique-animations.js"></script>')
    
    with open('d:\\new-getit\\nexella-html\\searchengine.html', 'w', encoding='utf-8') as new_f:
        new_f.write(header + new_content + footer)
    print("Overwrote searchengine.html with unique design")
