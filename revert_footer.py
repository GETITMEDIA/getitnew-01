import os

def update_footer_content():
    price_file = r'd:\new-getit\nexella-html\price.html'

    with open(price_file, 'r', encoding='utf-8') as f:
        price_content = f.read()
    
    # Extract footer to replace in price.html
    start_marker = '<!-- Main Footer -->'
    end_marker = '<!--End Main Footer -->'
    
    old_start_idx = price_content.find(start_marker)
    old_end_idx = price_content.find(end_marker) + len(end_marker)
    
    if old_start_idx == -1 or old_end_idx == -1:
        print("Could not find footer in price.html")
        return
        
    new_footer = """<!-- Main Footer -->
      <footer class="footer-section-3 theme-color-bg pb-60">
        <div class="footer-main-wrapper">
          <div class="footer-circle-shape">
            <img src="images/home-3/footer-circle.png" alt="img" data-aos="fade-up">
          </div>
          <div class="auto-container">
            <div class="footer-widget-wrapper-3">
                <div class="row g-4">
                  <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                    <div class="footer-widget-single-items">
                        <div class="widget-head">
                          <a href="index.html" class="footer-logo"><img src="images/logo/getit_logo_light_trimmed.png" alt="GetIt Media Solutions" data-aos="fade-up" style="max-width: 200px;"></a>
                        </div>
                        <div class="footer-content">
                          <p class="footer-text mt-3">
                              We're here to listen and help you grow your business online. GetIt Media Solutions provides customized digital solutions for your brand.
                          </p>
                          <ul class="social-icon-two mt-5">
                              <li>
                                <a href="https://www.facebook.com/getitmediasolutions"><i class="fab fa-facebook"></i></a>
                              </li>
                              <li>
                                <a href="https://www.instagram.com/getitmediasolutions"><i class="fab fa-instagram"></i></a>
                              </li>
                              <li>
                                <a href="https://www.youtube.com/channel/UC6b2HvglRe3kztaasEYVNdQ"><i class="fab fa-youtube"></i></a>
                              </li>
                              <li>
                                <a href="https://www.google.com/search?q=Getit+Media+Solutions+Pvt+Ltd"><i class="fab fa-google"></i></a>
                              </li>
                          </ul>
                        </div>
                    </div>
                  </div>
                  <div class="col-xl-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                    <div class="footer-widget-single-items">
                      <div class="widget-head">
                          <h4 class="widget-title">Quick Link</h4>
                      </div>
                       <ul class="list-area">
                          <li>
                              <a href="index.html">
                                 Home
                              </a>
                          </li>
                          <li>
                              <a href="index.html#about">
                                 About Us
                              </a>
                          </li>
                          <li>
                              <a href="index.html#portfolio">
                                 Our Portfolio
                              </a>
                          </li>
                          <li>
                              <a href="index.html#contact">
                                 Careers
                              </a>
                          </li>
                          <li>
                              <a href="page-contact.html">
                                 Contact Us
                              </a>
                          </li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-xl-3 ps-xl-5 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                    <div class="footer-widget-single-items">
                      <div class="widget-head">
                          <h4 class="widget-title">Our Solutions</h4>
                      </div>
                       <ul class="list-area">
                          <li>
                              <a href="index.html#web">
                                Web Development
                              </a>
                          </li>
                          <li>
                              <a href="index.html#seo">
                                Search Engine Optimization
                              </a>
                          </li>
                          <li>
                              <a href="index.html#ads">
                                Google & Meta Ads
                              </a>
                          </li>
                          <li>
                              <a href="index.html#smm">
                                Social Media Marketing
                              </a>
                          </li>
                          <li>
                              <a href="video.html">
                                Graphic Design 
                              </a>
                          </li>
                      </ul>
                    </div>
                  </div>
                   <div class="col-xl-3 ps-xxl-5 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
                    <div class="footer-widget-single-items">
                      <div class="widget-head">
                          <h4 class="widget-title">Contact Us</h4>
                      </div>
                       <div class="widget-content">
                            <div class="contact-info-box">
                              <div class="icon-box">
                                <span class="icon fa fa-envelope"></span>
                              </div>
                              <div class="content-box">
                                <h6 class="title">Mail Us:</h6>
                                <div class="text"><a href="mailto:hello@getitmediasolutions.com" class="link">hello@getitmediasolutions.com</a></div>
                              </div>                  
                            </div>
                            <div class="contact-info-box">
                              <div class="icon-box">
                                <span class="icon fa fa-map-marker-alt"></span>
                              </div>
                              <div class="content-box">
                                <h6 class="title">Address :</h6>
                                <div class="text">4517 Washington Ave. Newyork  39495</div>
                              </div>                  
                            </div>
                            <div class="contact-info-box mb-0">
                              <div class="icon-box">
                                <span class="icon fa fa-phone"></span>
                              </div>
                              <div class="content-box">
                                <h6 class="title">Phone:</h6>
                                <div class="text"><a href="tel:1234567890" class="link">(123) 456-7890</a></div>
                              </div>                  
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
            </div>
            <p class="copyright-text wow fadeInUp" data-wow-delay=".3s">
              © 2026 Getit Media Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <!--End Main Footer -->"""
    
    updated_price_content = price_content[:old_start_idx] + new_footer + price_content[old_end_idx:]
    
    with open(price_file, 'w', encoding='utf-8') as f:
        f.write(updated_price_content)
        
    print("Successfully replaced footer in price.html with updated old layout content.")

if __name__ == '__main__':
    update_footer_content()
