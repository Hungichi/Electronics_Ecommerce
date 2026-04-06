import './Footer.css'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h3>Sign Up To Our Newsletter.</h3>
          <p>Be the first to hear about the latest offers.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email..." className="newsletter-input" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-section">
          <h4>Information</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="#zip">About Zip</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#search">Search</a></li>
            <li><a href="#terms">Terms</a></li>
            <li><a href="#orders">Orders and Returns</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#advanced">Advanced Search</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Desktop PCs</h4>
          <ul>
            <li><a href="#custom">Custom PCs</a></li>
            <li><a href="#servers">Servers</a></li>
            <li><a href="#msi">MSI All-In-One PCs</a></li>
            <li><a href="#hp">HP/Compaq PCs</a></li>
            <li><a href="#asus">ASUS PCs</a></li>
            <li><a href="#tecs">Tecs PCs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Laptops</h4>
          <ul>
            <li><a href="#everyday">Everyday Use Notebooks</a></li>
            <li><a href="#workstation">MSI Workstation Series</a></li>
            <li><a href="#prestige">MSI Prestige Series</a></li>
            <li><a href="#tablets">Tablets and Pads</a></li>
            <li><a href="#netbooks">Netbooks</a></li>
            <li><a href="#gaming">Infinity Gaming Notebooks</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>PC Parts</h4>
          <ul>
            <li><a href="#cpus">CPUS</a></li>
            <li><a href="#addon">Add On Cards</a></li>
            <li><a href="#drives">Hard Drives (Internal)</a></li>
            <li><a href="#graphics">Graphic Cards</a></li>
            <li><a href="#keyboard">Keyboards / Mice</a></li>
            <li><a href="#cases">Cases / Power Supplies / Cooling</a></li>
            <li><a href="#ram">RAM (Memory)</a></li>
            <li><a href="#software">Software</a></li>
            <li><a href="#speakers">Speakers / Headsets</a></li>
            <li><a href="#motherboard">Motherboards</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Address</h4>
          <div className="address-info">
            <p><strong>Address:</strong><br />14 Ngoc Khanh Ba Dinh<br />Hanoi</p>
            <p><strong>Phones:</strong><br />(+84) 1234 5678</p>
            <p><strong>We are open:</strong><br />Monday-Thursday: 9:00 AM - 5:30 PM<br />Friday: 9:00 AM - 6:00 PM<br />Saturday: 11:00 AM - 5:00 PM</p>
            <p><strong>E-mail:</strong><br />HV@email.com</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="payment-methods">
          <span> Visa</span>
          <span> PayPal</span>
          <span> Maestro</span>
          <span> Discover</span>
          <span> Amex</span>
        </div>

        <div className="social-media">
          <a href="#facebook" className="social-icon"><FaFacebook /></a>
          <a href="#twitter" className="social-icon"><FaTwitter /></a>
          <a href="#instagram" className="social-icon"><FaInstagram /></a>
          <a href="#linkedin" className="social-icon"><FaLinkedin /></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>&copy; 2024 Electronics Shop. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
