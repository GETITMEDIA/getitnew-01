import os

def create_price_page():
    html_file = r'd:\new-getit\nexella-html\page-pricing.html'
    output_file = r'd:\new-getit\nexella-html\price.html'

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    header_end = content.find('<!-- Start main-content -->')
    footer_start = content.find('<!-- Main Footer -->')
    
    header = content[:header_end]
    footer = content[footer_start:]
    
    pricing_content = """
      <!-- Start main-content -->
      <section class="page-title theme-dark" style="background-image: url(images/inner/page-title-bg.png);">
          <div class="auto-container">
              <div class="title-outer text-center">
                  <h1 class="title" data-aos="fade-up">Plans That Power Your Digital Growth</h1>
                  <ul class="page-breadcrumb">
                      <li><a href="index.html">Home</a></li>
                      <li>Pricing</li>
                  </ul>
              </div>
          </div>
      </section>
      <!-- end main-content -->

      <!-- Hero / Introduction Section -->
      <section class="intro-section pb-3 pt-5 text-center">
          <div class="auto-container">
              <div class="row justify-content-center">
                  <div class="col-lg-8">
                      <h2 class="section-title mb-3">Flexible digital marketing, website, and creative solutions</h2>
                      <p class="section-text mb-4">
                          designed to help your business grow, connect, and perform online. GetIt Media Solutions provides customized digital solutions for businesses of different sizes.
                      </p>
                      <a href="page-contact.html" class="theme-btn btn-style-one"><span class="btn-title">GET A QUOTE</span></a>
                  </div>
              </div>
          </div>
      </section>

      <!-- Custom CSS for Premium Pricing Tables -->
      <style>
          .pricing-category-title {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 15px;
              color: #222;
          }
          .pricing-category-desc {
              font-size: 1.1rem;
              color: #555;
              margin-bottom: 40px;
          }
          .pricing-card {
              background: #fff;
              border-radius: 15px;
              padding: 40px 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
              height: 100%;
              border: 1px solid #eee;
          }
          .pricing-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 15px 40px rgba(0,0,0,0.1);
              border-color: var(--theme-color1);
          }
          .pricing-card.premium {
              background: linear-gradient(135deg, var(--theme-color1) 0%, var(--theme-color2) 100%);
              color: #fff;
          }
          .pricing-card.premium .plan-name,
          .pricing-card.premium .price,
          .pricing-card.premium .original-price,
          .pricing-card.premium ul li,
          .pricing-card.premium ul li i {
              color: #fff;
          }
          .plan-name {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 15px;
              color: #333;
          }
          .price-wrap {
              margin-bottom: 25px;
          }
          .original-price {
              font-size: 1.1rem;
              color: #888;
              text-decoration: line-through;
              margin-bottom: 5px;
              display: block;
          }
          .price {
              font-size: 2.5rem;
              font-weight: 700;
              color: var(--theme-color1);
              line-height: 1;
          }
          .features-list {
              list-style: none;
              padding: 0;
              margin: 0 0 30px 0;
              text-align: left;
          }
          .features-list li {
              margin-bottom: 12px;
              font-size: 1rem;
              color: #555;
              display: flex;
              align-items: flex-start;
          }
          .features-list li i {
              color: var(--theme-color1);
              margin-right: 10px;
              margin-top: 4px;
              font-size: 1rem;
          }
          .pricing-btn-wrap {
              text-align: center;
              margin-top: auto;
          }
          .btn-outline-theme {
              display: inline-block;
              padding: 12px 30px;
              border: 2px solid var(--theme-color1);
              color: var(--theme-color1);
              font-weight: 600;
              border-radius: 5px;
              transition: all 0.3s ease;
          }
          .btn-outline-theme:hover {
              background: var(--theme-color1);
              color: #fff;
          }
          .pricing-card.premium .btn-outline-theme {
              border-color: #fff;
              color: #fff;
          }
          .pricing-card.premium .btn-outline-theme:hover {
              background: #fff;
              color: var(--theme-color1);
          }
          .custom-solutions-box {
              background: #f8f9fa;
              border-radius: 15px;
              padding: 60px 40px;
              text-align: center;
              margin-top: 60px;
              border: 1px dashed #ccc;
          }
      </style>

      <!-- Google Business Solutions -->
      <section class="pricing-section section-padding pb-0">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="pricing-category-title" data-aos="fade-up">Google Business Solutions</h2>
                  <p class="pricing-category-desc" data-aos="fade-up" data-aos-delay="100">Build a stronger Google presence, improve local visibility, and help customers discover your business.</p>
              </div>
              <div class="row justify-content-center">
                  <!-- Plan A -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp">
                      <div class="pricing-card">
                          <h3 class="plan-name">Google Business Essentials</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹10,620</span>
                              <div class="price">₹7,670</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> GMB Page Creation</li>
                              <li><i class="fa fa-check-circle"></i> Phone Number Update</li>
                              <li><i class="fa fa-check-circle"></i> Suspended Location Recovery</li>
                              <li><i class="fa fa-check-circle"></i> Product Showcase</li>
                              <li><i class="fa fa-check-circle"></i> WhatsApp API</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Plan B -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="200ms">
                      <div class="pricing-card premium">
                          <h3 class="plan-name">Google SEO & Visibility</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹29,500</span>
                              <div class="price">₹23,600</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> Google SEO – 4 Keywords</li>
                              <li><i class="fa fa-check-circle"></i> Product Showcase</li>
                              <li><i class="fa fa-check-circle"></i> WhatsApp API</li>
                              <li><i class="fa fa-check-circle"></i> Facebook, Instagram & YouTube Updates</li>
                              <li><i class="fa fa-check-circle"></i> Festival Designs – 15 to 20</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Plan C -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="400ms">
                      <div class="pricing-card">
                          <h3 class="plan-name">Google Ads Management</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹10,620</span>
                              <div class="price">₹7,670</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> GMB Page Creation</li>
                              <li><i class="fa fa-check-circle"></i> Phone Number Update</li>
                              <li><i class="fa fa-check-circle"></i> Google Ads Setup</li>
                              <li><i class="fa fa-check-circle"></i> Keyword Management</li>
                              <li><i class="fa fa-check-circle"></i> WhatsApp API</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Website Development Plans -->
      <section class="pricing-section section-padding pb-0 bg-light">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="pricing-category-title" data-aos="fade-up">Website Development Plans</h2>
                  <p class="pricing-category-desc" data-aos="fade-up" data-aos-delay="100">Professional, responsive, performance-focused websites built around your business goals.</p>
              </div>
              <div class="row justify-content-center">
                  <!-- Basic -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp">
                      <div class="pricing-card">
                          <h3 class="plan-name">Basic Website</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹14,160</span>
                              <div class="price">₹8,260</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> Website Design</li>
                              <li><i class="fa fa-check-circle"></i> 1-Page Static Website (Landing/Portfolio)</li>
                              <li><i class="fa fa-check-circle"></i> Fully Responsive Design</li>
                              <li><i class="fa fa-check-circle"></i> Up to 1 Design Revision</li>
                              <li><i class="fa fa-check-circle"></i> Fast Loading & Optimized Layout</li>
                              <li><i class="fa fa-check-circle"></i> Free SSL Certificate Setup</li>
                              <li><i class="fa fa-check-circle"></i> Contact Form Integration</li>
                              <li><i class="fa fa-check-circle"></i> Social Media Links Integration</li>
                              <li><i class="fa fa-check-circle"></i> 1 Month Technical Support</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Standard -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="200ms">
                      <div class="pricing-card premium">
                          <h3 class="plan-name">Standard Website</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹23,600</span>
                              <div class="price">₹17,700</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> Website Design (Up to 10 Pages)</li>
                              <li><i class="fa fa-check-circle"></i> Up to 3 Design Revisions</li>
                              <li><i class="fa fa-check-circle"></i> Contact, Quote & Enquiry Forms</li>
                              <li><i class="fa fa-check-circle"></i> Business-Level SEO Optimization</li>
                              <li><i class="fa fa-check-circle"></i> 24/7 Technical Support</li>
                              <li><i class="fa fa-check-circle"></i> E-commerce Integration (Up to 20 Products)</li>
                              <li><i class="fa fa-check-circle"></i> Secure Payment Gateway Setup</li>
                              <li><i class="fa fa-check-circle"></i> Social Media Feed Integration</li>
                              <li><i class="fa fa-check-circle"></i> Speed & Performance Optimization</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Dynamic -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="400ms">
                      <div class="pricing-card">
                          <h3 class="plan-name">Dynamic Website</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹29,500</span>
                              <div class="price">₹23,500</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> Fully Customizable Dynamic Website</li>
                              <li><i class="fa fa-check-circle"></i> Unlimited Pages</li>
                              <li><i class="fa fa-check-circle"></i> Advanced E-commerce Store (100+ Products)</li>
                              <li><i class="fa fa-check-circle"></i> Multi-Vendor / Marketplace Setup</li>
                              <li><i class="fa fa-check-circle"></i> Unlimited Design Iterations (Design Phase)</li>
                              <li><i class="fa fa-check-circle"></i> Advanced SEO & Performance Analytics</li>
                              <li><i class="fa fa-check-circle"></i> Multilingual & Multi-Currency Compatibility</li>
                              <li><i class="fa fa-check-circle"></i> API, Shipping, SMS & Payment Integrations</li>
                              <li><i class="fa fa-check-circle"></i> 24/7 Priority Support & Dedicated Manager</li>
                              <li><i class="fa fa-check-circle"></i> CRM / ERP Integrations</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Digital Marketing Plans -->
      <section class="pricing-section section-padding pb-0">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="pricing-category-title" data-aos="fade-up">Digital Marketing Plans</h2>
                  <p class="pricing-category-desc" data-aos="fade-up" data-aos-delay="100">Grow your brand with strategic social media marketing, creative content, advertising, lead generation, and performance monitoring.</p>
              </div>
              <div class="row justify-content-center">
                  <!-- Plan A -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp">
                      <div class="pricing-card">
                          <h3 class="plan-name">Growth Starter</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹20,620</span>
                              <div class="price">₹16,000</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> 25 to 30 Leads</li>
                              <li><i class="fa fa-check-circle"></i> Facebook + Instagram + GMB Management</li>
                              <li><i class="fa fa-check-circle"></i> Campaign Creation – 1</li>
                              <li><i class="fa fa-check-circle"></i> FB & Insta Poster Designs – 10</li>
                              <li><i class="fa fa-check-circle"></i> Video Creations / Shoot Videos – 4</li>
                              <li><i class="fa fa-check-circle"></i> Monthly Report</li>
                              <li><i class="fa fa-check-circle"></i> Ads Monitoring</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Plan B -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="200ms">
                      <div class="pricing-card premium">
                          <h3 class="plan-name">Growth Plus</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹30,620</span>
                              <div class="price">₹25,000</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> 30 to 50 Leads</li>
                              <li><i class="fa fa-check-circle"></i> Facebook + Instagram + GMB Management</li>
                              <li><i class="fa fa-check-circle"></i> Campaign Creation – 1</li>
                              <li><i class="fa fa-check-circle"></i> FB & Insta Poster Designs – 15</li>
                              <li><i class="fa fa-check-circle"></i> Video Creations / Shoot Videos – 6</li>
                              <li><i class="fa fa-check-circle"></i> Skippable In-Stream Ads</li>
                              <li><i class="fa fa-check-circle"></i> Monthly Report & Ads Monitoring</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
                  <!-- Plan C -->
                  <div class="col-lg-4 col-md-6 mb-4 wow fadeInUp" data-wow-delay="400ms">
                      <div class="pricing-card">
                          <h3 class="plan-name">Growth Pro</h3>
                          <div class="price-wrap">
                              <span class="original-price">₹40,620</span>
                              <div class="price">₹35,000</div>
                          </div>
                          <ul class="features-list">
                              <li><i class="fa fa-check-circle"></i> 50 to 70 Leads</li>
                              <li><i class="fa fa-check-circle"></i> Facebook & Google Ads Accounts Setup</li>
                              <li><i class="fa fa-check-circle"></i> Skippable & Non-Skippable Ads</li>
                              <li><i class="fa fa-check-circle"></i> Detailed Audience Creation</li>
                              <li><i class="fa fa-check-circle"></i> FB & Insta Poster Designs – 22</li>
                              <li><i class="fa fa-check-circle"></i> Video Creations / Shoot Videos – 8</li>
                              <li><i class="fa fa-check-circle"></i> Monthly Report & Ads Monitoring</li>
                          </ul>
                          <div class="pricing-btn-wrap">
                              <a href="page-contact.html" class="btn-outline-theme">Get a Quote</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Custom Solutions & Final CTA Section -->
      <section class="section-padding">
          <div class="auto-container">
              <div class="custom-solutions-box wow fadeInUp">
                  <h3 class="mb-3">Need a Custom Package?</h3>
                  <p class="mb-4">Every business has different goals. If you need a combination of website development, SEO, Google Ads, social media marketing, graphic design, video production, or other digital services, our team can create a customized package for you.</p>
                  <a href="page-contact.html" class="theme-btn btn-style-one"><span class="btn-title">Talk to Our Team</span></a>
              </div>
              
              <div class="text-center mt-5 pt-4 wow fadeIn">
                  <h2 class="mb-3">Ready to Grow Your Business Online?</h2>
                  <p class="mb-4">Choose the right plan for your business and take the next step toward a stronger digital presence.</p>
                  <div class="d-flex justify-content-center gap-3">
                      <a href="page-contact.html" class="theme-btn btn-style-one"><span class="btn-title">GET A QUOTE</span></a>
                      <a href="page-contact.html" class="theme-btn btn-style-two"><span class="btn-title">CONTACT US</span></a>
                  </div>
              </div>
          </div>
      </section>
"""

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header + pricing_content + footer)
    print("Pricing page created successfully at:", output_file)

if __name__ == '__main__':
    create_price_page()
