import re

with open('d:\\new-getit\\nexella-html\\socialmedia.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add remaining service cards
services_replacement = """      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.3s;">
         <div class="smm-card-icon">📸</div>
         <h3>Instagram Marketing</h3>
         <p>Stunning aesthetics, engaging stories, and viral reels to capture your audience.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.4s;">
         <div class="smm-card-icon">👥</div>
         <h3>Facebook Marketing</h3>
         <p>Community building and targeted outreach for maximum visibility.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.5s;">
         <div class="smm-card-icon">▶️</div>
         <h3>YouTube Marketing</h3>
         <p>Long-form video strategy, SEO optimization, and channel growth.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.6s;">
         <div class="smm-card-icon">📈</div>
         <h3>Paid Social Advertising</h3>
         <p>High-ROI ad campaigns across all major social media platforms.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.7s;">
         <div class="smm-card-icon">🌟</div>
         <h3>Influencer Marketing</h3>
         <p>Partner with key creators to expand your brand's reach organically.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.8s;">
         <div class="smm-card-icon">🤝</div>
         <h3>Community Management</h3>
         <p>Active engagement and reputation management for your brand's followers.</p>
      </div>"""

content = content.replace("<!-- Additional cards will go here -->", services_replacement)


# 2. Add Why Choose Us & Process between Platforms and CTA
why_and_process = """
<!-- ===================== Why Choose Us ===================== -->
<section class="smm-why" id="why">
  <div class="smm-container">
    <div class="smm-section-header text-center" data-scroll="fade-up">
      <h2>Why Choose Our Social Media <span class="text-neon">Marketing?</span></h2>
    </div>
    <div class="smm-services-grid">
      <div class="smm-card" data-scroll="scale-up">
         <div class="smm-card-icon">🧠</div>
         <h3>Strategy First</h3>
         <p>Data-driven strategies designed around your business goals.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.1s;">
         <div class="smm-card-icon">🎨</div>
         <h3>Creative Content</h3>
         <p>Eye-catching content designed to stop scrolling.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.2s;">
         <div class="smm-card-icon">🌱</div>
         <h3>Audience Growth</h3>
         <p>Build an active and engaged online community.</p>
      </div>
      <div class="smm-card" data-scroll="scale-up" style="transition-delay: 0.3s;">
         <div class="smm-card-icon">📊</div>
         <h3>Measurable Results</h3>
         <p>Track performance, leads, engagement, and conversions.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===================== Process Section ===================== -->
<section class="smm-process" id="process">
  <div class="smm-container">
    <div class="smm-section-header" data-scroll="fade-up">
      <h2>Our Social Media Marketing <span class="text-neon">Process</span></h2>
    </div>
    <div class="smm-timeline">
      <div class="timeline-line"></div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">01</div>
         <div class="step-content">
            <h3>Research</h3>
            <p>Understand your brand, audience, competitors, and market.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">02</div>
         <div class="step-content">
            <h3>Strategy</h3>
            <p>Build a customized social media growth strategy.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">03</div>
         <div class="step-content">
            <h3>Content</h3>
            <p>Create engaging graphics, videos, reels, and campaigns.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">04</div>
         <div class="step-content">
            <h3>Publish</h3>
            <p>Schedule and publish content consistently.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">05</div>
         <div class="step-content">
            <h3>Optimize</h3>
            <p>Analyze performance and continuously improve campaigns.</p>
         </div>
      </div>
      
      <div class="timeline-step" data-scroll="fade-up">
         <div class="step-num">06</div>
         <div class="step-content">
            <h3>Grow</h3>
            <p>Scale successful campaigns and maximize business results.</p>
         </div>
      </div>
      
    </div>
  </div>
</section>
"""

content = content.replace("<!-- ===================== Final CTA ===================== -->", why_and_process + "\n<!-- ===================== Final CTA ===================== -->")

with open('d:\\new-getit\\nexella-html\\socialmedia.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated socialmedia.html with remaining sections")
