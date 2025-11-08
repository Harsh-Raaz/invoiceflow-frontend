// components/Homepage/Homepage.jsx
import React, { useState } from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import homepageimg from "../../assets/homepageimg.jpg"

const Homepage1 = () => { // Remove navigateTo from props
  const [logoHovered1, setLogoHovered1] = useState(false);

  return (
    <div className="homepage1">
      <nav className="navbar1">
        <div className="nav-container1">
          <div 
            className={`nav-logo1 ${logoHovered1 ? 'animate1' : ''}`}
            onMouseEnter={() => setLogoHovered1(true)}
            onMouseLeave={() => setLogoHovered1(false)}
          >
            <i className="fas fa-file-invoice-dollar"></i>
            <span>InvoiceFlow</span>
          </div>
          <div className="nav-menu1">
            <Link to="/pricing" className="nav-link1">
              <i className="fas fa-tags"></i>
              Pricing
            </Link>
            <Link to="/demo" className="nav-link1">
              <i className="fas fa-play-circle"></i>
              Demo
            </Link>
            <Link to="/contact" className="nav-link1">
              <i className="fas fa-envelope"></i>
              Contact
            </Link>
            <Link to="/about" className="nav-link1">
              <i className="fas fa-info-circle"></i>
              About
            </Link>
            <Link to="/history" className='nav-link1'>
              <i className="fas fa-history"></i>
              History
            </Link>
            <Link to="/" className="nav-link1 logout1">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content1">
        <section className="hero1">
          <div className="hero-content1">
            <h1 className="hero-heading animate-text">
              Create Professional Invoices in Minutes
            </h1>
            <p>Streamline your billing process with our easy-to-use invoice generator. Fast, professional, and completely free.</p>
            
            {/* Fix the button - Use Link directly */}
            <Link to="/invoice" className="cta-button1 cta-link1">
              Create your First Invoice
              <i className="fas fa-arrow-right"></i>
            </Link>
            
            <div className="hero-stats1">
              <div className="stat1">
                <span className="stat-number1">10K+</span>
                <span className="stat-label1">Invoices Created</span>
              </div>
              <div className="stat1">
                <span className="stat-number1">98%</span>
                <span className="stat-label1">Customer Satisfaction</span>
              </div>
              <div className="stat1">
                <span className="stat-number1">24/7</span>
                <span className="stat-label1">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-image1">
            <div className="floating-card1 card-11">
              <i className="fas fa-receipt"></i>
              <h4>Invoice Template</h4>
            </div>
            <div className="floating-card1 card-21">
              <i className="fas fa-file-pdf"></i>
              <h4>Export PDF</h4>
            </div>
            <div className="floating-card1 card-31">
              <i className="fab fa-whatsapp"></i>
              <h4>Share via WhatsApp</h4>
            </div>
            <div className="main-card1">
              <img src={homepageimg} alt="Invoice example" />
            </div>
          </div>
        </section>

        {/* Rest of your component remains the same */}
        <section className="features1">
          <h2>Why Choose <span className="gradient-text1">InvoiceFlow</span>?</h2>
          <div className="features-grid1">
            <div className="feature-card1">
              <div className="feature-icon1">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Quick & Easy</h3>
              <p>Create professional invoices in just a few clicks with our intuitive interface</p>
            </div>
            <div className="feature-card1">
              <div className="feature-icon1">
                <i className="fas fa-lock"></i>
              </div>
              <h3>Secure</h3>
              <p>Your data is protected with bank-level security and encryption</p>
            </div>
            <div className="feature-card1">
              <div className="feature-icon1">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Responsive</h3>
              <p>Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
            <div className="feature-card1">
              <div className="feature-icon1">
                <i className="fas fa-file-pdf"></i>
              </div>
              <h3>Multiple Formats</h3>
              <p>Export as PDF, Word, or send directly via email or WhatsApp</p>
            </div>
          </div>
        </section>

        <section className="testimonials1">
          <h2>What Our <span className="gradient-text1">Customers</span> Say</h2>
          <div className="testimonial-cards1">
            <div className="testimonial1">
              <div className="testimonial-content1">
                <div className="stars1">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"This invoice generator saved me hours of work each week. The templates are professional and the process is seamless. Highly recommended!"</p>
                <div className="testimonial-author1">
                  <span className="author-name1">Sarah Johnson</span>
                  <span className="author-title1">Freelancer</span>
                </div>
              </div>
            </div>
            <div className="testimonial1">
              <div className="testimonial-content1">
                <div className="stars1">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"The professional templates have helped me get paid faster. The WhatsApp integration is a game-changer for my business!"</p>
                <div className="testimonial-author1">
                  <span className="author-name1">Michael Chen</span>
                  <span className="author-title1">Small Business Owner</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer1">
        <p>&copy; 2023 InvoiceFlow. All rights reserved.</p>
        <div className="footer-links1">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage1;