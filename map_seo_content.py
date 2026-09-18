import re

with open('d:\\new-getit\\nexella-html\\searchengine.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Hero Description
content = content.replace(
    '<p class="seo-desc">Turn organic search into your most powerful growth engine. We combine technical precision, data-driven strategy, and authoritative content to dominate Google rankings.</p>',
    '<p class="seo-desc">For assistance with your SEO and organic search rankings, contact us. Our SEO efforts aid in generating search traffic for the appropriate keywords. We simultaneously optimise for users and search engines to create the ideal union.</p>'
)

# 2. Update Bento Box Features (6 Cards)
# Card 1 (Technical SEO -> On-Page SEO)
content = content.replace(
    '<h3>Technical SEO</h3>\n         <p>We rebuild your website\'s foundation for lightning-fast speeds, flawless crawlability, and perfect mobile indexing, ensuring Google loves your site architecture.</p>',
    '<h3>ON-PAGE SEO</h3>\n         <p>By implementing effective on-page SEO strategies, we follow an organized procedure to make your website effective and friendly.</p>'
)

# Card 2 (On-Page SEO -> Off-Page SEO)
content = content.replace(
    '<h3>On-Page SEO</h3>\n         <p>Precision-optimized content, meta tags, and internal linking structures.</p>',
    '<h3>OFF-PAGE SEO</h3>\n         <p>The foundation of a website will be its off-page activities, which we will use to maximise reach and increase the impact of on-page phrases.</p>'
)

# Card 3 (Keyword Strategy -> Content Marketing)
content = content.replace(
    '<h3>Keyword Strategy</h3>\n         <p>Targeting high-intent search queries that drive actual revenue.</p>',
    '<h3>CONTENT MARKETING</h3>\n         <p>To draw your target audience, we provide content that is both highly engaging and convertible in a variety of formats.</p>'
)

# Card 4 (Off-Page & Authority -> Link Building)
content = content.replace(
    '<h3>Off-Page & Authority</h3>\n               <p>We build high-quality, authoritative backlinks and execute digital PR campaigns that signal overwhelming trust and relevance to search engines.</p>',
    '<h3>LINK BUILDING</h3>\n               <p>We engage in a skillful link-building activity that opens the way for easy website navigation and authority building.</p>'
)

# Card 5 (Local SEO -> Online Branding)
content = content.replace(
    '<h3>Local SEO</h3>\n         <p>Dominate local map packs and capture nearby customers.</p>',
    '<h3>ONLINE BRANDING</h3>\n         <p>We go a step further and do portion and trying to target to magnify the client\'s uniqueness.</p>'
)

# Card 6 (Content Strategy -> Social Media Optimization)
content = content.replace(
    '<h3>Content Strategy</h3>\n         <p>Authoritative, helpful content designed to rank and convert.</p>',
    '<h3>SOCIAL MEDIA OPTIMIZATION</h3>\n         <p>We offer dedicated social media marketing strategies that assist you in growing business.</p>'
)

# 3. Update "Why Choose Us" -> "Efficient Tools" (4 Cards)
content = content.replace(
    '<h1 class="seo-section-title">The SEO Advantage</h1>',
    '<h1 class="seo-section-title">Efficient SEO Tools</h1>'
)
content = content.replace(
    'system.evaluate(agency)',
    'system.analyze(tools)'
)

# Tool 1
content = content.replace(
    '<h3>Data-Driven Strategy</h3>\n         <p>Every decision is backed by comprehensive data analysis and market research.</p>',
    '<h3>Keyword Analyzing Tool</h3>\n         <p>When it comes to optimising your website, keywords are crucial. They direct visitors to your website.</p>'
)

# Tool 2
content = content.replace(
    '<h3>White-Hat SEO</h3>\n         <p>Ethical, sustainable strategies that protect and build your long-term authority.</p>',
    '<h3>Ranking Tools</h3>\n         <p>It is essential to monitor a website\'s ranking since it enables a business to identify the factors contributing to its success.</p>'
)

# Tool 3
content = content.replace(
    '<h3>Transparent Reporting</h3>\n         <p>Clear, actionable reports so you always know exactly how your campaign is performing.</p>',
    '<h3>Competitor Analyzing Tools</h3>\n         <p>Observing your competitors\' strategies and tactics is essential if you want to stay one step ahead of them.</p>'
)

# Tool 4
content = content.replace(
    '<h3>Long-Term Growth</h3>\n         <p>Building a foundation that continues to generate traffic and leads for years to come.</p>',
    '<h3>SEO Auditing Tools</h3>\n         <p>Businesses can detect issues and promptly correct them with the aid of auditing tools to prevent collapse.</p>'
)

with open('d:\\new-getit\\nexella-html\\searchengine.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Content mapped successfully.")
