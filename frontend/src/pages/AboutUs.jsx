import './AboutUs.css'
import { FaStar, FaShieldAlt, FaTruck, FaTag, FaUserCircle, FaHeadset } from 'react-icons/fa'

import pic1 from '../assets/aboutUs/pic1.svg'
import pic2 from '../assets/aboutUs/pic2.svg'
import pic3 from '../assets/aboutUs/pic3.svg'
import pic4 from '../assets/aboutUs/pic4.svg'
import pic5 from '../assets/aboutUs/pic5.svg'

function AboutUs() {
  return (
    <div className="about-page">
      {/* Breadcrumb + Title */}
      <div className="about-header">
        <p className="about-breadcrumb">Home &nbsp;› &nbsp;About Us</p>
        <h1 className="about-title">About Us</h1>
      </div>

      {/* Section 1: A Family That Keeps On Growing */}
      <section className="about-section about-dark">
        <div className="about-section-inner">
          <div className="about-text-block">
            <div className="about-heading-group">
              <h2>A Family That Keeps On Growing</h2>
            </div>
            <p>
              We always aim to please the home market, supplying great computers and hardware at great prices to non-corporate customers, through our large Melbourne CBD showroom and our online store.
            </p>
            <p>
              Shop management approach fosters a strong customer service focus in our staff. We prefer to cultivate long-term client relationships rather than achieve quick sales, demonstrated in the measure of our long-term success.
            </p>
          </div>
          <div className="about-image-block">
            <img
              src={pic1}
              alt="Team collaboration"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Shop.com */}
      <section className="about-section about-light about-reverse">
        <div className="about-section-inner">
          <div className="about-image-block">
            <img
              src={pic2}
              alt="Office workspace"
            />
          </div>
          <div className="about-text-block">
            <div className="about-heading-group">
              <div className="about-icon-box">
                <FaStar />
              </div>
              <h2>Shop.com</h2>
            </div>
            <p>
              Shop.com is a proudly Australian owned, Melbourne based supplier of I.T. goods and services, operating since 1991. Our client base encompasses individuals, small business, corporate and government organisations. We provide complete business IT solutions, centred on high quality hardware and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Now You're In Safe Hands */}
      <section className="about-section about-dark">
        <div className="about-section-inner">
          <div className="about-text-block">
            <div className="about-heading-group">
              <div className="about-icon-box">
                <FaShieldAlt />
              </div>
              <h2>Now You're In Safe Hands</h2>
            </div>
            <p>
              Experience a 40% boost in computing from last generation. MSI Desktop equips the 10th Gen. Intel® Core™ i7 processor with the upmost computing power to bring you an unparalleled gaming experience.
            </p>
            <p>
              *Performance compared to i7-9700. Specs varies by model.
            </p>
          </div>
          <div className="about-image-block">
            <img
              src={pic3}
              alt="Safe hands"
            />
          </div>
        </div>
      </section>

      {/* Section 4: The Highest Quality of Products */}
      <section className="about-section about-light about-reverse">
        <div className="about-section-inner">
          <div className="about-image-block">
            <img
              src={pic4}
              alt="Quality products"
            />
          </div>
          <div className="about-text-block">
            <div className="about-heading-group">
              <div className="about-icon-box">
                <FaStar />
              </div>
              <h2>The Highest Quality of Products</h2>
            </div>
            <p>
              We guarantee the highest quality of the products we sell. Several decades of successful operation and millions of happy customers let us feel certain about that. Besides, all items we sell pass thorough quality control, so no characteristics mismatch can escape the eye of our professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: We Deliver to Any Regions */}
      <section className="about-section about-dark">
        <div className="about-section-inner">
          <div className="about-text-block">
            <div className="about-heading-group">
              <div className="about-icon-box">
                <FaTruck />
              </div>
              <h2>We Deliver to Any Regions</h2>
            </div>
            <p>
              We deliver our goods all across Australia. No matter where you live, your order will be shipped in time and delivered right to your door or to any other location you have stated. The packages are handled with utmost care, so the ordered products will be handed to you safe and sound, just like you expect them to be.
            </p>
          </div>
          <div className="about-image-block">
            <img
              src={pic5 }
              alt="Delivery"
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="about-testimonial">
        <div className="testimonial-inner">
          <div className="testimonial-content">
            <span className="testimonial-quote">&ldquo;</span>
            <p className="testimonial-text">
              My first order arrived today in perfect condition. From the time I sent a question about the item to making the purchase, to the shipping and now the delivery, your company, Tecs, has stayed in touch. Such great service. I look forward to shopping on your site in the future and would highly recommend it.
            </p>
            <p className="testimonial-author">- Tama Brown</p>
          </div>
          <div className="testimonial-footer">
            <button className="review-btn">Leave Us A Review</button>
            <div className="testimonial-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Newsletter */}
      <section className="about-features">
        <div className="features-inner">
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>Product Support</h3>
            <p>Up to 3 years on-site warranty available for your peace of mind.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserCircle />
            </div>
            <h3>Personal Account</h3>
            <p>With big discounts, free delivery and a dedicated support specialist.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaTag />
            </div>
            <h3>Amazing Savings</h3>
            <p>Up to 70% off new Products, you can be sure of the best price.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
