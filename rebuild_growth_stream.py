import re

# 1. Update HTML
with open('d:\\new-getit\\nexella-html\\searchengine.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

old_stream_html = """    <div class="seo-data-stream-container">
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
    </div>"""

new_pipeline_html = """    <div class="seo-pipeline-container">
       <div class="pipeline-track">
          <div class="pipeline-laser"></div>
       </div>
       
       <div class="pipeline-nodes">
          <div class="pipeline-node" data-seo-scroll="fade-up">
             <div class="p-icon-box"><i class="fa-solid fa-eye"></i></div>
             <div class="p-content">
                <span class="p-step text-cyan text-mono">01</span>
                <h4>Visibility</h4>
             </div>
          </div>
          
          <div class="pipeline-node" data-seo-scroll="fade-up" style="transition-delay: 0.1s;">
             <div class="p-icon-box"><i class="fa-solid fa-chart-line"></i></div>
             <div class="p-content">
                <span class="p-step text-purple text-mono">02</span>
                <h4>Traffic</h4>
             </div>
          </div>
          
          <div class="pipeline-node" data-seo-scroll="fade-up" style="transition-delay: 0.2s;">
             <div class="p-icon-box"><i class="fa-solid fa-bullseye"></i></div>
             <div class="p-content">
                <span class="p-step text-cyan text-mono">03</span>
                <h4>Leads</h4>
             </div>
          </div>
          
          <div class="pipeline-node" data-seo-scroll="fade-up" style="transition-delay: 0.3s;">
             <div class="p-icon-box"><i class="fa-solid fa-sack-dollar"></i></div>
             <div class="p-content">
                <span class="p-step text-purple text-mono">04</span>
                <h4>Growth</h4>
             </div>
          </div>
       </div>
    </div>"""

html_content = html_content.replace(old_stream_html, new_pipeline_html)

with open('d:\\new-getit\\nexella-html\\searchengine.html', 'w', encoding='utf-8') as f:
    f.write(html_content)


# 2. Update CSS
with open('d:\\new-getit\\nexella-html\\css\\seo-sections-unique.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace Data-Stream CSS with Pipeline CSS
css_pattern = re.compile(r'/\* ---------------- Data-Stream Growth ---------------- \*/.*?/\* ---------------- Results ---------------- \*/', re.DOTALL)

new_pipeline_css = """/* ---------------- Data Pipeline Growth ---------------- */
.seo-journey { padding: 120px 0; background: var(--seo-bg-surface-light); overflow: hidden; }

.seo-pipeline-container {
  position: relative;
  margin-top: 80px;
  padding: 40px 0;
}

.pipeline-track {
  position: absolute;
  top: 50%; left: 5%; right: 5%;
  height: 4px;
  background: rgba(255,255,255,0.05);
  transform: translateY(-50%);
  border-radius: 2px;
  z-index: 1;
}

.pipeline-laser {
  position: absolute;
  top: -1px; left: 0;
  height: 6px; width: 150px;
  background: linear-gradient(90deg, transparent, var(--seo-cyan), #fff);
  border-radius: 3px;
  box-shadow: 0 0 20px var(--seo-cyan-glow-strong);
  animation: laserShoot 4s linear infinite;
}

@keyframes laserShoot {
  0% { left: -10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 110%; opacity: 0; }
}

.pipeline-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  padding: 0 5%;
}

.pipeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 160px;
}

.p-icon-box {
  width: 80px; height: 80px;
  background: var(--seo-bg);
  border: 2px solid var(--seo-glass-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  margin-bottom: 24px;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
  position: relative;
}

.p-icon-box::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--seo-cyan), var(--seo-purple));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pipeline-node:hover .p-icon-box {
  transform: translateY(-10px);
  border-color: transparent;
}
.pipeline-node:hover .p-icon-box::after {
  opacity: 1;
  box-shadow: 0 0 30px var(--seo-purple-glow);
}

.p-content {
  background: var(--seo-glass-bg);
  border: 1px solid var(--seo-glass-border);
  padding: 15px 20px;
  border-radius: 12px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.p-step {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  letter-spacing: 2px;
}

.p-content h4 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

/* Responsive */
@media (max-width: 992px) {
  .pipeline-nodes { flex-wrap: wrap; gap: 60px; justify-content: center; }
  .pipeline-track { display: none; }
}

/* ---------------- Results ---------------- */"""

css_content = css_pattern.sub(new_pipeline_css, css_content)

# Fix missing mobile responsive logic in original CSS if we overwrote it, actually we'll just let the current media queries handle the rest.
# The original CSS had some mobile overrides for the old data stream, let's strip those too to prevent conflicts.

cleanup_pattern = re.compile(r'\.seo-data-stream-container \{ height: 600px; \}.*?\.sn-4 \{ top: 500px; left: 50%; \}', re.DOTALL)
css_content = cleanup_pattern.sub('', css_content)

with open('d:\\new-getit\\nexella-html\\css\\seo-sections-unique.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Redesigned the Growth Data Stream section.")
