import os

def create_contact():
    price_file = r'd:\new-getit\nexella-html\price.html'
    contact_file = r'd:\new-getit\nexella-html\contact.html'
    
    with open(price_file, 'r', encoding='utf-8') as f:
        price_content = f.read()
        
    # Extract Header (up to </aside>)
    header_end_marker = '</aside>'
    header_end_idx = price_content.find(header_end_marker) + len(header_end_marker)
    header = price_content[:header_end_idx]
    
    # Extract Footer (from <!-- Main Footer -->)
    footer_start_marker = '<!-- Main Footer -->'
    footer_start_idx = price_content.find(footer_start_marker)
    footer = price_content[footer_start_idx:]
    
    # Fix the title in header
    header = header.replace('<title>Nexella | IT Solutions & Technology HTML Template | Page Pricing</title>', '<title>GetIt Media Solutions | Contact Us</title>')
    header = header.replace('page-pricing.html', 'contact.html')
    
    # New Contact Page Body
    body = """
      
      <!-- Custom CSS for Contact Page -->
      <style>
          .contact-hero {
              padding: 120px 0 80px;
              background-color: #111;
              color: #fff;
              position: relative;
              overflow: hidden;
          }
          .contact-hero::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(232, 98, 44, 0.1) 0%, rgba(17, 17, 17, 0) 70%);
              z-index: 1;
              pointer-events: none;
          }
          .contact-hero-inner {
              position: relative;
              z-index: 2;
          }
          .eyebrow {
              color: var(--theme-color1);
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 15px;
              display: block;
          }
          .contact-hero-title {
              font-size: 3.5rem;
              font-weight: 800;
              margin-bottom: 20px;
              line-height: 1.2;
          }
          .contact-hero-desc {
              font-size: 1.2rem;
              color: #ccc;
              max-width: 800px;
              margin: 0 auto 40px;
          }
          .small-support {
              font-size: 0.9rem;
              color: #888;
              margin-top: 15px;
              display: block;
          }
          
          /* Contact Intro Section */
          .contact-intro {
              background-color: #f8f9fa;
              padding: 80px 0;
          }
          .section-heading-dark {
              font-size: 2.5rem;
              font-weight: 700;
              color: #222;
              margin-bottom: 20px;
          }
          .highlight-badges {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              justify-content: center;
              margin-top: 40px;
          }
          .badge-item {
              background: #fff;
              border: 1px solid #ddd;
              padding: 10px 20px;
              border-radius: 30px;
              color: #333;
              font-weight: 500;
              box-shadow: 0 4px 10px rgba(0,0,0,0.03);
              display: flex;
              align-items: center;
              gap: 10px;
          }
          .badge-item i {
              color: var(--theme-color1);
          }
          
          /* Info Cards */
          .info-cards-section {
              padding: 80px 0;
              background-color: #fff;
          }
          .info-card {
              background: #fff;
              border-radius: 15px;
              padding: 40px 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              text-align: center;
              height: 100%;
              border: 1px solid #eee;
              transition: all 0.3s ease;
          }
          .info-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 40px rgba(0,0,0,0.1);
              border-color: var(--theme-color1);
          }
          .info-icon {
              width: 70px;
              height: 70px;
              background: rgba(232, 98, 44, 0.1);
              color: var(--theme-color1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.8rem;
              margin: 0 auto 20px;
          }
          .info-title {
              font-size: 1.4rem;
              font-weight: 700;
              color: #222;
              margin-bottom: 15px;
          }
          .info-desc {
              color: #666;
              margin-bottom: 25px;
          }
          .info-detail {
              font-weight: 600;
              color: #333;
              margin-bottom: 20px;
              display: block;
              word-break: break-word;
          }
          
          /* Form Section */
          .form-section {
              padding: 100px 0;
              background: #f8f9fa;
          }
          .contact-form-wrapper {
              background: #fff;
              padding: 50px;
              border-radius: 20px;
              box-shadow: 0 15px 50px rgba(0,0,0,0.05);
          }
          .form-control, .form-select {
              padding: 15px 20px;
              border-radius: 8px;
              border: 1px solid #ddd;
              margin-bottom: 20px;
              background-color: #fcfcfc;
          }
          .form-control:focus, .form-select:focus {
              border-color: var(--theme-color1);
              box-shadow: 0 0 0 0.2rem rgba(232, 98, 44, 0.25);
          }
          .privacy-text {
              font-size: 0.85rem;
              color: #888;
              margin-top: 15px;
          }
          
          /* Why Us Section */
          .why-us-section {
              background-color: #111;
              color: #fff;
              padding: 100px 0;
          }
          .why-block {
              padding: 30px;
              border-radius: 15px;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.05);
              height: 100%;
              transition: all 0.3s ease;
          }
          .why-block:hover {
              background: rgba(255,255,255,0.05);
              border-color: var(--theme-color1);
          }
          .why-block-title {
              font-size: 1.3rem;
              font-weight: 700;
              color: #fff;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
          }
          .why-block-title i {
              color: var(--theme-color1);
          }
          .why-block-desc {
              color: #aaa;
              margin: 0;
          }
          
          /* Services Quick Section */
          .services-quick {
              padding: 80px 0;
              background: #fff;
              text-align: center;
          }
          .services-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              justify-content: center;
              margin: 40px 0;
          }
          .service-pill {
              background: #f8f9fa;
              border: 1px solid #eee;
              padding: 12px 25px;
              border-radius: 30px;
              color: #333;
              font-weight: 600;
              transition: all 0.3s ease;
          }
          .service-pill:hover {
              background: var(--theme-color1);
              color: #fff;
              border-color: var(--theme-color1);
          }
          
          /* Project Enquiry Banner */
          .enquiry-banner {
              background: linear-gradient(135deg, var(--theme-color1) 0%, var(--theme-color2) 100%);
              padding: 80px 0;
              color: #fff;
              text-align: center;
          }
          .enquiry-banner-title {
              font-size: 3rem;
              font-weight: 800;
              color: #fff;
              margin-bottom: 20px;
          }
          
          /* FAQ Section */
          .faq-section {
              padding: 100px 0;
              background: #f8f9fa;
          }
          .accordion-item {
              border: none;
              margin-bottom: 15px;
              border-radius: 10px !important;
              overflow: hidden;
              box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          }
          .accordion-button {
              padding: 20px 25px;
              font-weight: 600;
              color: #222;
              background: #fff;
          }
          .accordion-button:not(.collapsed) {
              background: #fff;
              color: var(--theme-color1);
              box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
          }
          .accordion-button:focus {
              box-shadow: none;
          }
          .accordion-body {
              background: #fff;
              color: #666;
              padding: 20px 25px;
          }
          
          /* Final CTA */
          .final-cta {
              padding: 100px 0;
              background: #111;
              text-align: center;
              color: #fff;
          }
          .final-line {
              margin-top: 40px;
              color: #666;
              font-weight: 600;
              letter-spacing: 2px;
          }
      </style>

      <!-- Hero Section -->
      <section class="contact-hero">
          <div class="auto-container contact-hero-inner text-center">
              <span class="eyebrow" data-aos="fade-up">Let's Create Something Great</span>
              <h1 class="contact-hero-title" data-aos="fade-up" data-aos-delay="100">Let's Build Your Digital Future</h1>
              <p class="contact-hero-desc" data-aos="fade-up" data-aos-delay="200">Have a project in mind? Whether you need a powerful website, digital marketing strategy, creative design, or a complete online growth solution, GetIt Media Solutions is ready to bring your ideas to life.</p>
              <div class="d-flex justify-content-center gap-3" data-aos="fade-up" data-aos-delay="300">
                  <a href="#enquiry-form" class="theme-btn btn-style-one"><span class="btn-title">START YOUR PROJECT</span></a>
                  <a href="tel:04134900887" class="theme-btn btn-style-two"><span class="btn-title">TALK TO OUR TEAM</span></a>
              </div>
              <span class="small-support" data-aos="fade-up" data-aos-delay="400">Tell us what you need. We'll help you find the right digital solution.</span>
          </div>
      </section>

      <!-- Contact Introduction -->
      <section class="contact-intro text-center">
          <div class="auto-container">
              <h2 class="section-heading-dark" data-aos="fade-up">Let's Talk About Your Project</h2>
              <p class="text-muted mx-auto" style="max-width: 700px; font-size: 1.1rem;" data-aos="fade-up" data-aos-delay="100">Every business has a different goal. Share your requirements with us and our team will understand your needs, recommend the right solution, and help you move forward with confidence.</p>
              
              <div class="highlight-badges" data-aos="fade-up" data-aos-delay="200">
                  <div class="badge-item"><i class="fa fa-laptop-code"></i> Have a Website Project?</div>
                  <div class="badge-item"><i class="fa fa-chart-line"></i> Need More Leads?</div>
                  <div class="badge-item"><i class="fa fa-search"></i> Want Better Online Visibility?</div>
                  <div class="badge-item"><i class="fa fa-paint-brush"></i> Looking for Creative Services?</div>
              </div>
              <p class="mt-4 text-muted fw-bold" data-aos="fade-up" data-aos-delay="300">From your first idea to the final launch, we're here to help.</p>
          </div>
      </section>

      <!-- Contact Information Cards -->
      <section class="info-cards-section">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="section-heading-dark" data-aos="fade-up">Get In Touch</h2>
              </div>
              <div class="row g-4 justify-content-center">
                  <!-- Card 1 -->
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                      <div class="info-card">
                          <div class="info-icon"><i class="fa fa-phone"></i></div>
                          <h3 class="info-title">Call Us</h3>
                          <p class="info-desc">Speak directly with our team about your project requirements.</p>
                          <span class="info-detail">0413-4900887<br>98439 26286</span>
                          <a href="tel:04134900887" class="btn btn-outline-dark w-100 rounded-pill fw-bold">CALL NOW</a>
                      </div>
                  </div>
                  <!-- Card 2 -->
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                      <div class="info-card">
                          <div class="info-icon"><i class="fa fa-envelope"></i></div>
                          <h3 class="info-title">Email Us</h3>
                          <p class="info-desc">Send us your requirements, questions, or project details.</p>
                          <span class="info-detail">anthoni.g@getitmediasolutions.in</span>
                          <a href="mailto:anthoni.g@getitmediasolutions.in" class="btn btn-outline-dark w-100 rounded-pill fw-bold">SEND EMAIL</a>
                      </div>
                  </div>
                  <!-- Card 3 -->
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                      <div class="info-card">
                          <div class="info-icon"><i class="fab fa-whatsapp"></i></div>
                          <h3 class="info-title">WhatsApp</h3>
                          <p class="info-desc">Have a quick question? Start a conversation with our team.</p>
                          <span class="info-detail">98439 26286</span>
                          <a href="https://wa.me/919843926286" target="_blank" class="btn btn-outline-dark w-100 rounded-pill fw-bold">CHAT ON WHATSAPP</a>
                      </div>
                  </div>
                  <!-- Card 4 -->
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="400ms">
                      <div class="info-card">
                          <div class="info-icon"><i class="fa fa-map-marker-alt"></i></div>
                          <h3 class="info-title">Visit Us</h3>
                          <p class="info-desc">Connect with us and discuss your digital requirements.</p>
                          <span class="info-detail">No.10 2nd Floor, 4th Cross,<br>Victoria Nagar, Puducherry</span>
                          <a href="https://maps.google.com" target="_blank" class="btn btn-outline-dark w-100 rounded-pill fw-bold">GET DIRECTIONS</a>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Contact Form -->
      <section class="form-section" id="enquiry-form">
          <div class="auto-container">
              <div class="row align-items-center">
                  <div class="col-lg-5 mb-5 mb-lg-0 pr-lg-5 wow fadeInLeft">
                      <h2 class="section-heading-dark">Tell Us About Your Project</h2>
                      <p class="text-muted fs-5 mb-4">Complete the form below and our team will get back to you regarding your requirements.</p>
                      <img src="images/resource/contact-illustration.png" alt="Contact Us" class="img-fluid rounded-4 shadow-sm" onerror="this.style.display='none'">
                  </div>
                  <div class="col-lg-7 wow fadeInRight">
                      <div class="contact-form-wrapper">
                          <form id="contact-form" action="#" method="post">
                              <div class="row">
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Full Name *</label>
                                          <input type="text" name="name" class="form-control" placeholder="Enter your full name" required>
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Email Address *</label>
                                          <input type="email" name="email" class="form-control" placeholder="Enter your email address" required>
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Phone Number *</label>
                                          <input type="text" name="phone" class="form-control" placeholder="Enter your phone number" required>
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Company Name</label>
                                          <input type="text" name="company" class="form-control" placeholder="Enter your company name">
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Service Required *</label>
                                          <select name="service" class="form-select" required>
                                              <option value="" disabled selected>Select a service</option>
                                              <option value="Website Design & Development">Website Design & Development</option>
                                              <option value="Search Engine Optimization">Search Engine Optimization</option>
                                              <option value="Google Ads">Google Ads</option>
                                              <option value="Meta Ads">Meta Ads</option>
                                              <option value="Social Media Marketing">Social Media Marketing</option>
                                              <option value="Google Business Profile">Google Business Profile</option>
                                              <option value="Graphic Design">Graphic Design</option>
                                              <option value="Video Editing">Video Editing</option>
                                              <option value="Branding & Logo Design">Branding & Logo Design</option>
                                              <option value="E-commerce Website">E-commerce Website</option>
                                              <option value="UI/UX Design">UI/UX Design</option>
                                              <option value="Other">Other</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div class="col-md-6">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Budget Range</label>
                                          <select name="budget" class="form-select">
                                              <option value="" disabled selected>Select a budget</option>
                                              <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000</option>
                                              <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                                              <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                                              <option value="₹1,00,000+">₹1,00,000+</option>
                                              <option value="Not Sure Yet">Not Sure Yet</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div class="col-12">
                                      <div class="form-group">
                                          <label class="fw-bold mb-2">Project Details *</label>
                                          <textarea name="message" class="form-control" rows="4" placeholder="Tell us about your project, goals, requirements, and timeline..." required></textarea>
                                      </div>
                                  </div>
                                  <div class="col-12 mb-4">
                                      <label class="fw-bold mb-2 d-block">Preferred Contact Method:</label>
                                      <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="contact_method" id="methodPhone" value="Phone" checked>
                                          <label class="form-check-label" for="methodPhone">Phone</label>
                                      </div>
                                      <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="contact_method" id="methodWhatsapp" value="WhatsApp">
                                          <label class="form-check-label" for="methodWhatsapp">WhatsApp</label>
                                      </div>
                                      <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="contact_method" id="methodEmail" value="Email">
                                          <label class="form-check-label" for="methodEmail">Email</label>
                                      </div>
                                  </div>
                                  <div class="col-12">
                                      <button type="submit" class="theme-btn btn-style-one w-100 border-0" style="padding: 18px;"><span class="btn-title fs-5">SEND PROJECT ENQUIRY</span></button>
                                      <p class="privacy-text text-center"><i class="fa fa-lock me-1"></i> Your information is used only to understand your requirements and respond to your enquiry.</p>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Why Contact Us -->
      <section class="why-us-section">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="text-white fw-bold mb-3" data-aos="fade-up">More Than Just a Service Provider</h2>
                  <p class="text-white-50 fs-5 mx-auto" style="max-width: 800px;" data-aos="fade-up" data-aos-delay="100">We work with businesses to create meaningful digital experiences that combine strategy, creativity, technology, and performance.</p>
              </div>
              <div class="row g-4">
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                      <div class="why-block">
                          <h4 class="why-block-title"><i class="fa fa-chess-knight"></i> Strategy</h4>
                          <p class="why-block-desc">Understand your goals and build a digital strategy around your business.</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                      <div class="why-block">
                          <h4 class="why-block-title"><i class="fa fa-palette"></i> Creativity</h4>
                          <p class="why-block-desc">Create memorable designs, content, and digital experiences that represent your brand.</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                      <div class="why-block">
                          <h4 class="why-block-title"><i class="fa fa-microchip"></i> Technology</h4>
                          <p class="why-block-desc">Build modern, responsive, user-friendly digital solutions.</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="400ms">
                      <div class="why-block">
                          <h4 class="why-block-title"><i class="fa fa-arrow-trend-up"></i> Growth</h4>
                          <p class="why-block-desc">Focus on visibility, engagement, leads, and long-term digital growth.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Services Quick Section -->
      <section class="services-quick">
          <div class="auto-container">
              <h2 class="section-heading-dark" data-aos="fade-up">What Can We Help You With?</h2>
              <p class="text-muted fs-5" data-aos="fade-up" data-aos-delay="100">From building your digital foundation to growing your online presence, explore our core services.</p>
              
              <div class="services-grid" data-aos="fade-up" data-aos-delay="200">
                  <a href="index.html#gmb" class="service-pill">Google Business Profile</a>
                  <a href="index.html#ads" class="service-pill">Google Ads & Meta Ads</a>
                  <a href="index.html#smm" class="service-pill">Social Media Marketing</a>
                  <a href="index.html#seo" class="service-pill">Search Engine Optimization</a>
                  <a href="index.html#web" class="service-pill">Website Design & Development</a>
                  <a href="video.html" class="service-pill">Graphic Design</a>
                  <a href="video-editor.html" class="service-pill">Video Editing</a>
                  <a href="index.html#branding" class="service-pill">Branding & Creative Services</a>
              </div>
              
              <a href="index.html#services" class="theme-btn btn-style-one mt-2" data-aos="fade-up" data-aos-delay="300"><span class="btn-title">EXPLORE OUR SERVICES</span></a>
          </div>
      </section>

      <!-- Project Enquiry Banner -->
      <section class="enquiry-banner">
          <div class="auto-container">
              <div class="row justify-content-center">
                  <div class="col-lg-9 wow zoomIn">
                      <h2 class="enquiry-banner-title">Have an Idea? Let's Turn It Into Reality.</h2>
                      <p class="fs-5 mb-5 opacity-75">Don't worry if your project is still in the planning stage. Tell us your idea, and we'll help you turn it into a clear digital plan.</p>
                      <div class="d-flex justify-content-center gap-3">
                          <a href="#enquiry-form" class="btn btn-light btn-lg fw-bold rounded-pill px-5 text-dark">START A CONVERSATION</a>
                          <a href="index.html#services" class="btn btn-outline-light btn-lg fw-bold rounded-pill px-5">VIEW OUR SERVICES</a>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
          <div class="auto-container">
              <div class="text-center mb-5">
                  <h2 class="section-heading-dark" data-aos="fade-up">Frequently Asked Questions</h2>
              </div>
              <div class="row justify-content-center">
                  <div class="col-lg-8 wow fadeInUp" data-wow-delay="100ms">
                      <div class="accordion" id="contactFaq">
                          <!-- FAQ 1 -->
                          <div class="accordion-item">
                              <h2 class="accordion-header" id="headingOne">
                                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                      What services does GetIt Media Solutions provide?
                                  </button>
                              </h2>
                              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#contactFaq">
                                  <div class="accordion-body">
                                      We provide digital marketing, website development, SEO, Google Ads, Meta Ads, social media marketing, graphic design, video editing, branding, and other creative digital solutions.
                                  </div>
                              </div>
                          </div>
                          <!-- FAQ 2 -->
                          <div class="accordion-item">
                              <h2 class="accordion-header" id="headingTwo">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                      Can I request a customized package?
                                  </button>
                              </h2>
                              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#contactFaq">
                                  <div class="accordion-body">
                                      Yes. We can discuss your business goals and requirements and create a solution based on the services your business needs.
                                  </div>
                              </div>
                          </div>
                          <!-- FAQ 3 -->
                          <div class="accordion-item">
                              <h2 class="accordion-header" id="headingThree">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                      How do I start a project?
                                  </button>
                              </h2>
                              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#contactFaq">
                                  <div class="accordion-body">
                                      Simply contact our team or submit the project enquiry form with your requirements. Our team will review the details and contact you.
                                  </div>
                              </div>
                          </div>
                          <!-- FAQ 4 -->
                          <div class="accordion-item">
                              <h2 class="accordion-header" id="headingFour">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                      Do you work with businesses of different sizes?
                                  </button>
                              </h2>
                              <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#contactFaq">
                                  <div class="accordion-body">
                                      Yes. Our digital solutions can be tailored according to the requirements, goals, and scale of each business.
                                  </div>
                              </div>
                          </div>
                          <!-- FAQ 5 -->
                          <div class="accordion-item">
                              <h2 class="accordion-header" id="headingFive">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                      How can I get a quotation?
                                  </button>
                              </h2>
                              <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#contactFaq">
                                  <div class="accordion-body">
                                      Send us your project requirements through the contact form, WhatsApp, email, or phone. Our team can discuss your needs and provide the appropriate quotation.
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Final CTA -->
      <section class="final-cta">
          <div class="auto-container">
              <h2 class="contact-hero-title mb-4" data-aos="fade-up">Your Next Digital Move Starts Here.</h2>
              <p class="fs-5 text-white-50 mb-5 mx-auto" style="max-width: 700px;" data-aos="fade-up" data-aos-delay="100">Let's discuss your idea, understand your goals, and create a digital solution that works for your business.</p>
              
              <div class="d-flex justify-content-center gap-3 mb-5" data-aos="fade-up" data-aos-delay="200">
                  <a href="#enquiry-form" class="theme-btn btn-style-one"><span class="btn-title">GET A QUOTE</span></a>
                  <a href="tel:04134900887" class="theme-btn btn-style-two"><span class="btn-title">CONTACT GETIT MEDIA</span></a>
              </div>
              
              <div class="final-line" data-aos="fade-up" data-aos-delay="300">GETIT MEDIA SOLUTIONS — DIGITAL IDEAS. REAL RESULTS.</div>
          </div>
      </section>
      
      <!-- Script for form submission alert -->
      <script>
      document.addEventListener('DOMContentLoaded', function() {
          const form = document.getElementById('contact-form');
          if(form) {
              form.addEventListener('submit', function(e) {
                  e.preventDefault();
                  alert("Thank you for contacting GetIt Media Solutions. We've received your enquiry and our team will get in touch with you shortly.");
                  form.reset();
              });
          }
      });
      </script>

"""

    with open(contact_file, 'w', encoding='utf-8') as f:
        f.write(header + body + footer)
        
    print(f"Successfully generated {contact_file}")

if __name__ == '__main__':
    create_contact()
